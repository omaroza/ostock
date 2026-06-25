import './admin.css'
import Link from 'next/link'
import { createClient } from '../../lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // الميدل وير يتولّى الحماية الأساسية؛ هنا فقط نجلب البيانات للعرض
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('full_name, role').eq('id', user.id).single()

  const { count: pendingCount } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })
    .in('status', ['uploaded', 'technical_review', 'quality_review', 'legal_review'])

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-logo">
          <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
            <rect x="1" y="1" width="32" height="32" rx="9" stroke="#e0b461" strokeWidth="1.6"/>
            <path d="M9 22V12l8-4 8 4v10" stroke="#e0b461" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="17" cy="16.5" r="3" stroke="#efe7d6" strokeWidth="1.6"/>
          </svg>
          <div className="admin-logo-text">
            <strong>عُمان ستوك</strong>
            <span>لوحة الإدارة</span>
          </div>
        </Link>

        <nav className="admin-nav">
          <Link href="/admin">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
            نظرة عامة
          </Link>

          <Link href="/admin/content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            مراجعة المحتوى
            {pendingCount > 0 && (
              <span className="admin-nav-badge">{pendingCount}</span>
            )}
          </Link>

          <Link href="/admin/upload">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            رفع محتوى المنصة
          </Link>

          <Link href="/admin/revenue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            إعدادات الأرباح
          </Link>

          <Link href="/admin/users">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            المستخدمون
          </Link>

          <Link href="/admin/settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            إعدادات الموقع
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/dashboard" className="admin-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            لوحة المساهم
          </Link>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
