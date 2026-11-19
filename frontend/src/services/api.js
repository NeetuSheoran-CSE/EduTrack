// REST client for the EduTrack backend (see ../../backend). Set VITE_API_URL=http://localhost:5000/api
const BASE=import.meta.env.VITE_API_URL||'/api';
const req=async(p,o={})=>{const r=await fetch(BASE+p,{...o,headers:{'Content-Type':'application/json',Authorization:`Bearer ${sessionStorage.getItem('edu-token')||''}`},body:o.body&&JSON.stringify(o.body)});
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||r.statusText);return d};
export const api={
  login:b=>req('/auth/login',{method:'POST',body:b}),me:()=>req('/auth/me'),
  students:(qs='')=>req('/students'+qs),addStudent:b=>req('/students',{method:'POST',body:b}),updateStudent:(id,b)=>req('/students/'+id,{method:'PUT',body:b}),deleteStudent:id=>req('/students/'+id,{method:'DELETE'}),
  attendance:(cls,date)=>req(`/attendance?cls=${cls||''}&date=${date||''}`),saveAttendance:b=>req('/attendance',{method:'POST',body:b}),
  fees:()=>req('/fees'),addPayment:b=>req('/fees/payments',{method:'POST',body:b}),receipt:id=>req('/fees/receipt/'+id),
  results:(cls,exam,subject)=>req(`/results?cls=${cls||''}&exam=${exam}&subject=${subject}`),saveResults:b=>req('/results',{method:'POST',body:b}),reportCard:(id,exam)=>req(`/report-card/${id}?exam=${exam||''}`),
  dashboard:()=>req('/dashboard'),notices:()=>req('/notices'),sendNotice:b=>req('/notices',{method:'POST',body:b}),readNotice:id=>req(`/notices/${id}/read`,{method:'PATCH'}),
  teachers:()=>req('/teachers'),classes:()=>req('/classes')};
