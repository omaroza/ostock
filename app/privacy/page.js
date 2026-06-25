export const metadata = { title: 'سياسة الخصوصية — عُمان ستوك' }
export default function PrivacyPage() {
  return (
    <main style={{minHeight:'100vh'}}>
      <div style={{background:'var(--navy)',padding:'64px 0',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(26px,4vw,44px)',color:'#fff',fontFamily:'Noto Kufi Arabic'}}>سياسة الخصوصية</h1>
        <p style={{color:'rgba(247,246,242,.6)',marginTop:8,fontSize:14}}>ملتزمون بحماية بياناتك وفق المرسوم الملكي 6/2022</p>
      </div>
      <div className="wrap" style={{paddingBlock:'64px',maxWidth:800}}>
        {[
          {t:'ما البيانات التي نجمعها؟', c:'اسمك وبريدك الإلكتروني ومعلومات حسابك عند التسجيل، وبيانات الاستخدام والتصفّح على المنصة.'},
          {t:'كيف نستخدم بياناتك؟', c:'لإدارة حسابك، ومعالجة مدفوعاتك، وتحسين تجربتك، وإرسال تحديثات متعلقة بخدماتنا.'},
          {t:'هل نشارك بياناتك؟', c:'لا نبيع بياناتك أبداً. قد نشاركها مع شركاء الدفع (ثواني) لأغراض المعالجة فقط.'},
          {t:'حفظ البيانات', c:'نحفظ بياناتك طالما حسابك نشط. بيانات الموافقة تُحفظ لمدة لا تقل عن 5 سنوات وفق المتطلبات القانونية.'},
          {t:'حقوقك', c:'لك الحق في الاطلاع على بياناتك، وتصحيحها، وطلب حذفها في أي وقت عبر التواصل معنا.'},
        ].map((s,i) => (
          <div key={i} style={{marginBottom:32,padding:24,background:'var(--cream)',borderRadius:12}}>
            <h2 style={{fontFamily:'Noto Kufi Arabic',fontSize:17,color:'var(--navy)',marginBottom:8}}>{s.t}</h2>
            <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.9}}>{s.c}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
