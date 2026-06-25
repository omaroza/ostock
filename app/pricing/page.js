import Link from 'next/link'

export const metadata = { title: 'الأسعار — عُمان ستوك' }

export default function PricingPage() {
  const plans = [
    { name:'أساسية', price:8, price_y:80, desc:'للأفراد والمستقلّين', color:'#0D5B63',
      features:['5 تنزيلات شهرياً','ترخيص قياسي','جميع أنواع المحتوى','دعم بالبريد'] },
    { name:'احترافية', price:20, price_y:200, desc:'لصنّاع المحتوى', color:'#D4A757', popular:true,
      features:['25 تنزيل شهرياً','ترخيص قياسي + موسّع','أولوية في البحث','دعم سريع'] },
    { name:'أعمال', price:50, price_y:500, desc:'للشركات والوكالات', color:'#081322',
      features:['100 تنزيل شهرياً','جميع أنواع التراخيص','5 مستخدمين','مدير حساب مخصّص'] },
    { name:'مؤسسية', price:null, desc:'للمؤسسات الكبرى', color:'#007887',
      features:['تنزيلات غير محدودة','ترخيص حصري متاح','مستخدمون غير محدودون','SLA مضمون'] },
  ]

  const licenses = [
    { name:'قياسي', range:'1–15 ر.ع', desc:'للاستخدام الشخصي والتجاري المحدود',
      uses:['مواقع إلكترونية','وسائل التواصل الاجتماعي','مطبوعات غير تجارية','عروض تقديمية'] },
    { name:'موسّع', range:'4–50 ر.ع', desc:'للاستخدام التجاري الواسع النطاق',
      uses:['إعلانات تجارية','تلفزيون وراديو','منتجات للبيع','حملات تسويقية'] },
    { name:'حصري', range:'15–150 ر.ع', desc:'ملكية حصرية — لا يُباع لأحد غيرك',
      uses:['حقوق حصرية كاملة','لا يُباع لغيرك','أعلى قيمة تجارية','اتفاقية مخصّصة'] },
  ]

  return (
    <main style={{minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{background:'var(--navy)',padding:'72px 0 96px',textAlign:'center'}}>
        <div className="wrap">
          <p style={{color:'var(--gold)',fontSize:14,fontWeight:600,letterSpacing:1,marginBottom:12}}>الأسعار والباقات</p>
          <h1 style={{fontSize:'clamp(30px,4.5vw,50px)',color:'#fff',fontFamily:'Noto Kufi Arabic',marginBottom:14}}>
            ابدأ بالمحتوى العُماني الأصيل
          </h1>
          <p style={{color:'rgba(247,246,242,.7)',fontSize:16,maxWidth:'48ch',margin:'0 auto'}}>
            اختر الباقة التي تناسب احتياجاتك — وفّر 20% مع الاشتراك السنوي
          </p>
        </div>
      </div>

      <div className="wrap" style={{paddingBlock:'0 64px'}}>
        {/* بطاقات الباقات */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:-48,marginBottom:72}}>
          {plans.map((p,i) => (
            <div key={i} style={{
              background:'#fff',borderRadius:16,padding:28,
              border:p.popular?`2px solid ${p.color}`:'1.5px solid var(--line)',
              position:'relative',
              boxShadow:p.popular?`0 12px 40px ${p.color}30`:'0 2px 12px rgba(0,0,0,.06)'
            }}>
              {p.popular && (
                <div style={{position:'absolute',top:-14,insetInlineStart:'50%',transform:'translateX(50%)',
                  background:p.color,color:'#fff',fontSize:12,fontWeight:600,
                  padding:'4px 18px',borderRadius:999,whiteSpace:'nowrap'}}>
                  الأكثر اختياراً ⭐
                </div>
              )}
              <div style={{width:42,height:42,borderRadius:10,background:`${p.color}18`,
                display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 style={{fontSize:20,color:'var(--navy)',fontFamily:'Noto Kufi Arabic',marginBottom:4}}>{p.name}</h3>
              <p style={{fontSize:13,color:'var(--muted)',marginBottom:18}}>{p.desc}</p>
              {p.price ? (
                <div style={{marginBottom:18}}>
                  <span style={{fontSize:34,fontWeight:700,color:'var(--navy)',fontFamily:'Noto Kufi Arabic'}}>{p.price}</span>
                  <span style={{fontSize:13,color:'var(--muted)'}}> ر.ع / شهر</span>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{p.price_y} ر.ع سنوياً</div>
                </div>
              ) : (
                <div style={{fontSize:22,fontWeight:700,color:p.color,marginBottom:18,fontFamily:'Noto Kufi Arabic'}}>بالاتفاق</div>
              )}
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9,marginBottom:22}}>
                {p.features.map((f,j) => (
                  <li key={j} style={{fontSize:13,color:'var(--text)',display:'flex',alignItems:'flex-start',gap:7}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" style={{
                display:'block',textAlign:'center',
                background:p.popular?p.color:'transparent',
                color:p.popular?'#fff':p.color,
                border:`1.5px solid ${p.color}`,
                padding:'11px 0',borderRadius:999,fontSize:14,fontWeight:600
              }}>
                {p.price ? 'ابدأ الآن' : 'تواصل معنا'}
              </Link>
            </div>
          ))}
        </div>

        {/* أنواع التراخيص */}
        <h2 style={{fontSize:26,color:'var(--navy)',fontFamily:'Noto Kufi Arabic',textAlign:'center',marginBottom:8}}>أنواع التراخيص</h2>
        <p style={{textAlign:'center',color:'var(--muted)',marginBottom:32}}>لكل استخدام ترخيص مناسب — قانوني وواضح</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:64}}>
          {licenses.map((l,i) => (
            <div key={i} style={{background:'#fff',borderRadius:14,padding:28,border:'1.5px solid var(--line)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <h3 style={{fontSize:18,color:'var(--navy)',fontFamily:'Noto Kufi Arabic'}}>{l.name}</h3>
                <span style={{fontSize:16,fontWeight:700,color:'var(--teal)'}}>{l.range}</span>
              </div>
              <p style={{fontSize:13,color:'var(--muted)',marginBottom:14,lineHeight:1.7}}>{l.desc}</p>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:8}}>
                {l.uses.map((u,j) => (
                  <li key={j} style={{fontSize:13,color:'var(--text)',display:'flex',gap:7}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" style={{flexShrink:0,marginTop:2}}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'var(--navy)',borderRadius:20,padding:'48px',textAlign:'center'}}>
          <h2 style={{fontSize:24,color:'#fff',fontFamily:'Noto Kufi Arabic',marginBottom:10}}>لديك سؤال عن الأسعار؟</h2>
          <p style={{color:'rgba(247,246,242,.65)',marginBottom:24,fontSize:15}}>فريقنا يساعدك في اختيار الباقة المثالية لمشروعك</p>
          <Link href="/contact" style={{display:'inline-block',background:'var(--gold)',color:'var(--navy)',padding:'13px 36px',borderRadius:999,fontSize:15,fontWeight:600}}>
            تواصل معنا
          </Link>
        </div>
      </div>
    </main>
  )
}
