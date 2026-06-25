import Link from 'next/link'
export const metadata = { title: 'كيف نعمل — عُمان ستوك' }
export default function HowPage() {
  return (
    <main style={{minHeight:'100vh'}}>
      <div style={{background:'var(--navy)',padding:'72px 0',textAlign:'center'}}>
        <div className="wrap">
          <h1 style={{fontSize:'clamp(28px,4vw,48px)',color:'#fff',fontFamily:'Noto Kufi Arabic',marginBottom:14}}>كيف تعمل المنصة؟</h1>
          <p style={{color:'rgba(247,246,242,.7)',fontSize:16,maxWidth:'50ch',margin:'0 auto'}}>
            عُمان ستوك تربط المبدعين بمن يحتاج محتواهم — بطريقة بسيطة وآمنة وعادلة
          </p>
        </div>
      </div>
      <div className="wrap" style={{paddingBlock:'72px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,marginBottom:80}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--navy)',fontWeight:700,flexShrink:0}}>1</div>
              <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:22,color:'var(--navy)'}}>للمساهمين — صنّاع المحتوى</h2>
            </div>
            {[
              {t:'سجّل حسابك', d:'أنشئ حساب مساهم مجاناً في دقيقتين'},
              {t:'ارفع محتواك', d:'صور، فيديو، صوتيات، قوالب — بأعلى جودة'},
              {t:'انتظر المراجعة', d:'يراجع فريقنا كل عمل للتحقّق من الجودة والامتثال القانوني'},
              {t:'انشر واكسب', d:'بعد النشر، كل تنزيل يجلب لك عائداً مباشراً'},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',gap:16,marginBottom:20}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:'var(--teal)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:600,flexShrink:0}}>{i+1}</div>
                <div>
                  <h3 style={{fontSize:16,color:'var(--navy)',fontFamily:'Noto Kufi Arabic',marginBottom:4}}>{s.t}</h3>
                  <p style={{fontSize:14,color:'var(--muted)'}}>{s.d}</p>
                </div>
              </div>
            ))}
            <Link href="/auth/signup?role=contributor" style={{display:'inline-block',background:'var(--teal)',color:'#fff',padding:'12px 28px',borderRadius:999,fontSize:14,fontWeight:600,marginTop:8}}>ابدأ كمساهم</Link>
          </div>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,flexShrink:0}}>2</div>
              <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:22,color:'var(--navy)'}}>للمشترين — من يحتاج المحتوى</h2>
            </div>
            {[
              {t:'ابحث عن ما تريد', d:'ابحث بالكلمات أو تصفّح حسب القطاع أو النوع'},
              {t:'اختر الترخيص المناسب', d:'قياسي أو موسّع أو حصري — حسب احتياجك'},
              {t:'اشترِ بأمان', d:'ادفع عبر بوابة ثواني الآمنة'},
              {t:'حمّل واستخدم', d:'احصل على رابط تنزيل فوري وشهادة ترخيص'},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',gap:16,marginBottom:20}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:'var(--gold)',color:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:600,flexShrink:0}}>{i+1}</div>
                <div>
                  <h3 style={{fontSize:16,color:'var(--navy)',fontFamily:'Noto Kufi Arabic',marginBottom:4}}>{s.t}</h3>
                  <p style={{fontSize:14,color:'var(--muted)'}}>{s.d}</p>
                </div>
              </div>
            ))}
            <Link href="/browse" style={{display:'inline-block',background:'var(--gold)',color:'var(--navy)',padding:'12px 28px',borderRadius:999,fontSize:14,fontWeight:600,marginTop:8}}>استكشف المحتوى</Link>
          </div>
        </div>

        {/* مراحل المراجعة */}
        <div style={{background:'var(--cream)',borderRadius:20,padding:48,marginBottom:64}}>
          <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:24,color:'var(--navy)',textAlign:'center',marginBottom:32}}>مراحل مراجعة المحتوى (6 مراحل)</h2>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
            {['رفع المحتوى','مراجعة تقنية','مراجعة الجودة','مراجعة قانونية','اعتماد نهائي','نشر للبيع'].map((stage,i) => (
              <div key={i} style={{flex:1,textAlign:'center'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:i===5?'var(--teal)':'var(--navy)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',fontSize:15,fontWeight:700}}>{i+1}</div>
                <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.4}}>{stage}</p>
                {i<5 && <div style={{height:2,background:'var(--line)',marginTop:8}} />}
              </div>
            ))}
          </div>
        </div>

        {/* توزيع الأرباح */}
        <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:24,color:'var(--navy)',textAlign:'center',marginBottom:12}}>توزيع الأرباح</h2>
        <p style={{textAlign:'center',color:'var(--muted)',marginBottom:32}}>نظام عادل يكافئ المبدع على جهده</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:64}}>
          {[
            {phase:'المرحلة الأولى',split:'70% / 30%',desc:'المساهم يأخذ 70% — المنصة 30%',color:'var(--teal)'},
            {phase:'المرحلة الثانية',split:'60% / 40%',desc:'مع نمو المنصة وتوسّع الخدمات',color:'var(--gold)'},
            {phase:'المرحلة الثالثة',split:'~50% / 50%',desc:'عند الاستقرار الكامل',color:'var(--navy)'},
          ].map((r,i) => (
            <div key={i} style={{background:'#fff',borderRadius:14,padding:24,border:'1.5px solid var(--line)',textAlign:'center'}}>
              <p style={{fontSize:13,color:'var(--muted)',marginBottom:8}}>{r.phase}</p>
              <div style={{fontSize:28,fontWeight:700,color:r.color,fontFamily:'Noto Kufi Arabic',marginBottom:8}}>{r.split}</div>
              <p style={{fontSize:13,color:'var(--muted)'}}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
