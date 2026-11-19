import dns from 'node:dns';if(dns.getServers().includes('127.0.0.1'))dns.setServers(['8.8.8.8','1.1.1.1']);
import 'dotenv/config';import mongoose from 'mongoose';
import {User,Student,Teacher,ClassSection,Attendance,Payment,Result,Notice} from './models.js';
const SUBJECTS=['Mathematics','Science','English','Computer Science','Social Science','Hindi'];
await mongoose.connect(process.env.MONGO_URI);await mongoose.connection.dropDatabase();
const S=[['Aarav Sharma','10-A',1,54000,54000],['Ananya Verma','9-B',4,48000,30000],['Riya Singh','8-A',12,42000,12000],['Rahul Kumar','7-B',7,38000,38000],['Mehak Yadav','6-A',3,34000,34000],['Ishaan Gupta','10-A',2,54000,27000],['Diya Patel','9-B',5,48000,48000],['Kabir Malhotra','8-A',8,42000,42000]];
const sts=await Student.insertMany(S.map(([name,cls,roll,annualFee],i)=>({studentId:'ET-'+(1001+i),name,cls,roll,annualFee,dueDate:new Date(i===2?'2026-09-05':'2026-12-15')})));
await Payment.insertMany(sts.map((s,i)=>({student:s._id,amount:S[i][4],receiptNo:'R-SEED'+i,date:new Date('2026-08-10')})).filter(p=>p.amount>0));
const today=new Date();today.setUTCHours(0,0,0,0);const att=[];
for(let d=0;d<7;d++){const dt=new Date(today);dt.setUTCDate(dt.getUTCDate()-d);sts.forEach((s,i)=>att.push({student:s._id,date:dt,status:(i+d)%9===3?'A':(i+d)%7===5?'L':'P'}))}
await Attendance.insertMany(att);
await Result.insertMany(sts.flatMap((s,i)=>SUBJECTS.map((subject,j)=>({student:s._id,exam:'Half-Yearly',subject,obtained:Math.max(30,60+(i*7+j*11)%38-(i===2?30:0))}))));
const T=await Teacher.insertMany([{name:'Mr. Rohit Malhotra',subject:'Mathematics',classes:['8-A','9-B']},{name:'Ms. Kavita Nair',subject:'English',classes:['10-A']},{name:'Mrs. Sunita Rao',subject:'Science',classes:['6-A','7-B']}]);
await ClassSection.insertMany([['6-A',2],['7-B',2],['8-A',0],['9-B',0],['10-A',1]].map(([name,t])=>({name,teacher:T[t]._id})));
const admin=await User.create({name:'Dr. Meera Kapoor',email:'admin@edutrack.in',password:'Admin@123',role:'admin'});
const tu=await User.create({name:T[0].name,email:'teacher@edutrack.in',password:'Teacher@123',role:'teacher',classes:T[0].classes});await Teacher.findByIdAndUpdate(T[0]._id,{user:tu._id});
await User.create({name:'Aarav Sharma',email:'student@edutrack.in',password:'Student@123',role:'student',student:sts[0]._id,classes:['10-A']});
await Notice.insertMany([{title:'Half-Yearly exam timetable',message:'Exams begin on 15 December.',audience:'all',createdBy:admin._id},{title:'Fee reminder',message:'Second-term fee is due on 15 December 2026.',audience:'students',createdBy:admin._id},{title:'Staff meeting',message:'Friday, 2 PM, library.',audience:'teachers',createdBy:admin._id}]);
console.log('Seeded. Logins: admin@edutrack.in / Admin@123 · teacher@edutrack.in / Teacher@123 · student@edutrack.in / Student@123');await mongoose.disconnect();
