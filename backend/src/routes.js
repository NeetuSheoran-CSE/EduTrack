import {Router} from 'express';
import {User,Student,Teacher,ClassSection,Attendance,Payment,Result,Notice} from './models.js';
import {sign,protect,allow,studentFilter} from './auth.js';

const h=f=>(q,s,n)=>f(q,s,n).catch(n);
const pick=(o,k)=>Object.fromEntries(k.filter(x=>o[x]!==undefined).map(x=>[x,o[x]]));
const day=d=>{const x=new Date(d||Date.now());x.setUTCHours(0,0,0,0);return x};
const esc=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const grade=p=>p>=90?'A+':p>=80?'A':p>=70?'B+':p>=60?'B':p>=50?'C':p>=33?'D':'F';
const feeStatus=s=>s.remaining<=0?'Paid':s.dueDate&&new Date(s.dueDate)<new Date()?'Overdue':'Pending';
const bad=(m,c=400)=>Object.assign(new Error(m),{status:c});
const nextId=async()=>{const l=await Student.findOne().sort({studentId:-1});return 'ET-'+((l?+l.studentId.slice(3):1000)+1)};
const canSee=async(u,id)=>!!(await Student.exists({_id:id,...studentFilter(u)}));

// attach paid / remaining / attendance % / fee status to students
const enrich=async list=>{const ids=list.map(s=>s._id);
  const [p,a]=await Promise.all([
    Payment.aggregate([{$match:{student:{$in:ids}}},{$group:{_id:'$student',paid:{$sum:'$amount'}}}]),
    Attendance.aggregate([{$match:{student:{$in:ids}}},{$group:{_id:'$student',total:{$sum:1},ok:{$sum:{$cond:[{$in:['$status',['P','L']]},1,0]}}}}])]);
  const pm=Object.fromEntries(p.map(x=>[String(x._id),x.paid])),am=Object.fromEntries(a.map(x=>[String(x._id),x.total?Math.round(x.ok/x.total*100):100]));
  return list.map(s=>{const paid=pm[s._id]||0,o={...s.toObject(),paid,remaining:s.annualFee-paid,attendancePct:am[s._id]??100};return {...o,feeStatus:feeStatus(o)}})};

const r=Router();

/* ---------- Auth ---------- */
r.post('/auth/login',h(async(q,s)=>{const {email,password}=q.body;if(!email||!password)throw bad('Email and password are required');
  const u=await User.findOne({email:String(email).toLowerCase()}).select('+password');
  if(!u||!(await u.check(password)))throw bad('Invalid email or password',401);
  s.json({token:sign(u._id),user:{id:u._id,name:u.name,email:u.email,role:u.role,student:u.student,classes:u.classes}})}));
r.use(protect);
r.get('/auth/me',(q,s)=>s.json(q.user));
r.put('/auth/profile',h(async(q,s)=>{Object.assign(q.user,pick(q.body,['name','email']));await q.user.save();s.json(q.user)}));
r.put('/auth/password',h(async(q,s)=>{const u=await User.findById(q.user._id).select('+password');
  if(!(await u.check(q.body.current)))throw bad('Current password is incorrect',401);u.password=q.body.password;await u.save();s.json({message:'Password updated'})}));

/* ---------- Students ---------- */
r.get('/students',allow('admin','teacher'),h(async(q,s)=>{const f={...studentFilter(q.user)};
  if(q.query.cls)f.cls=String(q.query.cls);if(q.query.q)f.name=new RegExp(esc(String(q.query.q)),'i');
  s.json(await enrich(await Student.find(f).sort({cls:1,roll:1})))}));
r.get('/students/:id',h(async(q,s)=>{if(!(await canSee(q.user,q.params.id)))throw bad('Student not found',404);
  s.json((await enrich([await Student.findById(q.params.id)]))[0])}));
r.post('/students',allow('admin'),h(async(q,s)=>{const d=pick(q.body,['name','cls','roll','annualFee','dueDate']);
  const st=await Student.create({...d,studentId:await nextId()});
  if(q.body.email&&q.body.password)await User.create({name:st.name,email:q.body.email,password:q.body.password,role:'student',student:st._id,classes:[st.cls]});
  s.status(201).json(st)}));
r.put('/students/:id',allow('admin'),h(async(q,s)=>{const st=await Student.findByIdAndUpdate(q.params.id,pick(q.body,['name','cls','roll','annualFee','dueDate']),{new:true,runValidators:true});
  if(!st)throw bad('Student not found',404);s.json(st)}));
r.delete('/students/:id',allow('admin'),h(async(q,s)=>{const st=await Student.findByIdAndDelete(q.params.id);if(!st)throw bad('Student not found',404);
  await Promise.all([Attendance.deleteMany({student:st._id}),Payment.deleteMany({student:st._id}),Result.deleteMany({student:st._id}),User.deleteMany({student:st._id})]);s.json({message:'Student deleted'})}));

/* ---------- Attendance ---------- */
r.get('/attendance',allow('admin','teacher'),h(async(q,s)=>{const f={...studentFilter(q.user)};if(q.query.cls)f.cls=String(q.query.cls);
  const sts=await Student.find(f).sort({roll:1}),recs=await Attendance.find({student:{$in:sts.map(x=>x._id)},date:day(q.query.date)});
  const m=Object.fromEntries(recs.map(x=>[String(x.student),x.status]));
  s.json(sts.map(x=>({student:x._id,studentId:x.studentId,name:x.name,roll:x.roll,cls:x.cls,status:m[x._id]||null})))}));
r.post('/attendance',allow('admin','teacher'),h(async(q,s)=>{const {date,records}=q.body;if(!Array.isArray(records)||!records.length)throw bad('records are required');
  const ids=records.map(x=>x.student),ok=await Student.countDocuments({_id:{$in:ids},...studentFilter(q.user)});
  if(ok!==ids.length)throw bad('You can only mark attendance for your assigned classes',403);
  if(records.some(x=>!['P','A','L'].includes(x.status)))throw bad('Status must be P, A or L');
  const d=day(date);await Attendance.bulkWrite(records.map(x=>({updateOne:{filter:{student:x.student,date:d},update:{$set:{status:x.status}},upsert:true}})));
  s.json({message:'Attendance saved',count:records.length})}));
r.get('/attendance/student/:id',h(async(q,s)=>{if(!(await canSee(q.user,q.params.id)))throw bad('Student not found',404);
  s.json(await Attendance.aggregate([{$match:{student:(await Student.findById(q.params.id))._id}},{$group:{_id:{$dateToString:{format:'%Y-%m',date:'$date'}},total:{$sum:1},present:{$sum:{$cond:[{$in:['$status',['P','L']]},1,0]}}}},{$sort:{_id:1}}]))}));

/* ---------- Fees ---------- */
r.get('/fees',allow('admin'),h(async(q,s)=>{const rows=await enrich(await Student.find().sort({cls:1,roll:1}));
  const t=k=>rows.reduce((a,x)=>a+x[k],0);
  s.json({summary:{total:t('annualFee'),collected:t('paid'),pending:t('remaining'),overdue:rows.filter(x=>x.feeStatus==='Overdue').reduce((a,x)=>a+x.remaining,0)},rows})}));
r.post('/fees/payments',allow('admin'),h(async(q,s)=>{const {student,amount,mode}=q.body;const st=await Student.findById(student);if(!st)throw bad('Student not found',404);
  const [e]=await enrich([st]);if(!(amount>0)||amount>e.remaining)throw bad(`Amount must be between 1 and ${e.remaining}`);
  const p=await Payment.create({receiptNo:'R-'+Date.now().toString(36).toUpperCase(),student,amount,mode,recordedBy:q.user._id});s.status(201).json(p)}));
r.get('/fees/payments',h(async(q,s)=>{const f=q.query.student?{student:q.query.student}:{};
  if(q.user.role==='student')f.student=q.user.student;else if(q.user.role==='teacher')throw bad('Forbidden',403);
  s.json(await Payment.find(f).populate('student','name studentId cls').sort({date:-1}))}));
r.get('/fees/receipt/:id',h(async(q,s)=>{const p=await Payment.findById(q.params.id).populate('student');if(!p||!(await canSee(q.user,p.student._id)))throw bad('Receipt not found',404);
  const [e]=await enrich([p.student]);s.json({receiptNo:p.receiptNo,date:p.date,amount:p.amount,mode:p.mode,student:{name:e.name,studentId:e.studentId,cls:e.cls},balance:e.remaining})}));

/* ---------- Results & report cards ---------- */
r.get('/results',allow('admin','teacher'),h(async(q,s)=>{const {cls,exam='Half-Yearly',subject}=q.query;if(!subject)throw bad('subject is required');
  const f={...studentFilter(q.user)};if(cls)f.cls=String(cls);const sts=await Student.find(f).sort({roll:1});
  const rs=await Result.find({student:{$in:sts.map(x=>x._id)},exam,subject});const m=Object.fromEntries(rs.map(x=>[String(x.student),x.obtained]));
  s.json(sts.map(x=>{const o=m[x._id]??null;return {student:x._id,roll:x.roll,name:x.name,subject,max:100,obtained:o,percentage:o,grade:o==null?null:grade(o),status:o==null?null:o>=33?'Pass':'Fail'}}))}));
r.post('/results',allow('admin','teacher'),h(async(q,s)=>{const {exam='Half-Yearly',subject,records}=q.body;if(!subject||!Array.isArray(records))throw bad('subject and records are required');
  const ids=records.map(x=>x.student);if(await Student.countDocuments({_id:{$in:ids},...studentFilter(q.user)})!==ids.length)throw bad('You can only enter results for your assigned classes',403);
  if(records.some(x=>!(x.obtained>=0&&x.obtained<=100)))throw bad('Marks must be between 0 and 100');
  await Result.bulkWrite(records.map(x=>({updateOne:{filter:{student:x.student,exam,subject},update:{$set:{obtained:x.obtained,max:100}},upsert:true}})));s.json({message:'Results saved'})}));
r.get('/report-card/:id',h(async(q,s)=>{if(!(await canSee(q.user,q.params.id)))throw bad('Student not found',404);const exam=q.query.exam||'Half-Yearly';
  const [st]=await enrich([await Student.findById(q.params.id)]),rs=await Result.find({student:st._id,exam}).sort({subject:1});
  if(!rs.length)throw bad('No results entered for this student yet',404);
  const total=rs.reduce((a,x)=>a+x.max,0),got=rs.reduce((a,x)=>a+x.obtained,0),pct=+(got/total*100).toFixed(1);
  s.json({school:{name:'EduTrack Public School',address:'Sector 45, Gurugram, Haryana 122003'},exam,academicYear:'2026-27',
    student:{name:st.name,studentId:st.studentId,cls:st.cls.split('-')[0],section:st.cls.split('-')[1],roll:st.roll},
    subjects:rs.map(x=>({subject:x.subject,max:x.max,obtained:x.obtained,grade:grade(x.obtained/x.max*100)})),
    totalMarks:total,marksObtained:got,percentage:pct,overallGrade:grade(pct),result:pct>=50?'Pass':'Needs Improvement',attendancePct:st.attendancePct})}));

/* ---------- Dashboard ---------- */
r.get('/dashboard',allow('admin','teacher'),h(async(q,s)=>{const sts=await Student.find(studentFilter(q.user)),ids=sts.map(x=>x._id),today=day();
  const since=new Date(today);since.setUTCDate(since.getUTCDate()-6);
  const [rows,todayAtt,weekly,fees]=await Promise.all([enrich(sts),Attendance.find({student:{$in:ids},date:today}),
    Attendance.aggregate([{$match:{student:{$in:ids},date:{$gte:since}}},{$group:{_id:{$dateToString:{format:'%Y-%m-%d',date:'$date'}},present:{$sum:{$cond:[{$ne:['$status','A']},1,0]}},absent:{$sum:{$cond:[{$eq:['$status','A']},1,0]}}}},{$sort:{_id:1}}]),
    q.user.role==='admin'?Payment.aggregate([{$group:{_id:{$dateToString:{format:'%Y-%m',date:'$date'}},collected:{$sum:'$amount'}}},{$sort:{_id:1}}]):[]]);
  const out={totalStudents:sts.length,presentToday:todayAtt.filter(x=>x.status!=='A').length,absentToday:todayAtt.filter(x=>x.status==='A').length,
    averageAttendance:rows.length?Math.round(rows.reduce((a,x)=>a+x.attendancePct,0)/rows.length):0,weeklyAttendance:weekly};
  if(q.user.role==='admin')Object.assign(out,{feesCollected:rows.reduce((a,x)=>a+x.paid,0),pendingFees:rows.reduce((a,x)=>a+x.remaining,0),monthlyFees:fees});
  s.json(out)}));

/* ---------- Teachers & classes (admin) ---------- */
const crud=(path,M,fields,roles=['admin'],read=roles,pop='')=>{
  r.get(path,allow(...read),h(async(q,s)=>s.json(await M.find().populate(pop).sort('name'))));
  r.post(path,allow(...roles),h(async(q,s)=>s.status(201).json(await M.create(pick(q.body,fields)))));
  r.put(path+'/:id',allow(...roles),h(async(q,s)=>{const d=await M.findByIdAndUpdate(q.params.id,pick(q.body,fields),{new:true,runValidators:true});if(!d)throw bad('Not found',404);s.json(d)}));
  r.delete(path+'/:id',allow(...roles),h(async(q,s)=>{if(!(await M.findByIdAndDelete(q.params.id)))throw bad('Not found',404);s.json({message:'Deleted'})}))};
crud('/teachers',Teacher,['name','subject','classes']);
crud('/classes',ClassSection,['name','teacher'],['admin'],['admin','teacher','student'],'teacher');

/* ---------- Notices ---------- */
const audience=u=>u.role==='admin'?{}:{audience:{$in:['all',u.role+'s']}};
r.get('/notices',h(async(q,s)=>s.json((await Notice.find(audience(q.user)).sort({createdAt:-1})).map(n=>({...n.toObject(),read:n.readBy.some(x=>x.equals(q.user._id)),readBy:undefined})))));
r.post('/notices',allow('admin'),h(async(q,s)=>s.status(201).json(await Notice.create({...pick(q.body,['title','message','audience']),createdBy:q.user._id}))));
r.patch('/notices/read-all',h(async(q,s)=>{await Notice.updateMany(audience(q.user),{$addToSet:{readBy:q.user._id}});s.json({message:'All marked as read'})}));
r.patch('/notices/:id/read',h(async(q,s)=>{await Notice.updateOne({_id:q.params.id,...audience(q.user)},{$addToSet:{readBy:q.user._id}});s.json({message:'Marked as read'})}));

export default r;
