import express from 'express';import cors from 'cors';import helmet from 'helmet';import rateLimit from 'express-rate-limit';import routes from './routes.js';
const app=express();
app.use(helmet());app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));app.use(express.json({limit:'100kb'}));
app.get('/api/health',(q,s)=>s.json({ok:true}));
app.use('/api/auth/login',rateLimit({windowMs:15*60*1000,limit:20,message:{message:'Too many login attempts. Try again later.'}}));
app.use('/api',routes);
app.use((q,s)=>s.status(404).json({message:'Route not found'}));
app.use((e,q,s,n)=>{ // central error handler
  if(e.name==='ValidationError')return s.status(400).json({message:Object.values(e.errors).map(x=>x.message).join(', ')});
  if(e.name==='CastError')return s.status(400).json({message:'Invalid id'});
  if(e.code===11000)return s.status(409).json({message:'Duplicate value: '+Object.keys(e.keyValue||{}).join(', ')});
  if(!e.status)console.error(e);s.status(e.status||500).json({message:e.status?e.message:'Server error'})});
export default app;
