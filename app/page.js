import { createClient } from '../lib/supabase-server'
import Link from 'next/link'

export const revalidate = 0

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
)

const MOCK_COLORS = [
  ['#2a4a3a','#3a7a5a'],['#1a3a5a','#2a6a8a'],['#4a3020','#7a5535'],
  ['#1a2a4a','#2a4a7a'],['#3a2a1a','#7a5030'],['#2a3a2a','#4a7a4a'],
  ['#4a1a2a','#8a3550'],['#1a4a4a','#2a8080'],['#3a3a1a','#6a6a2a'],
  ['#2a1a4a','#5030a0'],['#1a4a2a','#2a8050'],['#4a2a1a','#8a5030'],
]

// أسماء أنواع المحتوى بالعربية مع أيقونات
const TYPE_LABELS = {
  photo:         { ar: 'صورة فوتوغرافية', icon: '📷' },
  ground_video:  { ar: 'فيديو أرضي',     icon: '🎬' },
  drone_video:   { ar: 'فيديو جوي (درون)', icon: '🚁' },
  audio_ambient: { ar: 'صوت بيئي',        icon: '🎵' },
  voiceover:     { ar: 'تعليق صوتي',      icon: '🎙' },
  template:      { ar: 'قالب جاهز',       icon: '📐' },
}

function MosaicCell({ idx, isVideo, isTall, duration }) {
  const [c1,c2] = MOCK_COLORS[idx % MOCK_COLORS.length]
  return (
    <div className={`mosaic-cell${isTall?' tall':''}`}>
      <div className="mock-img" style={{background:`linear-gradient(145deg,${c1},${c2})`,width:'100%',height:'100%'}} />
      <div className="overlay" />
      {isVideo ? (
        <>
          <div className="vid-badge">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            فيديو
          </div>
          <div className="play-btn"><span><PlayIcon /></span></div>
          {duration && <div className="duration">{duration}</div>}
        </>
      ) : (
        <div className="img-badge">صورة</div>
      )}
    </div>
  )
}

function ContentCard({ idx, isVideo, isWide, isTall, duration }) {
  const [c1,c2] = MOCK_COLORS[idx % MOCK_COLORS.length]
  return (
    <Link href="/browse" className={`content-card${isWide?' wide':''}${isTall?' tall':''}`}>
      <div className="mock-img" style={{background:`linear-gradient(145deg,${c1},${c2})`,width:'100%',height:'100%'}} />
      <div className="card-overlay" />
      {isVideo ? (
        <>
          <div className="vid-badge-c">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            فيديو
          </div>
          <div className="play-c"><span><PlayIcon /></span></div>
          {duration && <div className="vid-time">{duration}</div>}
        </>
      ) : (
        <div className="img-badge-c">صورة</div>
      )}
    </Link>
  )
}

export default async function Home() {
  const supabase = createClient()
  const { data: sectors } = await supabase
    .from('categories').select('id,name_ar,slug').eq('level','sector').eq('is_active',true).order('sort_order').limit(12)
  const { data: types } = await supabase
    .from('product_types').select('id,code,name_ar').eq('is_active',true).order('sort_order')

  const allSectors = sectors || []
  const allTypes   = (types||[]).filter(t=>t.code!=='bundle')

  return (
    <>
      {/* ===== نافبار ===== */}
      <header className="topbar">
        <div className="wrap">
          {/* يسار: أزرار + لغة */}
          <div className="nav-actions">
            <button className="nav-lang">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              EN
            </button>
            <Link href="/auth/login" className="btn-ghost">تسجيل الدخول</Link>
            <Link href="/auth/signup" className="btn-gold">إنشاء حساب</Link>
          </div>

          {/* وسط: روابط التنقّل */}
          <nav className="nav-links">
            <Link href="/browse">استكشاف المحتوى</Link>
            <Link href="/browse?view=sectors">القطاعات</Link>
            <Link href="/pricing">الأسعار</Link>
            <Link href="/auth/signup?role=contributor">كن مساهماً</Link>
            <Link href="/about">عن عُمان ستوك</Link>
          </nav>

          {/* يمين: الشعار */}
          <Link href="/" className="nav-logo">
            <img src="/logo-full-dark.png" alt="عُمان ستوك" />
          </Link>
        </div>
      </header>

      {/* ===== هيرو — بلا فراغات ===== */}
      <section className="hero">
        <div className="hero-inner">

          {/* النص يسار */}
          <div className="hero-text">
            <h1>
              جمهورك عُماني...<br/>
              <span>فلماذا تبحث عن</span><br/>
              صور أجنبية؟
            </h1>
            <p className="lead">
              محتوى عُماني أصيل للإعلانات والتسويق والإعلام.<br/>
              صور وفيديوهات وملفات إبداعية تعكس واقعنا وتُفهم جمهورك.
            </p>
            <form className="hero-search" action="/browse" method="get">
              <input type="text" name="q" placeholder="ابحث عن أي محتوى…" autoComplete="off" />
              <button type="submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                بحث
              </button>
            </form>
            <div className="type-pills">
              {allTypes.map(t => (
                <Link href={`/browse?type=${t.code}`} key={t.id} className="type-pill">
                  {TYPE_LABELS[t.code]?.icon || '📁'}
                  {TYPE_LABELS[t.code]?.ar || t.name_ar}
                </Link>
              ))}
            </div>
          </div>

          {/* الموزاييك يمين — يمتد للحافة */}
          <div className="hero-mosaic">
            <MosaicCell idx={0} isVideo={true}  isTall={true}  duration="0:24" />
            <MosaicCell idx={1} isVideo={false} />
            <MosaicCell idx={2} isVideo={false} />
            <MosaicCell idx={3} isVideo={true}  duration="0:18" />
            <MosaicCell idx={4} isVideo={false} />
          </div>
        </div>
      </section>

      {/* ===== إحصائيات ===== */}
      <div className="stats-bar">
        <div className="wrap">
          {[
            {n:'120K+',l:'صورة',     icon:'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'},
            {n:'25K+', l:'فيديو',    icon:'M23 7 16 12 23 17 23 7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z'},
            {n:'5K+',  l:'فيكتور',   icon:'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z'},
            {n:'2K+',  l:'ملف صوتي', icon:'M4 12v0M8 8v8M12 5v14M16 8v8M20 12v0'},
            {n:'350+', l:'مساهم',    icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'},
          ].map((s,i)=>(
            <div className="stat-item" key={i}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {s.icon.split(' M').map((d,j)=><path key={j} d={j===0?d:'M'+d}/>)}
              </svg>
              <div>
                <div className="stat-num">{s.n}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== محتوى أصيل ===== */}
      <section className="section" style={{background:'var(--cream)'}}>
        <div className="wrap">
          <div className="section-head">
            <h2>محتوى عُماني أصيل</h2>
            <Link href="/browse">عرض المزيد ←</Link>
          </div>
          <div className="content-grid">
            <ContentCard idx={0}  isVideo={false} isTall={true} />
            <ContentCard idx={1}  isVideo={true}  isWide={true} duration="0:15" />
            <ContentCard idx={2}  isVideo={false} />
            <ContentCard idx={3}  isVideo={false} />
            <ContentCard idx={4}  isVideo={true}  duration="0:12" />
            <ContentCard idx={5}  isVideo={false} />
            <ContentCard idx={6}  isVideo={false} />
            <ContentCard idx={7}  isVideo={false} isWide={true} />
            <ContentCard idx={8}  isVideo={true}  duration="0:31" />
          </div>
          <div className="load-more">
            <Link href="/browse">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              عرض المزيد من المحتوى
            </Link>
          </div>
        </div>
      </section>

      {/* ===== القطاعات ===== */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>استكشف حسب القطاع</h2>
            <Link href="/browse?view=sectors">عرض الكل ←</Link>
          </div>
          <div className="sectors-strip">
            {allSectors.map((s,i) => (
              <Link href={`/browse?sector=${s.id}`} key={s.id} className="sector-card-img">
                <div className="mock-img" style={{background:`linear-gradient(160deg,${MOCK_COLORS[i%MOCK_COLORS.length][0]},${MOCK_COLORS[i%MOCK_COLORS.length][1]})`,width:'100%',height:'100%'}} />
                <div className="sc-overlay" />
                <div className="sc-name">{s.name_ar}</div>
              </Link>
            ))}
            <Link href="/browse?view=sectors" className="sector-more">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              المزيد
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-banner">
        <div className="wrap">
          <div className="cta-inner">
            <div className="cta-img-wrap">
              <div style={{background:'linear-gradient(135deg,#1a3a2a,#2a6a4a)',width:'100%',height:'100%'}} />
            </div>
            <div className="cta-text">
              <img src="/logo-mark.png" alt="" style={{height:52,marginBottom:16,opacity:.9}} />
              <h2>كن جزءاً من أكبر مكتبة<br/>محتوى عُمانية</h2>
              <p>شارك محتواك واكسب من موهبتك — انضم لمئات المساهمين العُمانيين</p>
              <Link href="/auth/signup?role=contributor" className="btn-white">ابدأ البيع الآن</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== مميزات ===== */}
      <section className="section">
        <div className="wrap">
          <div className="features-row">
            {[
              {t:'سهولة الاستخدام',  d:'تجربة بحث وتنزيل سلسة',   p:'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z'},
              {t:'دعم مبدعين',        d:'عوائد مجزية ودعم مستمر',  p:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'},
              {t:'حقوق آمنة',         d:'ترخيص واضح وعادل',        p:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'},
              {t:'محتوى أصيل',        d:'يعكس الهوية العُمانية',   p:'M12 21s-7-5-7-11a7 7 0 0 1 14 0c0 6-7 11-7 11z'},
              {t:'جودة عالية',         d:'معايير احترافية عالمية',  p:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'},
              {t:'تحديث مستمر',       d:'محتوى جديد باستمرار',     p:'M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15'},
            ].map((f,i)=>(
              <div className="feat" key={i}>
                <div className="feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={f.p}/>
                  </svg>
                </div>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== تذييل ===== */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/logo-full-dark.png" alt="عُمان ستوك" />
              <p>منصة عُمانية إبداعية تهدف إلى تمكين المبدعين والشركات من الوصول إلى محتوى يعكس الهوية العُمانية للعالم.</p>
              <div className="footer-social">
                {['YT','IN','FB','X'].map((s,i)=>(
                  <a key={i} href="#" aria-label={s}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4>عن عُمان ستوك</h4>
              <ul>
                <li><Link href="/about">من نحن</Link></li>
                <li><Link href="/how">كيف نعمل</Link></li>
                <li><Link href="/pricing">الأسعار</Link></li>
                <li><Link href="/blog">المدونة</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>مساعدة</h4>
              <ul>
                <li><Link href="/faq">الأسئلة الشائعة</Link></li>
                <li><Link href="/terms">الشروط والأحكام</Link></li>
                <li><Link href="/privacy">سياسة الخصوصية</Link></li>
                <li><Link href="/contact">التواصل والمساعدة</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>اشترك في نشرتنا</h4>
              <p style={{fontSize:12,color:'rgba(247,246,242,.5)',marginBottom:12}}>احصل على آخر التحديثات والعروض</p>
              <div className="newsletter-form">
                <input type="email" placeholder="أدخل بريدك الإلكتروني" />
                <button>اشترك</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>جميع الحقوق محفوظة © عُمان ستوك 2026</p>
            <p>ostock.om</p>
          </div>
        </div>
      </footer>
    </>
  )
}
