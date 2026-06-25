import { createClient } from '../../../lib/supabase-server'
import { previewUrl } from '../../../lib/storage'
import Link from 'next/link'

export const revalidate = 0

const STATUS_LABEL = {
  all: 'الكل', uploaded: 'بانتظار المراجعة',
  technical_review: 'مراجعة تقنية', quality_review: 'مراجعة الجودة',
  legal_review: 'مراجعة قانونية', published: 'منشور', rejected: 'مرفوض', draft: 'مسودة',
}
const STATUS_CLASS = {
  draft: 'sbadge sbadge-draft', uploaded: 'sbadge sbadge-review',
  technical_review: 'sbadge sbadge-review', quality_review: 'sbadge sbadge-review',
  legal_review: 'sbadge sbadge-review', published: 'sbadge sbadge-published',
  rejected: 'sbadge sbadge-rejected',
}

export default async function AdminContentPage({ searchParams }) {
  const filter = searchParams?.status || 'review'
  const supabase = createClient()

  let query = supabase.from('content').select(`
    id, title_ar, status, created_at, preview_path,
    contributor:profiles!contributor_id(full_name),
    product_type:product_types!product_type_id(name_ar)
  `).order('created_at', { ascending: false }).limit(60)

  if (filter === 'review') {
    query = query.in('status', ['uploaded','technical_review','quality_review','legal_review'])
  } else if (filter !== 'all') {
    query = query.eq('status', filter)
  }

  const { data: content } = await query
  const items = content || []

  const filters = [
    { key: 'review',    label: 'تحت المراجعة' },
    { key: 'published', label: 'منشور' },
    { key: 'rejected',  label: 'مرفوض' },
    { key: 'all',       label: 'الكل' },
  ]

  return (
    <div className="admin-main">
      <h1 className="admin-page-title">مراجعة المحتوى</h1>
      <p className="admin-page-sub">راجع الأعمال المرفوعة وانشرها أو ارفضها</p>

      <div className="admin-table-wrap">
        <div className="admin-table-head">
          <span className="admin-table-title">
            {items.length} عمل
          </span>
          <div className="status-filters">
            {filters.map(f => (
              <Link
                key={f.key}
                href={`/admin/content?status=${f.key}`}
                className={`status-filter ${filter === f.key ? 'active' : ''}`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        {items.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>معاينة</th>
                <th>العنوان</th>
                <th>المساهم</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const pUrl = previewUrl(item.preview_path)
                const inReview = ['uploaded','technical_review','quality_review','legal_review']
                  .includes(item.status)
                return (
                  <tr key={item.id}>
                    <td>
                      {pUrl
                        ? <img src={pUrl} alt="" className="admin-thumb" />
                        : <div className="admin-thumb-placeholder">🖼</div>
                      }
                    </td>
                    <td><div className="admin-content-title">{item.title_ar}</div></td>
                    <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {item.contributor?.full_name || '—'}
                    </td>
                    <td style={{ fontSize: 13 }}>{item.product_type?.name_ar || '—'}</td>
                    <td>
                      <span className={STATUS_CLASS[item.status] || 'sbadge sbadge-draft'}>
                        {STATUS_LABEL[item.status] || item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {new Date(item.created_at).toLocaleDateString('ar-OM', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td>
                      {inReview && (
                        <Link href={`/admin/content/${item.id}`} className="admin-action-link">
                          مراجعة ←
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            لا توجد أعمال في هذه الفئة.
          </div>
        )}
      </div>
    </div>
  )
}
