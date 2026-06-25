import Link from 'next/link'
export const metadata = { title: 'عن عُمان ستوك' }

export default function AboutPage() {
  const stats = [{ n:'500+', l:'ملف محتوى' },{ n:'50+', l:'مساهم' },{ n:'40', l:'قطاعاً' },{ n:'3', l:'أنواع تراخيص' }]
  const team = [
    { name:'فريق الإدارة', desc:'متخصصون في التقنية والإبداع العُماني' },
    { name:'فريق المراجعة', desc:'خبراء في الجودة والامتثال القانوني' },
    { name:'المساهمون', desc:'مبدعون عُمانيون من مختلف المجالات' },
  ]
  return (
    <main style={{minHeight:'100vh'}}>
      {/* هيرو */}
      <div style={{background:'var(--navy)',padding:'80px 0',textAlign:'center'}}>
        <div className="wrap">
          <h1 style={{fontSize:'clamp(30px,5vw,52px)',color:'#fff',fontFamily:'Noto Kufi Arabic',marginBottom:16}}>
            من عُمان… إلى العالم
          </h1>
          <p style={{color:'rgba(247,246,242,.72)',fontSize:17,maxWidth:'55ch',margin:'0 auto',lineHeight:1.8}}>
            عُمان ستوك منصة عُمانية إبداعية تهدف إلى تمكين المبدعين والشركات
            من الوصول إلى محتوى بصري وصوتي يعكس الهوية العُمانية الأصيلة.
          </p>
        </div>
      </div>

      <div className="wrap" style={{paddingBlock:'72px'}}>
        {/* الإحصائيات */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:72}}>
          {stats.map((s,i) => (
            <div key={i} style={{textAlign:'center',background:'var(--cream)',borderRadius:14,padding:'28px 20px'}}>
              <div style={{fontSize:40,fontWeight:700,color:'var(--teal)',fontFamily:'Noto Kufi Arabic'}}>{s.n}</div>
              <div style={{fontSize:15,color:'var(--muted)',marginTop:4}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* الرسالة والرؤية */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,marginBottom:72}}>
          <div style={{background:'var(--teal)',borderRadius:16,padding:36,color:'#fff'}}>
            <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:24,marginBottom:14}}>رسالتنا</h2>
            <p style={{lineHeight:1.85,color:'rgba(255,255,255,.85)',fontSize:15}}>
              تمكين المبدعين العُمانيين من مشاركة موهبتهم مع العالم، وتمكين الشركات
              والمسوّقين من الوصول إلى محتوى عُماني أصيل يعكس الهوية ويُفهم الجمهور المحلي.
            </p>
          </div>
          <div style={{background:'var(--cream)',borderRadius:16,padding:36}}>
            <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:24,marginBottom:14,color:'var(--navy)'}}>رؤيتنا</h2>
            <p style={{lineHeight:1.85,color:'var(--muted)',fontSize:15}}>
              أن نكون المكتبة الإبداعية العُمانية الأولى — المرجع الأساسي لكل من يريد
              محتوى يعكس جمال عُمان وتراثها وتنوعها البشري والجغرافي.
            </p>
          </div>
        </div>

        {/* القيم */}
        <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:26,color:'var(--navy)',textAlign:'center',marginBottom:32}}>قيمنا</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:72}}>
          {[
            {t:'الأصالة',d:'محتوى عُماني حقيقي — لا قوالب مستوردة ولا صور عامة',i:'🏛'},
            {t:'الجودة',d:'معايير احترافية عالمية في كل ملف يُرفع على المنصة',i:'⭐'},
            {t:'الشفافية',d:'تراخيص واضحة وعادلة تحمي المبدع والمستخدم معاً',i:'🔒'},
            {t:'الشراكة',d:'نحن شركاء للمبدع — نبني معاً مصدر دخل مستدام',i:'🤝'},
            {t:'الامتثال',d:'ملتزمون بقوانين حماية البيانات وحقوق الملكية الفكرية',i:'⚖️'},
            {t:'الابتكار',d:'نطوّر دائماً لتقديم تجربة أفضل للمبدعين والمشترين',i:'💡'},
          ].map((v,i) => (
            <div key={i} style={{background:'#fff',borderRadius:14,padding:24,border:'1.5px solid var(--line)'}}>
              <div style={{fontSize:32,marginBottom:10}}>{v.i}</div>
              <h3 style={{fontFamily:'Noto Kufi Arabic',fontSize:17,color:'var(--navy)',marginBottom:6}}>{v.t}</h3>
              <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.7}}>{v.d}</p>
            </div>
          ))}
        </div>

        {/* الفريق */}
        <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:26,color:'var(--navy)',textAlign:'center',marginBottom:32}}>الفريق</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:64}}>
          {team.map((t,i) => (
            <div key={i} style={{background:'var(--cream)',borderRadius:14,padding:28,textAlign:'center'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'var(--teal)',margin:'0 auto 14px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 style={{fontFamily:'Noto Kufi Arabic',fontSize:16,color:'var(--navy)',marginBottom:6}}>{t.name}</h3>
              <p style={{fontSize:13,color:'var(--muted)'}}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'var(--navy)',borderRadius:20,padding:48,textAlign:'center'}}>
          <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:26,color:'#fff',marginBottom:12}}>كن جزءاً من القصة</h2>
          <p style={{color:'rgba(247,246,242,.7)',marginBottom:24}}>انضم كمساهم أو ابدأ بتصفّح المحتوى العُماني الأصيل</p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <Link href="/auth/signup?role=contributor" style={{background:'var(--gold)',color:'var(--navy)',padding:'13px 28px',borderRadius:999,fontWeight:600,fontSize:15}}>كن مساهماً</Link>
            <Link href="/browse" style={{background:'transparent',color:'#fff',border:'1.5px solid rgba(255,255,255,.3)',padding:'13px 28px',borderRadius:999,fontSize:15}}>استكشف المحتوى</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
