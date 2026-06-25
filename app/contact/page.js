'use client'
import { useState } from 'react'
export default function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',type:'general',message:''})
  const [sent, setSent] = useState(false)
  return (
    <main style={{minHeight:'100vh'}}>
      <div style={{background:'var(--navy)',padding:'64px 0',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(26px,4vw,44px)',color:'#fff',fontFamily:'Noto Kufi Arabic',marginBottom:10}}>تواصل معنا</h1>
        <p style={{color:'rgba(247,246,242,.7)',fontSize:15}}>نردّ على جميع الاستفسارات خلال 24 ساعة</p>
      </div>
      <div className="wrap" style={{paddingBlock:'64px',maxWidth:680}}>
        {sent ? (
          <div style={{textAlign:'center',padding:48,background:'var(--cream)',borderRadius:16}}>
            <div style={{fontSize:48,marginBottom:16}}>✅</div>
            <h2 style={{fontFamily:'Noto Kufi Arabic',color:'var(--navy)',marginBottom:10}}>تم إرسال رسالتك</h2>
            <p style={{color:'var(--muted)'}}>سنتواصل معك خلال 24 ساعة على بريدك الإلكتروني</p>
          </div>
        ) : (
          <div style={{background:'#fff',borderRadius:16,padding:40,border:'1.5px solid var(--line)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <div>
                <label style={{fontSize:14,color:'var(--navy)',fontWeight:600,display:'block',marginBottom:8}}>الاسم</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                  style={{width:'100%',border:'1.5px solid var(--line)',borderRadius:10,padding:'10px 14px',fontFamily:'inherit',fontSize:14}} placeholder="اسمك الكريم" />
              </div>
              <div>
                <label style={{fontSize:14,color:'var(--navy)',fontWeight:600,display:'block',marginBottom:8}}>البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                  style={{width:'100%',border:'1.5px solid var(--line)',borderRadius:10,padding:'10px 14px',fontFamily:'inherit',fontSize:14}} placeholder="email@example.com" />
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:14,color:'var(--navy)',fontWeight:600,display:'block',marginBottom:8}}>نوع الاستفسار</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                style={{width:'100%',border:'1.5px solid var(--line)',borderRadius:10,padding:'10px 14px',fontFamily:'inherit',fontSize:14}}>
                <option value="general">استفسار عام</option>
                <option value="contributor">انضمام كمساهم</option>
                <option value="license">استفسار عن الترخيص</option>
                <option value="custom">طلب محتوى خاص</option>
                <option value="technical">دعم تقني</option>
              </select>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:14,color:'var(--navy)',fontWeight:600,display:'block',marginBottom:8}}>رسالتك</label>
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={5}
                style={{width:'100%',border:'1.5px solid var(--line)',borderRadius:10,padding:'10px 14px',fontFamily:'inherit',fontSize:14,resize:'vertical'}} placeholder="اكتب رسالتك هنا…" />
            </div>
            <button onClick={()=>setSent(true)}
              style={{width:'100%',background:'var(--teal)',color:'#fff',border:0,padding:'14px',borderRadius:999,fontFamily:'inherit',fontSize:15,fontWeight:600,cursor:'pointer'}}>
              إرسال الرسالة
            </button>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:32}}>
          {[{i:'📧',t:'البريد الإلكتروني',v:'support@ostock.om'},{i:'📱',t:'واتساب',v:'+968 XXXX XXXX'},{i:'🕐',t:'أوقات الدعم',v:'الأحد — الخميس، 9ص — 5م'}].map((c,i)=>(
            <div key={i} style={{textAlign:'center',padding:20,background:'var(--cream)',borderRadius:12}}>
              <div style={{fontSize:24,marginBottom:8}}>{c.i}</div>
              <div style={{fontSize:13,fontWeight:600,color:'var(--navy)',marginBottom:4}}>{c.t}</div>
              <div style={{fontSize:12,color:'var(--muted)'}}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
