import {useState} from 'react';import {useSearchParams} from 'react-router-dom';import {useForm} from 'react-hook-form';
import {Plus,Eye,Pencil,Trash2,Search,CheckCircle2,Clock,TrendingUp,TrendingDown,AlertTriangle} from 'lucide-react';
import {Card,Badge,Btn,PageHead,Modal,Confirm,Field,inputCls,Empty,DataTable,useToast} from '../components/ui';import {useStore,feeStatus} from '../context/Store';import {useAuth} from '../context/Auth';
function Form({init,ro,classes,onSave}){const {register,handleSubmit}=useForm({defaultValues:init||{cls:classes[0],total:40000}});
  return <form onSubmit={handleSubmit(onSave)}><fieldset disabled={ro}><Field label="Full name"><input className={inputCls} {...register('name',{required:true})}/></Field>
  <div className="grid grid-cols-2 gap-3"><Field label="Class"><select className={inputCls} {...register('cls')}>{classes.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="Roll number"><input type="number" className={inputCls} {...register('roll',{required:true,valueAsNumber:true})}/></Field></div>
  <Field label="Annual fee (₹)"><input type="number" className={inputCls} {...register('total',{required:true,valueAsNumber:true})}/></Field></fieldset>{!ro&&<Btn type="submit" className="w-full">Save student</Btn>}</form>}
export default function Students(){const toast=useToast();const {user}=useAuth();const {visible,classNames,addStudent,updateStudent,removeStudent,pct}=useStore();const [sp]=useSearchParams();
  const [q,setQ]=useState(sp.get('q')||'');const [cf,setCf]=useState('');const [sf,setSf]=useState('');const [m,setM]=useState(null);const admin=user.role==='admin';
  const rows=visible.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())&&(!cf||s.cls.split('-')[0]===cf)&&(!sf||s.cls.endsWith('-'+sf)));
  const save=d=>{m.s?updateStudent(m.s.id,d):addStudent(d);toast(m.s?'Student updated':'Student added');setM(null)};
  const cols=[{h:'Student ID',r:s=>s.id},{h:'Student Name',r:s=><b>{s.name}</b>},{h:'Class',r:s=>s.cls.split('-')[0]},{h:'Section',r:s=>s.cls.split('-')[1]},{h:'Roll No.',r:s=>s.roll},
  {h:'Attendance %',r:s=><span className="inline-flex items-center gap-2">{s.att}%{s.att>=85?<Badge icon={TrendingUp}>Good Attendance</Badge>:<Badge t="bad" icon={TrendingDown}>Low Attendance</Badge>}</span>},
  {h:'Fee Status',r:s=>{const f=feeStatus(s);return f==='Paid'?<Badge icon={CheckCircle2}>Paid</Badge>:<Badge t={f==='Overdue'?'bad':'warn'} icon={f==='Overdue'?AlertTriangle:Clock}>{f==='Overdue'?'Overdue':'Pending'}</Badge>}},
  {h:'Result Status',r:s=>{const p=pct(s.id);return p===null?<Badge t="warn" icon={Clock}>Not entered</Badge>:p>=50?<Badge icon={CheckCircle2}>Pass</Badge>:<Badge t="bad" icon={AlertTriangle}>Needs Improvement</Badge>}},
  {h:'Actions',r:s=><div className="flex gap-1">{[[Eye,'View','view',1],[Pencil,'Edit','edit',admin],[Trash2,'Delete','del',admin]].filter(a=>a[3]).map(([I,l,k])=><button key={l} aria-label={`${l} ${s.name}`} onClick={()=>setM({mode:k,s})} className="p-2.5 rounded-lg hover:bg-brand/10 text-brand"><I size={16}/></button>)}</div>}];
  return <><PageHead title="Students" sub={`${rows.length} students`}>{admin&&<Btn icon={Plus} onClick={()=>setM({mode:'add'})}>Add Student</Btn>}</PageHead>
  <Card className="p-4 mb-4 grid sm:grid-cols-3 gap-3"><div className="relative"><Search size={16} className="absolute left-3 top-3.5 text-ink/50" aria-hidden="true"/><input aria-label="Search students" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name" className={inputCls+' pl-9'}/></div>
    <select aria-label="Filter by class" value={cf} onChange={e=>setCf(e.target.value)} className={inputCls}><option value="">All classes</option>{['6','7','8','9','10'].map(c=><option key={c}>{c}</option>)}</select>
    <select aria-label="Filter by section" value={sf} onChange={e=>setSf(e.target.value)} className={inputCls}><option value="">All sections</option><option>A</option><option>B</option></select></Card>
  {rows.length?<DataTable cols={cols} rows={rows}/>:<Empty title="No students match" text="Try a different name, class or section."/>}
  {m&&m.mode!=='del'&&<Modal title={{add:'Add Student',edit:'Edit Student',view:'Student Details'}[m.mode]} onClose={()=>setM(null)}><Form init={m.s} ro={m.mode==='view'} classes={classNames} onSave={save}/></Modal>}
  {m?.mode==='del'&&<Confirm title="Delete student?" text={`${m.s.name} and their records will be removed.`} onNo={()=>setM(null)} onYes={()=>{removeStudent(m.s.id);toast('Student deleted');setM(null)}}/>}</>}
