import {createContext,useContext,useState} from 'react';
const Ctx=createContext();export const useAuth=()=>useContext(Ctx);
const NAMES={admin:'Dr. Meera Kapoor',teacher:'Mr. Rohit Malhotra',student:'Aarav Sharma'};
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>JSON.parse(sessionStorage.getItem('edu-user')||'null'));
  // Swap with POST /api/auth/login → {token, user:{role,name}} when the backend is ready
  const login=role=>{const u={role,name:NAMES[role]};sessionStorage.setItem('edu-user',JSON.stringify(u));setUser(u)};
  const logout=()=>{sessionStorage.removeItem('edu-user');setUser(null)};
  const update=p=>{const u={...user,...p};sessionStorage.setItem('edu-user',JSON.stringify(u));setUser(u)};
  return <Ctx.Provider value={{user,login,logout,update}}>{children}</Ctx.Provider>}
export const home=r=>r==='student'?'/portal':'/dashboard';
