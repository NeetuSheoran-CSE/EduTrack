import {createContext,useContext,useState} from 'react';import {useAuth} from './Auth';import {SUBJECTS} from '../data/mock';
const Ctx=createContext();export const useStore=()=>useContext(Ctx);
export const TODAY='2026-11-18',ME='ET-1001',TEACHER_CLASSES=['8-A','9-B'];
export const feeStatus=s=>s.paid>=s.total?'Paid':s.due<TODAY?'Overdue':'Pending';
export const fmt=d=>new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const S0=[['Aarav Sharma','10-A',1,54000,54000,96],['Ananya Verma','9-B',4,48000,30000,92],['Riya Singh','8-A',12,42000,12000,74],['Rahul Kumar','7-B',7,38000,38000,88],['Mehak Yadav','6-A',3,34000,34000,81],['Ishaan Gupta','10-A',2,54000,27000,90],['Diya Patel','9-B',5,48000,48000,95],['Kabir Malhotra','8-A',8,42000,42000,86]]
 .map(([name,cls,roll,total,paid,att],i)=>({id:'ET-'+(1001+i),name,cls,roll,total,paid,att,due:i===2?'2026-09-05':'2026-12-15'}));
const seedMarks=()=>Object.fromEntries(S0.map((s,i)=>[s.id,Object.fromEntries(SUBJECTS.map((x,j)=>[x,Math.max(30,60+(i*7+j*11)%38-(i===2?30:0))]))]));
const N=(id,title,text,to,date)=>({id,title,text,to,date,read:false});
export function StoreProvider({children}){
  const {user}=useAuth();
  const [students,setS]=useState(S0);
  const [att,setAtt]=useState(()=>Object.fromEntries(S0.map((s,i)=>[s.id,i===3?'A':i===5?'L':'P'])));
  const [marks,setMarks]=useState(seedMarks);
  const [pay,setPay]=useState(()=>S0.filter(s=>s.paid).map((s,i)=>({rid:'R-'+(2041+i),id:s.id,amount:s.paid,date:'2026-08-'+(10+i)})));
  const [teachers,setT]=useState([{id:'T-01',name:'Mr. Rohit Malhotra',subject:'Mathematics',classes:'8-A, 9-B'},{id:'T-02',name:'Ms. Kavita Nair',subject:'English',classes:'10-A'},{id:'T-03',name:'Mrs. Sunita Rao',subject:'Science',classes:'6-A, 7-B'}]);
  const [classes,setC]=useState([['6-A',2],['7-B',2],['8-A',0],['9-B',0],['10-A',1]].map(([name,t])=>({name,teacher:['Mr. Rohit Malhotra','Ms. Kavita Nair','Mrs. Sunita Rao'][t]})));
  const [notices,setN]=useState([N(1,'Half-Yearly exam timetable','Exams begin on 15 December. Timetable is on the notice board.','all','2026-11-17'),N(2,'Fee reminder','Second-term fee is due on 15 December 2026.','students','2026-11-15'),N(3,'Staff meeting','Meeting on Friday at 2 PM in the library.','teachers','2026-11-14')]);
  const role=user?.role;const mine=!user?[]:notices.filter(n=>role==='admin'||n.to==='all'||n.to===role+'s');
  const scope=role==='teacher'?TEACHER_CLASSES:role==='student'?['10-A']:null;
  const visible=students.filter(s=>!scope||scope.includes(s.cls));
  const classNames=scope||classes.map(c=>c.name);
  const pct=id=>{const m=marks[id];if(!m)return null;const v=SUBJECTS.map(s=>m[s]);return v.some(x=>x==null)?null:Math.round(v.reduce((a,b)=>a+b,0)/v.length)};
  const A={
    addStudent:d=>setS(l=>[...l,{...d,id:'ET-'+(Math.max(...l.map(s=>+s.id.slice(3)))+1),paid:0,att:100,due:'2026-12-15'}]),
    updateStudent:(id,d)=>setS(l=>l.map(s=>s.id===id?{...s,...d}:s)),
    removeStudent:id=>setS(l=>l.filter(s=>s.id!==id)),
    saveAtt:m=>setAtt(a=>({...a,...m})),
    saveMarks:(subj,o)=>setMarks(m=>{const n={...m};Object.entries(o).forEach(([id,v])=>{n[id]={...(n[id]||{}),[subj]:v}});return n}),
    addPayment:(id,amount)=>{const rid='R-'+(2041+pay.length);setPay(p=>[...p,{rid,id,amount,date:TODAY}]);setS(l=>l.map(s=>s.id===id?{...s,paid:s.paid+amount}:s));return rid},
    addTeacher:d=>setT(l=>[...l,{...d,id:'T-0'+(l.length+1)}]),removeTeacher:id=>setT(l=>l.filter(t=>t.id!==id)),
    addClass:d=>setC(l=>[...l,d]),assignTeacher:(name,teacher)=>setC(l=>l.map(c=>c.name===name?{...c,teacher}:c)),
    addNotice:d=>setN(l=>[{...d,id:Date.now(),date:TODAY,read:false},...l]),
    markRead:id=>setN(l=>l.map(n=>n.id===id?{...n,read:true}:n)),markAll:()=>setN(l=>l.map(n=>({...n,read:true})))};
  return <Ctx.Provider value={{students,visible,classNames,att,marks,pay,teachers,classes,notices,mine,pct,...A}}>{children}</Ctx.Provider>}
