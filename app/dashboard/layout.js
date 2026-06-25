import './dashboard.css'
import Link from 'next/link'
import { createClient } from '../../lib/supabase-server'
import LogoutBtn from './_components/LogoutBtn'

export default async function DashboardLayout({ children }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const displayName = profile?.full_name || user?.email || 'المساهم'

  return (
    <div className="dash-wrap">
      <aside className="dash-sidebar">
        <Link href="/" className="dash-logo">
          <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
            <rect x="1" y="1" width="32" height="32" rx="9" stroke="#e0b461" strokeWidth="1.6"/>
            <path d="M9 22V12l8-4 8 4v10" stroke="#e0b461" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="17" cy="16.5" r="3" stroke="#efe7d6" strokeWidth="1.6"/>
          </svg>
          عُمان <b>ستوك</b>
        </Link>

        <nav className="dash-nav">
          <Link href="/dashboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
            لوحتي
          </Link>

          <Link href="/dashboard/upload">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            رفع عمل جديد
          </Link>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-name">{displayName}</div>
          <LogoutBtn />
        </div>
      </aside>

      <main className="dash-content">
        {children}
      </main>
    </div>
  )
}
