'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) { setError('الرجاء إدخال البريد وكلمة المرور'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('البريد أو كلمة المرور غير صحيحة')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect x="1" y="1" width="32" height="32" rx="9" stroke="#c8922e" strokeWidth="1.6"/>
            <path d="M9 22V12l8-4 8 4v10" stroke="#c8922e" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="17" cy="16.5" r="3" stroke="#15243b" strokeWidth="1.6"/>
          </svg>
          عُمان <b>ستوك</b>
        </Link>

        <h1 className="auth-title">أهلاً بعودتك</h1>
        <p className="auth-sub">ادخل بياناتك للوصول إلى لوحة المساهم</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="auth-field">
          <label>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'جارٍ الدخول…' : 'دخول ←'}
        </button>

        <p className="auth-switch">
          ما عندك حساب؟{' '}
          <Link href="/auth/signup">أنشئ حساباً جديداً</Link>
        </p>
      </div>
    </div>
  )
}
