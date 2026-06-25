import { supabase } from '../../lib/supabase'
import { previewUrl } from '../../lib/storage'
import Link from 'next/link'

export const revalidate = 0

const TYPE_ICON = {
  photo: '📷', ground_video: '🎬', drone_video: '🚁',
  audio_ambient: '🎙', voiceover: '🗣', template: '📐',
}

export default async function BrowsePage({ searchParams }) {
  const q      = searchParams?.q      || ''
  const sector = searchParams?.sector || ''
  const type   = searchParams?.type   || ''

  const [{ data: categories }, { data: productTypes }] = await Promise.all([
    supabase.from('categories').select('id,name_ar,slug').eq('level','sector').eq('is_active',true).order('sort_order'),
    supabase.from('product_types').select('id,code,name_ar').eq('is_active',true).order('sort_order'),
  ])

  // بناء استعلام المحتوى
  let query = supabase
    .from('content')
    .select(`
      id, title_ar, preview_path, omani_location,
      product_type:product_types!product_type_id(name_ar, code),
      category:categories!category_id(name_ar, slug)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(48)

  if (q) query = query.ilike('title_ar', `%${q}%`)

  if (sector) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', sector).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (type) {
    const { data: pt } = await supabase.from('product_types').select('id').eq('code', type).single()
    if (pt) query = query.eq('product_type_id', pt.id)
  }

  const { data: content } = await query
  const items = content || []

  const currentSector = categories?.find(c => c.slug === sector)

  return (
    <>
      {/* الشريط العلوي */}
      <header className="topbar">
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
              <rect x="1" y="1" width="32" height="32" rx="9" stroke="#e0b461" strokeWidth="1.6"/>
              <path d="M9 22V12l8-4 8 4v10" stroke="#e0b461" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="17" cy="16.5" r="3" stroke="#efe7d6" strokeWidth="1.6"/>
            </svg>
            <span style={{ fontFamily: "'El Messiri', serif", fontSize: 20, color: 'var(--sand)', fontWeight: 700 }}>
              عُمان <span style={{ color: 'var(--amber-2)' }}>ستوك</span>
            </span>
          </Link>
          <Link href="/auth/login" className="nav-cta">دخول المساهمين</Link>
        </div>
      </header>

      <div className="browse-wrap">
        <div className="browse-header">
          <h1>
            {currentSector ? `قطاع: ${currentSector.name_ar}` :
             q ? `نتائج: "${q}"` : 'تصفّح المحتوى'}
          </h1>
          <p>محتوى بصري وصوتي عُماني أصيل ومرخّص</p>
        </div>

        {/* شريط البحث والفلاتر */}
        <div className="browse-filters">
          <form className="browse-search" method="get" action="/browse">
            <input name="q" defaultValue={q} type="text" placeholder="ابحث في المحتوى…" />
            {sector && <input type="hidden" name="sector" value={sector} />}
            {type   && <input type="hidden" name="type"   value={type}   />}
            <button type="submit">بحث</button>
          </form>

          {/* فلاتر القطاعات */}
          <Link href="/browse" className={`filter-pill ${!sector && !type && !q ? 'active' : ''}`}>
            الكل
          </Link>
          {categories?.map(c => (
            <Link
              key={c.id}
              href={`/browse?sector=${c.slug}`}
              className={`filter-pill ${sector === c.slug ? 'active' : ''}`}
            >
              {c.name_ar}
            </Link>
          ))}
        </div>

        {/* فلاتر الأنواع */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {productTypes?.filter(t => t.code !== 'bundle').map(t => (
            <Link
              key={t.id}
              href={`/browse?${sector ? `sector=${sector}&` : ''}type=${t.code}`}
              className={`filter-pill ${type === t.code ? 'active' : ''}`}
              style={{ fontSize: 12 }}
            >
              {TYPE_ICON[t.code] || ''} {t.name_ar}
            </Link>
          ))}
        </div>

        {/* شبكة المحتوى */}
        <div className="browse-grid">
          {items.length === 0 ? (
            <div className="browse-empty">
              <p>لا يوجد محتوى منشور بعد في هذا القسم.</p>
              {q && <Link href="/browse" style={{ color: 'var(--amber)', fontWeight: 600 }}>عرض الكل</Link>}
            </div>
          ) : (
            items.map(item => {
              const pUrl = previewUrl(item.preview_path)
              return (
                <Link href={`/content/${item.id}`} className="browse-card" key={item.id}>
                  {pUrl
                    ? <img src={pUrl} alt={item.title_ar} className="browse-card-img" />
                    : <div className="browse-card-ph">
                        {TYPE_ICON[item.product_type?.code] || '📄'}
                      </div>
                  }
                  <div className="browse-card-body">
                    <div className="browse-card-title">{item.title_ar}</div>
                    {item.omani_location && (
                      <div className="browse-card-meta">📍 {item.omani_location}</div>
                    )}
                    <span className="browse-card-type">{item.product_type?.name_ar}</span>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
