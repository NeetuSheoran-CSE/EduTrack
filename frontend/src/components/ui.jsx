import {createContext,useContext,useState,useCallback,useEffect} from 'react';
import {CheckCircle2,X} from 'lucide-react';
export const Card=({children,className=''})=><div className={`bg-white border border-ink/10 rounded-2xl shadow-soft ${className}`}>{children}</div>;
const tone={good:'bg-brand/10 text-brand',bad:'bg-clay/10 text-clay-dark',warn:'bg-gold/25 text-[#6b4d10]'};
export const Badge=({t='good',icon:I,children})=><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${tone[t]}`}>{I&&<I size={12} aria-hidden="true"/>}{children}</span>;
const v={p:'bg-brand text-white hover:bg-brand-dark',o:'bg-white text-brand border border-brand/30 hover:bg-brand/5',d:'bg-white text-clay-dark border border-clay/40 hover:bg-clay/10'};
export const Btn=({k='p',icon:I,children,className='',...r})=><button {...r} className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-semibold transition-colors ${v[k]} ${className}`}>{I&&<I size={16} aria-hidden="true"/>}{children}</button>;
export const Stat=({label,value,icon:I,accent='text-brand bg-brand/10'})=><Card className="p-4 flex items-center gap-3"><span className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${accent}`}><I size={20} aria-hidden="true"/></span><div className="min-w-0"><p className="text-xs text-ink/70">{label}</p><p className="text-xl font-bold truncate">{value}</p></div></Card>;
export const Skeleton=({className=''})=><div className={`animate-pulse bg-olive/20 rounded-lg ${className}`} aria-hidden="true"/>;
export const Field=({label,children})=><label className="block text-sm font-medium mb-3">{label}<div className="mt-1">{children}</div></label>;
export const inputCls='w-full min-h-[44px] px-3 rounded-xl border border-ink/20 bg-white focus:border-brand';
export const PageHead=({title,sub,children})=><div className="flex flex-wrap items-end justify-between gap-3 mb-6"><div><h1 className="text-2xl font-extrabold text-brand">{title}</h1>{sub&&<p className="text-sm text-ink/70">{sub}</p>}</div><div className="flex flex-wrap gap-2">{children}</div></div>;
export function Modal({title,onClose,children}){
  useEffect(()=>{const h=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h)},[onClose]);
  return <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/40"><div role="dialog" aria-modal="true" aria-label={title} className="bg-white rounded-2xl w-full max-w-md p-5 shadow-soft max-h-[90vh] overflow-auto">
  <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg text-brand">{title}</h2><button aria-label="Close" onClick={onClose} className="p-2 rounded-lg hover:bg-ink/5"><X size={18}/></button></div>{children}</div></div>}
export const Confirm=({title,text,onYes,onNo})=><Modal title={title} onClose={onNo}><p className="text-sm mb-5">{text}</p><div className="flex gap-2 justify-end"><Btn k="o" onClick={onNo}>Cancel</Btn><Btn k="d" onClick={onYes}>Delete</Btn></div></Modal>;
export const Empty=({title='Nothing here yet',text='This section is ready to connect to your API.'})=><Card className="p-10 text-center"><h2 className="font-bold text-brand">{title}</h2><p className="text-sm text-ink/70 mt-1">{text}</p></Card>;
const T=createContext();export const useToast=()=>useContext(T);
export function ToastProvider({children}){const [m,setM]=useState(null);
  const show=useCallback(t=>{setM(t);setTimeout(()=>setM(null),3000)},[]);
  return <T.Provider value={show}>{children}<div role="status" aria-live="polite" className="fixed bottom-4 right-4 left-4 sm:left-auto z-[60] print:hidden">{m&&<div className="flex items-center gap-2 bg-brand text-white px-4 py-3 rounded-xl shadow-soft"><CheckCircle2 size={18} aria-hidden="true"/>{m}</div>}</div></T.Provider>}
export const DataTable=({cols,rows})=><>
  <Card className="hidden md:block overflow-x-auto"><table className="w-full text-sm"><thead className="bg-brand/5 text-left"><tr>{cols.map(c=><th key={c.h} scope="col" className="p-3 font-semibold whitespace-nowrap">{c.h}</th>)}</tr></thead>
  <tbody>{rows.map(r=><tr key={r.id} className="border-t border-ink/10 hover:bg-cream/60">{cols.map(c=><td key={c.h} className="p-3">{c.r(r)}</td>)}</tr>)}</tbody></table></Card>
  <div className="md:hidden space-y-3">{rows.map(r=><Card key={r.id} className="p-4 space-y-2">{cols.map(c=><div key={c.h} className="flex justify-between items-center gap-3 text-sm"><span className="text-ink/70 shrink-0">{c.h}</span><span className="text-right">{c.r(r)}</span></div>)}</Card>)}</div></>;
