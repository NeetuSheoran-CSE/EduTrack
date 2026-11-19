import dns from 'node:dns';if(dns.getServers().includes('127.0.0.1'))dns.setServers(['8.8.8.8','1.1.1.1']);
import 'dotenv/config';import mongoose from 'mongoose';import app from './app.js';
for(const k of ['MONGO_URI','JWT_SECRET'])if(!process.env[k]){console.error(`Missing ${k} in .env`);process.exit(1)}
await mongoose.connect(process.env.MONGO_URI);console.log('MongoDB connected');
app.listen(process.env.PORT||5000,()=>console.log(`EduTrack API on http://localhost:${process.env.PORT||5000}`));
