export const metadata = { title: 'الأسئلة الشائعة — عُمان ستوك' }
const faqs = [
  {q:'ما هي عُمان ستوك؟', a:'منصة عُمانية لبيع وشراء المحتوى البصري والصوتي — صور وفيديو وأصوات وقوالب عُمانية مرخّصة.'},
  {q:'كيف أصبح مساهماً؟', a:'سجّل حساباً كمساهم، ارفع محتواك، وانتظر مراجعة فريقنا. بعد النشر تبدأ بالكسب فوراً.'},
  {q:'ما نسبة أرباح المساهم؟', a:'في المرحلة الأولى: 70% للمساهم و30% للمنصة. النسبة تتطوّر مع نمو المنصة.'},
  {q:'ما أنواع التراخيص المتاحة؟', a:'ثلاثة أنواع: قياسي (للاستخدام المحدود)، موسّع (للاستخدام التجاري)، حصري (ملكية كاملة).'},
  {q:'كيف أحمي حقوق محتواي؟', a:'كل محتوى يمرّ بمراجعة قانونية وتُرفق معه اتفاقية موافقة الأشخاص الظاهرين فيه إن وجد.'},
  {q:'هل المنصة مرخّصة قانونياً؟', a:'نعم، عُمان ستوك مرخّصة وملتزمة بقوانين حماية البيانات العُمانية والمرسوم الملكي 6/2022.'},
  {q:'كيف يتم الدفع؟', a:'عبر بوابة ثواني الآمنة بالدفع الإلكتروني. المستحقات تُحوَّل للمساهمين دورياً.'},
  {q:'هل أستطيع طلب محتوى خاص؟', a:'نعم، تواصل معنا عبر صفحة التواصل وسيتولّى فريقنا إيجاد المبدع المناسب لمشروعك.'},
]
export default function FaqPage() {
  return (
    <main style={{minHeight:'100vh'}}>
      <div style={{background:'var(--navy)',padding:'72px 0',textAlign:'center'}}>
        <div className="wrap">
          <h1 style={{fontSize:'clamp(28px,4vw,46px)',color:'#fff',fontFamily:'Noto Kufi Arabic',marginBottom:12}}>الأسئلة الشائعة</h1>
          <p style={{color:'rgba(247,246,242,.7)',fontSize:16}}>إجابات على أكثر الأسئلة شيوعاً</p>
        </div>
      </div>
      <div className="wrap" style={{paddingBlock:'72px',maxWidth:820}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {faqs.map((f,i) => (
            <div key={i} style={{background:'#fff',borderRadius:14,padding:'24px 28px',border:'1.5px solid var(--line)'}}>
              <h3 style={{fontFamily:'Noto Kufi Arabic',fontSize:17,color:'var(--navy)',marginBottom:10}}>{f.q}</h3>
              <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.8}}>{f.a}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:48,padding:32,background:'var(--cream)',borderRadius:16}}>
          <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:20,color:'var(--navy)',marginBottom:10}}>لم تجد إجابتك؟</h2>
          <p style={{color:'var(--muted)',marginBottom:20,fontSize:14}}>فريقنا جاهز للمساعدة</p>
          <a href="/contact" style={{background:'var(--teal)',color:'#fff',padding:'12px 28px',borderRadius:999,fontSize:14,fontWeight:600,display:'inline-block'}}>تواصل معنا</a>
        </div>
      </div>
    </main>
  )
}
