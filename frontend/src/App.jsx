import {Routes,Route,Navigate} from 'react-router-dom';
import {useAuth,home} from './context/Auth';import Layout from './components/Layout';
import Landing from './pages/Landing';import Login from './pages/Login';import Dashboard from './pages/Dashboard';import Students from './pages/Students';
import Attendance from './pages/Attendance';import Fees from './pages/Fees';import Results from './pages/Results';import ReportCard from './pages/ReportCard';import Portal from './pages/Portal';
import Classes from './pages/Classes';import Teachers from './pages/Teachers';import Notifications from './pages/Notifications';import Account from './pages/Account';
const Guard=({roles,children})=>{const {user}=useAuth();if(!user)return <Navigate to="/login" replace/>;return roles.includes(user.role)?children:<Navigate to={home(user.role)} replace/>};
const G=(roles,el)=><Guard roles={roles}>{el}</Guard>;const staff=['admin','teacher'];
export default function App(){return <Routes>
  <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/>
  <Route element={<Guard roles={['admin','teacher','student']}><Layout/></Guard>}>
    <Route path="/dashboard" element={G(staff,<Dashboard/>)}/><Route path="/students" element={G(staff,<Students/>)}/>
    <Route path="/attendance" element={G(staff,<Attendance/>)}/><Route path="/fees" element={G(['admin'],<Fees/>)}/>
    <Route path="/results" element={G(staff,<Results/>)}/><Route path="/report-card" element={<ReportCard/>}/>
    <Route path="/classes" element={G(['admin'],<Classes/>)}/><Route path="/teachers" element={G(['admin'],<Teachers/>)}/>
    <Route path="/portal/:tab?" element={G(['student'],<Portal/>)}/><Route path="/notifications" element={<Notifications/>}/>
    <Route path="/settings" element={<Account/>}/><Route path="/profile" element={<Account/>}/></Route>
  <Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
