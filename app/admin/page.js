import { createClient } from '../../lib/supabase-server'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createClient()

  const [
    { count: totalContent },
    { count: pendingCount },
    { count: publishedCount },
    { count: contributorsCount },
    { data: recentContent },
    { data: revenueSettings },
  ] = await Promise.all([
    supabase.from('content').select('*', { count: 'exact', head: true }),
    supabase.from('content').select('*', { count: 'exact', head: true })
      .in('status', ['uploaded', 'technical_review', 'quality_review', 'legal_review']),
    supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'contributor'),
    supabase.from('content').select(`
      id, title_ar, status, created_at,
      contributor:profiles!contributor_id(full_name),
      product_type:product_types!product_type_id(name_ar)
    `).order('created_at', { ascending: false }).limit(8),
    supabase.from('revenue_settings').select('*'),
  ])

  const revenueConfigured = revenueSettings && revenueSettings.length >= 3

  const STATUS_LABEL = {
    draft: 'مسودة', uploaded: 'بانتظار المراجعة',
    technical_review: 'مراجعة تقنية', quality_review: 'مراجعة الجودة',
    legal_review: 'مراجعة قانونية', published: 'منشور', rejected: 'مرفوض',
  }
  const STATUS_CLASS = {
    draft: 'sbadge sbadge-draft', uploaded: 'sbadge sbadge-review',
    technical_review: 'sbadge sbadge-review', quality_review: 'sbadge sbadge-review',
    legal_review: 'sbadge sbadge-review', published: 'sbadge sbadge-published',
    rejected: 'sbadge sbadge-rejected',
  }

  return (
    <div className="admin-main">
      <h1 className="admin-page-title">نظرة عامة</h1>
      <p className="admin-page-sub">مرحباً بك في لوحة إدارة عُمان ستوك</p>

      <div className="admin-stat-grid">
        <div className="admin-stat astat-blue">
          <div className="admin-stat-num">{totalContent || 0}</div>
          <div className="admin-stat-label">إجمالي الأعمال</div>
        </div>
        <div className="admin-stat astat-amber">
          <div className="admin-stat-num">{pendingCount || 0}</div>
          <div className="admin-stat-label">تحت المراجعة</div>
        </div>
        <div className="admin-stat astat-green">
          <div className="admin-stat-num">{publishedCount || 0}</div>
          <div className="admin-stat-label">منشور</div>
        </div>
        <div className="admin-stat astat-red">
          <div className="admin-stat-num">{contributorsCount || 0}</div>
          <div className="admin-stat-label">مساهمون</div>
        </div>
      </div>

      {!revenueConfigured && (
        <div style={{
          background: '#fef3c7', border: '1px solid #fcd34d',
          borderRadius: 12, padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <span style={{ fontSize: 14, color: '#92400e' }}>
            ⚠️ لم تُضبط نِسب الأرباح بعد — الزوّار لا يستطيعون شراء المحتوى حتى تضبطها.
          </span>
          <Link href="/admin/revenue" style={{
            fontSize: 13, fontWeight: 700, color: '#92400e',
            background: '#fcd34d', padding: '7px 14px',
            borderRadius: 999, textDecoration: 'none',
          }}>
            اضبط الآن ←
          </Link>
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="admin-table-head">
          <span className="admin-table-title">آخر الأعمال المرفوعة</span>
          <Link href="/admin/content" className="admin-action-link">عرض الكل ←</Link>
        </div>
        {recentContent && recentContent.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>المساهم</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentContent.map(item => (
                <tr key={item.id}>
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
                      month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td>
                    {['uploaded','technical_review','quality_review','legal_review'].includes(item.status) && (
                      <Link href={`/admin/content/${item.id}`} className="admin-action-link">
                        مراجعة ←
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">لا توجد أعمال مرفوعة بعد.</div>
        )}
      </div>
    </div>
  )
}
