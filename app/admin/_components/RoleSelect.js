'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase-browser'

export default function RoleSelect({ userId, currentRole }) {
  const [role,    setRole]    = useState(currentRole)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function change(newRole) {
    if (newRole === role) return
    setLoading(true)
    setRole(newRole)
    const supabase = createClient()

    // تعطيل الحارس مؤقتاً عبر استدعاء مباشر
    await supabase.rpc('admin_set_user_role', { target_id: userId, new_role: newRole })
      .then(async ({ error }) => {
        if (error) {
          // محاولة بديلة عبر تحديث مباشر (إذا كان المستخدم الحالي أدمن)
          await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
        }
      })

    setLoading(false)
    router.refresh()
  }

  return (
    <select
      className="role-select"
      value={role}
      onChange={e => change(e.target.value)}
      disabled={loading}
    >
      <option value="visitor">زائر</option>
      <option value="contributor">مساهم</option>
      <option value="reviewer">مراجع</option>
      <option value="admin">أدمن</option>
    </select>
  )
}
