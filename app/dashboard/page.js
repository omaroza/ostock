import { createClient } from '../../lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STATUS_LABEL = {
  draft:           'مسودة',
  uploaded:        'بانتظار المراجعة',
  technical_review:'مراجعة تقنية',
  quality_review:  'مراجعة الجودة',
  legal_review:    'مراجعة قانونية',
  published:       'منشور',
  rejected:        'مرفوض',
}

const STATUS_COLOR = {
  draft:           '#9aa1ab',
  uploaded:        '#c8922e',
  technical_review:'#1c5a47',
  quality_review:  '#1c5a47',
  legal_review:    '#1c5a47',
  published:       '#166534',
  rejected:        '#c0392b',
}

const STATUS_BG = {
  draft:           '#f3f4f6',
  uploaded:        '#fdf3e3',
  technical_review:'#f0fdf4',
  quality_review:  '#f0fdf4',
  legal_review:    '#f0fdf4',
  published:       '#dcfce7',
  rejected:        '#fee2e2',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, contributor_status')
    .eq('id', user.id)
    .single()

  const { data: allContent } = await supabase
    .from('content')
    .select('id, title_ar, status, created_at')
    .eq('contributor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const content = allContent || []

  const stats = {
    total:     content.length,
    published: content.filter(c => c.status === 'published').length,
    review:    content.filter(c => ['uploaded','technical_review','quality_review','legal_review'].includes(c.status)).length,
    draft:     content.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="dash-main">
      <div className="dash-header">
        <div>
          <h1 className="dash-welcome">
            أهلاً، {profile?.full_name?.split(' ')[0] || 'المساهم'} 👋
          </h1>
          <p className="dash-sub">هذه لوحة أعمالك في عُمان ستوك</p>
        </div>
        <Link href="/dashboard/upload" className="dash-upload-btn">
          + رفع عمل جديد
        </Link>
      </div>

      {/* بطاقات الإحصاء */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{stats.total}</div>
          <div className="stat-label">إجمالي الأعمال</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-num">{stats.published}</div>
          <div className="stat-label">منشور للبيع</div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-num">{stats.review}</div>
          <div className="stat-label">تحت المراجعة</div>
        </div>
        <div className="stat-card stat-muted">
          <div className="stat-num">{stats.draft}</div>
          <div className="stat-label">مسودات</div>
        </div>
      </div>

      {/* آخر الأعمال */}
      <div className="dash-section">
        <h2 className="dash-section-title">آخر الأعمال</h2>

        {content.length === 0 ? (
          <div className="dash-empty">
            <p>ما رفعت أي أعمال بعد.</p>
            <Link href="/dashboard/upload" className="dash-upload-btn">
              ابدأ برفع أول عمل
            </Link>
          </div>
        ) : (
          <div className="content-list">
            {content.map(item => (
              <div className="content-row" key={item.id}>
                <div className="content-title">{item.title_ar}</div>
                <span
                  className="content-badge"
                  style={{
                    color:      STATUS_COLOR[item.status] || '#666',
                    background: STATUS_BG[item.status]   || '#f3f4f6',
                  }}
                >
                  {STATUS_LABEL[item.status] || item.status}
                </span>
                <span className="content-date">
                  {new Date(item.created_at).toLocaleDateString('ar-OM', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
