import { createClient } from '../../../../lib/supabase-server'
import { previewUrl } from '../../../../lib/storage'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewActions from '../../_components/ReviewActions'

export const revalidate = 0

const STATUS_LABEL = {
  draft: 'مسودة', uploaded: 'بانتظار المراجعة',
  technical_review: 'مراجعة تقنية', quality_review: 'مراجعة الجودة',
  legal_review: 'مراجعة قانونية', published: 'منشور', rejected: 'مرفوض',
}

export default async function ContentDetailPage({ params }) {
  const supabase = createClient()
  const { data: item } = await supabase
    .from('content')
    .select(`
      *,
      contributor:profiles!contributor_id(full_name),
      product_type:product_types!product_type_id(name_ar),
      category:categories!category_id(name_ar),
      content_consent(model_full_name, consent_scope, is_minor)
    `)
    .eq('id', params.id)
    .single()

  if (!item) notFound()

  const pUrl = previewUrl(item.preview_path)
  const inReview = ['uploaded','technical_review','quality_review','legal_review'].includes(item.status)

  const typeIcon = {
    photo: '📷', ground_video: '🎬', drone_video: '🚁',
    audio_ambient: '🎙', voiceover: '🗣', template: '📐', bundle: '📦',
  }

  return (
    <div className="admin-main">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link href="/admin/content" className="admin-action-link" style={{ color: 'var(--muted)' }}>
          ← قائمة المحتوى
        </Link>
        <span className={`sbadge ${
          inReview ? 'sbadge-review' :
          item.status === 'published' ? 'sbadge-published' :
          item.status === 'rejected'  ? 'sbadge-rejected'  : 'sbadge-draft'
        }`}>{STATUS_LABEL[item.status]}</span>
      </div>

      <div className="content-detail-grid">
        {/* العمود الرئيسي */}
        <div>
          {pUrl
            ? <img src={pUrl} alt={item.title_ar} className="detail-preview" />
            : <div className="detail-preview-placeholder">
                {typeIcon[item.product_type?.code] || '📄'}
              </div>
          }

          <div className="detail-card">
            <div className="detail-label">العنوان</div>
            <div className="detail-value big">{item.title_ar}</div>

            {item.description_ar && (
              <>
                <div className="detail-label">الوصف</div>
                <div className="detail-value">{item.description_ar}</div>
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div className="detail-label">نوع المحتوى</div>
                <div className="detail-value">{item.product_type?.name_ar || '—'}</div>
              </div>
              <div>
                <div className="detail-label">القطاع</div>
                <div className="detail-value">{item.category?.name_ar || '—'}</div>
              </div>
              <div>
                <div className="detail-label">الموقع العُماني</div>
                <div className="detail-value">{item.omani_location || '—'}</div>
              </div>
              <div>
                <div className="detail-label">المساهم</div>
                <div className="detail-value">{item.contributor?.full_name || '—'}</div>
              </div>
            </div>

            {item.keywords?.length > 0 && (
              <>
                <div className="detail-label">الكلمات المفتاحية</div>
                <div className="detail-tags">
                  {item.keywords.map(k => (
                    <span className="detail-tag" key={k}>{k}</span>
                  ))}
                </div>
              </>
            )}

            {item.rejection_reason && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: 10, padding: '12px 16px', marginTop: 8,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>
                  سبب الرفض
                </div>
                <div style={{ fontSize: 14, color: '#7f1d1d' }}>{item.rejection_reason}</div>
              </div>
            )}
          </div>
        </div>

        {/* العمود الجانبي */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* بيانات الملف */}
          <div className="detail-card">
            <h3 style={{ fontSize: 15, color: 'var(--ink)', marginBottom: 16 }}>بيانات الملف</h3>
            <div className="detail-label">الصيغة</div>
            <div className="detail-value">{item.file_format?.toUpperCase() || '—'}</div>
            {item.width_px && (
              <>
                <div className="detail-label">الأبعاد</div>
                <div className="detail-value">{item.width_px} × {item.height_px} px</div>
              </>
            )}
            <div className="detail-label">تاريخ الرفع</div>
            <div className="detail-value">
              {new Date(item.created_at).toLocaleDateString('ar-OM', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
          </div>

          {/* نموذج الموافقة */}
          {item.has_identifiable_people && (
            <div className="detail-card">
              <h3 style={{ fontSize: 15, color: 'var(--ink)', marginBottom: 16 }}>
                نموذج الموافقة
              </h3>
              {item.content_consent?.length > 0 ? (
                item.content_consent.map((c, i) => (
                  <div key={i}>
                    <div className="detail-label">اسم الشخص</div>
                    <div className="detail-value">{c.model_full_name}</div>
                    {c.is_minor && (
                      <span className="sbadge sbadge-review">قاصر</span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ color: '#e53e3e', fontSize: 14 }}>
                  ⚠️ لا يوجد نموذج موافقة مرفوع — تحقق قبل النشر
                </div>
              )}
            </div>
          )}

          {/* أزرار المراجعة */}
          {inReview && (
            <div className="detail-card">
              <h3 style={{ fontSize: 15, color: 'var(--ink)', marginBottom: 16 }}>
                قرار المراجعة
              </h3>
              <ReviewActions contentId={item.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
