import { supabase } from '../../../lib/supabase'
import { previewUrl } from '../../../lib/storage'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

const TYPE_ICON = {
  photo: '📷', ground_video: '🎬', drone_video: '🚁',
  audio_ambient: '🎙', voiceover: '🗣', template: '📐',
}

export default async function ContentPage({ params }) {
  const { data: item } = await supabase
    .from('content')
    .select(`
      id, title_ar, description_ar, keywords, omani_location, published_at,
      product_type:product_types!product_type_id(name_ar, code),
      category:categories!category_id(name_ar),
      contributor:profiles!contributor_id(full_name)
    `)
    .eq('id', params.id)
    .eq('status', 'published')
    .single()

  if (!item) notFound()

  const { data: licenseTypes } = await supabase
    .from('license_types').select('*').eq('is_active', true).order('sort_order')

  const { data: revenueSettings } = await supabase
    .from('revenue_settings').select('*').eq('is_active', true)

  const pUrl = previewUrl(item.preview_path)

  return (
    <>
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
          <Link href="/browse" className="nav-cta">← تصفّح المزيد</Link>
        </div>
      </header>

      <div className="content-detail-wrap">
        {/* صورة المعاينة */}
        {pUrl
          ? <img src={pUrl} alt={item.title_ar} className="content-hero-img" />
          : <div className="content-hero-ph">
              {TYPE_ICON[item.product_type?.code] || '📄'}
            </div>
        }

        <div className="content-top">
          <h1>{item.title_ar}</h1>
          <span style={{
            fontSize: 13, fontWeight: 600, padding: '5px 14px',
            background: 'var(--sand)', borderRadius: 999, color: 'var(--ink)',
          }}>
            {item.product_type?.name_ar}
          </span>
        </div>

        {/* المعلومات */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, marginBottom: 28,
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 14, padding: '20px 22px',
        }}>
          {item.category && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>القطاع</div>
              <div style={{ fontSize: 15, color: 'var(--ink)' }}>{item.category.name_ar}</div>
            </div>
          )}
          {item.omani_location && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>الموقع</div>
              <div style={{ fontSize: 15, color: 'var(--ink)' }}>📍 {item.omani_location}</div>
            </div>
          )}
          {item.contributor && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>المصوّر</div>
              <div style={{ fontSize: 15, color: 'var(--ink)' }}>{item.contributor.full_name}</div>
            </div>
          )}
          {item.published_at && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>تاريخ النشر</div>
              <div style={{ fontSize: 15, color: 'var(--ink)' }}>
                {new Date(item.published_at).toLocaleDateString('ar-OM', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          )}
        </div>

        {item.description_ar && (
          <p style={{ color: 'var(--muted)', marginBottom: 24, lineHeight: 1.8 }}>
            {item.description_ar}
          </p>
        )}

        {item.keywords?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {item.keywords.map(k => (
              <span key={k} style={{
                fontSize: 13, padding: '4px 12px',
                background: 'var(--sand)', borderRadius: 999, color: 'var(--ink)',
              }}>{k}</span>
            ))}
          </div>
        )}

        {/* خيارات الترخيص */}
        <h2 style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 16 }}>خيارات الترخيص</h2>
        <div className="license-cards">
          {(licenseTypes || []).map(lt => {
            const rev = revenueSettings?.find(r => r.license_type_id === lt.id)
            return (
              <div className="license-card" key={lt.id}>
                <div>
                  <h3>{lt.name_ar}</h3>
                  <p>{lt.description_ar}</p>
                </div>
                <a
                  href={`mailto:info@ostock.om?subject=طلب ترخيص — ${lt.name_ar} — ${item.title_ar}&body=مرحباً، أودّ الحصول على ${lt.name_ar} للمحتوى: ${item.title_ar} (${item.id})`}
                  className="license-cta"
                >
                  طلب الترخيص ←
                </a>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/browse" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>
            ← العودة لتصفّح المحتوى
          </Link>
        </div>
      </div>
    </>
  )
}
