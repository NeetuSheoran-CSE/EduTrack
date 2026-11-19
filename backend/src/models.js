import mongoose from 'mongoose';import bcrypt from 'bcryptjs';
const {Schema,model}=mongoose;const ref=n=>({type:Schema.Types.ObjectId,ref:n});
const CLS=/^\d{1,2}-[A-Z]$/;

const userS=new Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true,minlength:8,select:false},role:{type:String,enum:['admin','teacher','student'],required:true},
  student:ref('Student'),classes:[{type:String,match:CLS}]},{timestamps:true});
userS.pre('save',async function(){if(this.isModified('password'))this.password=await bcrypt.hash(this.password,10)});
userS.methods.check=function(p){return bcrypt.compare(p,this.password)};
export const User=model('User',userS);

export const Student=model('Student',new Schema({studentId:{type:String,unique:true,required:true},name:{type:String,required:true,trim:true},
  cls:{type:String,required:true,match:CLS},roll:{type:Number,required:true,min:1},annualFee:{type:Number,default:0,min:0},dueDate:Date},{timestamps:true}));

export const Teacher=model('Teacher',new Schema({name:{type:String,required:true,trim:true},subject:{type:String,required:true},
  classes:[{type:String,match:CLS}],user:ref('User')},{timestamps:true}));

export const ClassSection=model('ClassSection',new Schema({name:{type:String,required:true,unique:true,match:CLS},teacher:ref('Teacher')},{timestamps:true}));

const att=new Schema({student:{...ref('Student'),required:true},date:{type:Date,required:true},status:{type:String,enum:['P','A','L'],required:true}});
att.index({student:1,date:1},{unique:true});
export const Attendance=model('Attendance',att);

export const Payment=model('Payment',new Schema({receiptNo:{type:String,unique:true,required:true},student:{...ref('Student'),required:true},
  amount:{type:Number,required:true,min:1},date:{type:Date,default:Date.now},mode:{type:String,enum:['cash','upi','card','cheque'],default:'cash'},recordedBy:ref('User')},{timestamps:true}));

const res=new Schema({student:{...ref('Student'),required:true},exam:{type:String,required:true},subject:{type:String,required:true},
  max:{type:Number,default:100},obtained:{type:Number,required:true,min:0}},{timestamps:true});
res.pre('validate',function(){if(this.obtained>this.max)this.invalidate('obtained','Obtained marks cannot exceed maximum marks')});
res.index({student:1,exam:1,subject:1},{unique:true});
export const Result=model('Result',res);

export const Notice=model('Notice',new Schema({title:{type:String,required:true,trim:true},message:{type:String,required:true},
  audience:{type:String,enum:['all','teachers','students'],default:'all'},createdBy:ref('User'),readBy:[ref('User')]},{timestamps:true}));
