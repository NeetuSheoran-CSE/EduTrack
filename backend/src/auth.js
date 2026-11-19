import jwt from 'jsonwebtoken';import {User} from './models.js';
export const sign=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'7d'});
export const protect=async(req,res,next)=>{
  try{const t=(req.headers.authorization||'').replace('Bearer ','');if(!t)return res.status(401).json({message:'Not authenticated'});
    const {id}=jwt.verify(t,process.env.JWT_SECRET);req.user=await User.findById(id);
    if(!req.user)return res.status(401).json({message:'User no longer exists'});next()}
  catch{res.status(401).json({message:'Invalid or expired token'})}};
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'You do not have access to this resource'});
// Role-based data scope: admin sees all, teacher only assigned classes, student only themself.
export const studentFilter=u=>u.role==='admin'?{}:u.role==='teacher'?{cls:{$in:u.classes}}:{_id:u.student};
