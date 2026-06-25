'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase-browser'

export default function LogoutBtn() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button className="logout-btn" onClick={handleLogout}>
      تسجيل الخروج
    </button>
  )
}
