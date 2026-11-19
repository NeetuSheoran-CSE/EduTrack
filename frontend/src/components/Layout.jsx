import {useState,useEffect} from 'react';import {NavLink,Link,Outlet,useLocation,useNavigate} from 'react-router-dom';
import {LayoutDashboard,Users,CalendarCheck,Wallet,ClipboardList,FileText,School,GraduationCap,Bell,Settings,LogOut,Menu,Search,User} from 'lucide-react';
import {useAuth} from '../context/Auth';import {useStore} from '../context/Store';
const A=[['Dashboard','/dashboard',LayoutDashboard],['Students','/students',Users],['Attendance','/attendance',CalendarCheck],['Fees','/fees',Wallet],['Results','/results',ClipboardList],['Report Cards','/report-card',FileText],['Classes & Sections','/classes',School],['Teachers','/teachers',GraduationCap],['Notifications','/notifications',Bell],['Settings','/settings',Settings]];
const NAV={admin:A,
teacher:[['Dashboard','/dashboard',LayoutDashboard],['My Classes','/students',Users],['Mark Attendance','/attendance',CalendarCheck],['Enter Results','/results',ClipboardList],['Report Cards','/report-card',FileText],['Notifications','/notifications',Bell]],
student:[['Dashboard','/portal',LayoutDashboard],['My Attendance','/portal/attendance',CalendarCheck],['My Fees','/portal/fees',Wallet],['My Results','/portal/results',ClipboardList],['Report Card','/report-card',FileText],['Profile','/profile',User],['Notifications','/notifications',Bell]]};
export default function Layout(){
  const {user,logout}=useAuth();const {mine}=useStore();const nav=useNavigate();const unread=mine.filter(n=>!n.read).length;const [open,setOpen]=useState(false);const {pathname}=useLocation();
  useEffect(()=>setOpen(false),[pathname]);
  return <div className="min-h-screen flex">
    {open&&<div className="fixed inset-0 bg-ink/40 z-30 lg:hidden" onClick={()=>setOpen(false)}/>}
    <aside aria-label="Main navigation" className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand text-cream flex flex-col transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 print:hidden ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10 font-extrabold text-lg"><GraduationCap className="text-gold" aria-hidden="true"/>EduTrack</div>
      <nav className="flex-1 overflow-auto p-3 space-y-1">{NAV[user.role].map(([l,p,I])=><NavLink key={l} to={p} end className={({isActive})=>`flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${isActive?'bg-cream text-brand':'hover:bg-white/10'}`}><I size={18} aria-hidden="true"/>{l}</NavLink>)}</nav>
      <button onClick={logout} className="m-3 flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-medium hover:bg-white/10"><LogOut size={18} aria-hidden="true"/>Logout</button>
    </aside>
    <div className="flex-1 min-w-0">
      <header className="sticky top-0 z-20 h-16 bg-cream/95 border-b border-ink/10 flex items-center gap-3 px-4 sm:px-6 print:hidden">
        <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-ink/5" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)}><Menu/></button>
        <div className="relative flex-1 max-w-md hidden sm:block"><Search size={16} className="absolute left-3 top-3.5 text-ink/50" aria-hidden="true"/><input aria-label="Search" onKeyDown={e=>e.key==='Enter'&&nav('/students?q='+encodeURIComponent(e.target.value))} placeholder="Search students, then press Enter" className="w-full min-h-[44px] pl-9 pr-3 rounded-xl border border-ink/15 bg-white"/></div>
        <div className="flex-1 sm:hidden font-bold text-brand">EduTrack</div>
        <Link to="/notifications" aria-label={`Notifications, ${unread} unread`} className="relative p-2 rounded-lg hover:bg-ink/5"><Bell size={20}/>{unread>0&&<span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-clay-dark text-white text-[10px] font-bold">{unread}</span>}</Link>
        <div className="flex items-center gap-2"><span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white text-sm font-bold">{user.name.split(' ').pop()[0]}</span><div className="hidden md:block leading-tight"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-ink/70 capitalize">{user.role}</p></div></div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><Outlet/></main>
    </div></div>}
