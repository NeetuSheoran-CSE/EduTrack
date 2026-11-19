import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {useForm} from 'react-hook-form';import {GraduationCap} from 'lucide-react';
import {useAuth,home} from '../context/Auth';import {Btn,Field,inputCls} from '../components/ui';
export default function Login(){const {login}=useAuth();const nav=useNavigate();const [role,setRole]=useState('admin');
  const {register,handleSubmit,formState:{errors}}=useForm({defaultValues:{email:'admin@edutrack.in',password:'demo1234'}});
  const go=()=>{login(role);nav(home(role))};
  return <div className="min-h-screen grid lg:grid-cols-2">
    <section className="bg-brand text-cream p-8 lg:p-14 flex flex-col justify-between"><span className="flex items-center gap-2 font-extrabold text-xl"><GraduationCap className="text-gold" aria-hidden="true"/>EduTrack</span>
      <div className="py-10"><h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">One secure place for every classroom record.</h1><p className="mt-3 text-cream/80 max-w-md">Attendance, fees, marks and report cards — with access limited to each person's role.</p></div>
      <p className="text-sm text-gold">Academic Year 2026–27</p></section>
    <section className="flex items-center justify-center p-6"><form onSubmit={handleSubmit(go)} className="w-full max-w-sm" noValidate>
      <h2 className="text-2xl font-extrabold text-brand mb-1">Welcome back</h2><p className="text-sm text-ink/70 mb-5">Choose your role and sign in.</p>
      <div role="group" aria-label="Login as" className="grid grid-cols-3 gap-1 p-1 bg-ink/5 rounded-xl mb-5">{['admin','teacher','student'].map(r=><button type="button" key={r} aria-pressed={role===r} onClick={()=>setRole(r)} className={`min-h-[44px] rounded-lg text-sm font-semibold capitalize ${role===r?'bg-white text-brand shadow-soft':'text-ink/70'}`}>{r}</button>)}</div>
      <Field label="Email or username"><input className={inputCls} {...register('email',{required:'Enter your email or username'})}/>{errors.email&&<span role="alert" className="text-xs text-clay-dark">{errors.email.message}</span>}</Field>
      <Field label="Password"><input type="password" className={inputCls} {...register('password',{required:'Enter your password',minLength:{value:6,message:'Use at least 6 characters'}})}/>{errors.password&&<span role="alert" className="text-xs text-clay-dark">{errors.password.message}</span>}</Field>
      <div className="flex justify-between items-center mb-5 text-sm"><label className="flex items-center gap-2 min-h-[44px]"><input type="checkbox" className="w-4 h-4 accent-[#234B3A]"/>Remember me</label><a href="#" className="text-brand font-semibold underline">Forgot password?</a></div>
      <Btn type="submit" className="w-full">Log in as {role}</Btn></form></section></div>}
