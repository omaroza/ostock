'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase-browser'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSignup() {
    if (!fullName || !email || !password) { setError('الرجاء ملء جميع الحقول'); return }
    if (password.length < 6) { setError('كلمة المرور 6 أحرف على الأقل'); return }
    if (password !== confirm) { setError('كلمتا المرور غير متطابقتين'); return }

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (err) {
      setError(
        err.message === 'User already registered'
          ? 'هذا البريد مسجّل مسبقاً'
          : 'حدث خطأ، حاول مجدداً'
      )
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

        <h1 className="auth-title">انضم كمساهم</h1>
        <p className="auth-sub">أنشئ حسابك وابدأ بنشر أعمالك العُمانية</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>الاسم الكامل</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="محمد بن سالم الرزيقي"
          />
        </div>
        <div className="auth-field">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
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
          />
        </div>
        <div className="auth-field">
          <label>تأكيد كلمة المرور</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />
        </div>

        <button className="auth-btn" onClick={handleSignup} disabled={loading}>
          {loading ? 'جارٍ الإنشاء…' : 'إنشاء الحساب ←'}
        </button>

        <p className="auth-switch">
          عندك حساب؟{' '}
          <Link href="/auth/login">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  )
}
