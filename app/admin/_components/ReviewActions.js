'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase-browser'

export default function ReviewActions({ contentId }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason,    setReason]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const router = useRouter()

  async function approve() {
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('content').update({
      status: 'published',
      published_at: new Date().toISOString(),
    }).eq('id', contentId)
    if (err) { setError('فشل النشر: ' + err.message); setLoading(false); return }
    router.push('/admin/content')
    router.refresh()
  }

  async function reject() {
    if (!reason.trim()) { setError('الرجاء كتابة سبب الرفض'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('content').update({
      status: 'rejected',
      rejection_reason: reason,
    }).eq('id', contentId)
    if (err) { setError('فشل الرفض: ' + err.message); setLoading(false); return }
    router.push('/admin/content')
    router.refresh()
  }

  return (
    <div className="review-actions">
      {error && <div className="auth-error" style={{ marginBottom: 14 }}>{error}</div>}

      {!rejecting ? (
        <div className="review-btns">
          <button className="btn-approve" onClick={approve} disabled={loading}>
            {loading ? 'جارٍ…' : '✓ نشر المحتوى'}
          </button>
          <button className="btn-reject" onClick={() => setRejecting(true)} disabled={loading}>
            ✕ رفض المحتوى
          </button>
        </div>
      ) : (
        <div className="reject-form">
          <label>سبب الرفض</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="اشرح للمساهم سبب رفض عمله…"
            rows="3"
          />
          <div className="review-btns">
            <button className="btn-reject" onClick={reject} disabled={loading}>
              {loading ? 'جارٍ…' : 'تأكيد الرفض'}
            </button>
            <button className="btn-cancel" onClick={() => { setRejecting(false); setError('') }} disabled={loading}>
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
