import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {Save,FileText} from 'lucide-react';
import {Card,Badge,Btn,PageHead,inputCls,DataTable,Empty,useToast} from '../components/ui';import {useStore} from '../context/Store';import {SUBJECTS,grade} from '../data/mock';
export default function Results(){const toast=useToast();const nav=useNavigate();const {visible,classNames,marks,saveMarks}=useStore();const [cls,setCls]=useState('');const [subj,setSubj]=useState(SUBJECTS[0]);const [d,setD]=useState({});
  const rows=visible.filter(s=>!cls||s.cls===cls).sort((a,b)=>a.roll-b.roll);const val=s=>s.id in d?d[s.id]:(marks[s.id]?.[subj]??'');
  const cols=[{h:'Roll No.',r:s=>s.roll},{h:'Student Name',r:s=><b>{s.name}</b>},{h:'Subject',r:()=>subj},{h:'Maximum Marks',r:()=>100},
  {h:'Obtained Marks',r:s=><input type="number" min="0" max="100" aria-label={`Marks for ${s.name}`} value={val(s)} onChange={e=>setD(x=>({...x,[s.id]:e.target.value===''?'':Math.min(100,Math.max(0,Number(e.target.value)))}))} className={inputCls+' w-24'}/>},
  {h:'Percentage',r:s=>val(s)===''?'—':val(s)+'%'},{h:'Grade',r:s=><b>{val(s)===''?'—':grade(val(s))}</b>},
  {h:'Status',r:s=>val(s)===''?'—':<Badge t={val(s)>=33?'good':'bad'}>{val(s)>=33?'Pass':'Fail'}</Badge>}];
  return <><PageHead title="Results Management" sub="Percentage, grade and status calculate automatically"><Btn k="o" icon={FileText} onClick={()=>nav('/report-card')}>Generate Report Cards</Btn><Btn icon={Save} onClick={()=>{saveMarks(subj,Object.fromEntries(Object.entries(d).filter(([,v])=>v!=='')));setD({});toast('Results saved')}}>Save Results</Btn></PageHead>
  <Card className="p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><label className="text-sm font-medium">Class<select value={cls} onChange={e=>{setCls(e.target.value);setD({})}} className={inputCls+' mt-1'}><option value="">All classes</option>{classNames.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="text-sm font-medium">Section<select className={inputCls+' mt-1'} disabled={!!cls}><option>All</option><option>A</option><option>B</option></select></label>
    <label className="text-sm font-medium">Examination<select className={inputCls+' mt-1'}><option>Half-Yearly</option><option>Mid-Term</option><option>Final</option></select></label>
    <label className="text-sm font-medium">Subject<select value={subj} onChange={e=>{setSubj(e.target.value);setD({})}} className={inputCls+' mt-1'}>{SUBJECTS.map(x=><option key={x}>{x}</option>)}</select></label></Card>
  {rows.length?<DataTable cols={cols} rows={rows}/>:<Empty title="No students in this class"/>}</>}
