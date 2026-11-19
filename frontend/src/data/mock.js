export const CLASSES=['6-A','7-B','8-A','9-B','10-A'];
export const SUBJECTS=['Mathematics','Science','English','Computer Science','Social Science','Hindi'];
export const students=[
{id:'ET-1001',name:'Aarav Sharma',cls:'10-A',roll:1,att:96,fee:'Paid',result:'Pass'},
{id:'ET-1002',name:'Ananya Verma',cls:'9-B',roll:4,att:92,fee:'Pending',result:'Pass'},
{id:'ET-1003',name:'Riya Singh',cls:'8-A',roll:12,att:74,fee:'Pending',result:'Needs Improvement'},
{id:'ET-1004',name:'Rahul Kumar',cls:'7-B',roll:7,att:88,fee:'Paid',result:'Pass'},
{id:'ET-1005',name:'Mehak Yadav',cls:'6-A',roll:3,att:81,fee:'Paid',result:'Pass'}];
export const roster=[...students.map(s=>({roll:s.roll,name:s.name})),{roll:5,name:'Ishaan Gupta'},{roll:6,name:'Diya Patel'},{roll:8,name:'Kabir Malhotra'}].sort((a,b)=>a.roll-b.roll);
export const fees=[
{name:'Aarav Sharma',id:'ET-1001',cls:'10-A',total:54000,paid:54000,due:'15 Oct 2026'},
{name:'Ananya Verma',id:'ET-1002',cls:'9-B',total:48000,paid:30000,due:'15 Oct 2026'},
{name:'Riya Singh',id:'ET-1003',cls:'8-A',total:42000,paid:12000,due:'05 Sep 2026'},
{name:'Rahul Kumar',id:'ET-1004',cls:'7-B',total:38000,paid:38000,due:'15 Oct 2026'},
{name:'Mehak Yadav',id:'ET-1005',cls:'6-A',total:34000,paid:34000,due:'15 Oct 2026'}];
export const weekly=[{d:'Mon',Present:412,Absent:28},{d:'Tue',Present:420,Absent:20},{d:'Wed',Present:405,Absent:35},{d:'Thu',Present:418,Absent:22},{d:'Fri',Present:398,Absent:42},{d:'Sat',Present:380,Absent:30}];
export const monthlyFees=[{m:'Apr',v:8.4},{m:'May',v:6.2},{m:'Jun',v:5.1},{m:'Jul',v:7.8},{m:'Aug',v:6.9},{m:'Sep',v:8.1}];
export const performance=[{s:'Maths',avg:78},{s:'Science',avg:82},{s:'English',avg:85},{s:'Comp. Sci',avg:90},{s:'Social Sci',avg:74},{s:'Hindi',avg:80}];
export const monthlyAtt=[{m:'Apr',r:93},{m:'May',r:91},{m:'Jun',r:88},{m:'Jul',r:90},{m:'Aug',r:92},{m:'Sep',r:84}];
export const marks=[['Mathematics',100,92],['Science',100,88],['English',100,90],['Computer Science',100,97],['Social Science',100,85],['Hindi',100,91]];
export const grade=p=>p>=90?'A+':p>=80?'A':p>=70?'B+':p>=60?'B':p>=50?'C':p>=33?'D':'F';
export const inr=n=>'₹'+n.toLocaleString('en-IN');
export const C={brand:'#234B3A',olive:'#718B72',clay:'#C56B4F',gold:'#D6A756'};
