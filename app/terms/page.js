export const metadata = { title: 'الشروط والأحكام — عُمان ستوك' }
export default function TermsPage() {
  const sections = [
    {t:'أولاً: قبول الشروط', c:'باستخدام منصة عُمان ستوك، فأنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي بند، يُرجى عدم استخدام المنصة.'},
    {t:'ثانياً: حقوق الملكية الفكرية', c:'جميع المحتويات المنشورة على المنصة محمية بموجب قوانين حقوق الملكية الفكرية. يحتفظ المساهم بحقوق ملكية محتواه، وتمنح المنصة حقوق توزيع وفق الترخيص المُختار.'},
    {t:'ثالثاً: التراخيص والاستخدام', c:'كل ترخيص يُحدّد نطاق الاستخدام المسموح به. يُحظر استخدام المحتوى خارج نطاق الترخيص المشترى. أي انتهاك يعرّض المستخدم للمساءلة القانونية.'},
    {t:'رابعاً: حقوق وواجبات المساهم', c:'يلتزم المساهم بأن يكون المالك الحقيقي للمحتوى، وأن يحصل على موافقة الأشخاص الظاهرين فيه، وأن يلتزم بلوائح تصوير الطائرات المسيّرة.'},
    {t:'خامساً: المسؤولية', c:'تبذل المنصة قصارى جهدها للتحقّق من المحتوى، لكنها لا تتحمّل مسؤولية أي ضرر ناتج عن سوء الاستخدام من قِبل المستخدمين.'},
  ]
  return (
    <main style={{minHeight:'100vh'}}>
      <div style={{background:'var(--navy)',padding:'64px 0',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(26px,4vw,44px)',color:'#fff',fontFamily:'Noto Kufi Arabic'}}>الشروط والأحكام</h1>
        <p style={{color:'rgba(247,246,242,.6)',marginTop:8,fontSize:14}}>آخر تحديث: يناير 2026</p>
      </div>
      <div className="wrap" style={{paddingBlock:'64px',maxWidth:800}}>
        {sections.map((s,i) => (
          <div key={i} style={{marginBottom:36}}>
            <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:18,color:'var(--navy)',marginBottom:10}}>{s.t}</h2>
            <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.9}}>{s.c}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
