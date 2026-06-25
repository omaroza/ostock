'use client'
import { useState } from 'react'
import { createClient } from '../../../lib/supabase-browser'

export default function RevenueForm({ licenseTypes, currentSettings }) {
  // بناء الحالة الأولية
  const buildInitial = () => {
    const init = {}
    licenseTypes.forEach(lt => {
      const ex = currentSettings.find(s => s.license_type_id === lt.id)
      init[lt.id] = {
        platform:    ex ? String(ex.platform_pct)    : '',
        contributor: ex ? String(ex.contributor_pct) : '',
      }
    })
    return init
  }

  const [values,  setValues]  = useState(buildInitial)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  function handlePlatform(lid, val) {
    const num = parseFloat(val)
    setValues(prev => ({
      ...prev,
      [lid]: {
        platform:    val,
        contributor: (!isNaN(num) && num >= 0 && num <= 100)
          ? String((100 - num).toFixed(2)).replace(/\.00$/, '')
          : prev[lid].contributor,
      }
    }))
  }

  function handleContributor(lid, val) {
    const num = parseFloat(val)
    setValues(prev => ({
      ...prev,
      [lid]: {
        contributor: val,
        platform: (!isNaN(num) && num >= 0 && num <= 100)
          ? String((100 - num).toFixed(2)).replace(/\.00$/, '')
          : prev[lid].platform,
      }
    }))
  }

  async function save() {
    for (const lt of licenseTypes) {
      const p = parseFloat(values[lt.id]?.platform)
      const c = parseFloat(values[lt.id]?.contributor)
      if (isNaN(p) || isNaN(c)) {
        setError(`أدخل أرقاماً صحيحة للترخيص: ${lt.name_ar}`); return
      }
      if (Math.abs(p + c - 100) > 0.01) {
        setError(`مجموع النِّسب في "${lt.name_ar}" يجب أن يساوي 100%`); return
      }
    }

    setLoading(true); setError(''); setSuccess(false)
    const supabase = createClient()

    for (const lt of licenseTypes) {
      const { error: err } = await supabase
        .from('revenue_settings')
        .upsert({
          license_type_id: lt.id,
          platform_pct:    parseFloat(values[lt.id].platform),
          contributor_pct: parseFloat(values[lt.id].contributor),
          is_active:       true,
        }, { onConflict: 'license_type_id' })

      if (err) {
        setError(`فشل الحفظ في "${lt.name_ar}": ${err.message}`)
        setLoading(false); return
      }
    }

    setLoading(false); setSuccess(true)
    setTimeout(() => setSuccess(false), 4000)
  }

  if (!licenseTypes || licenseTypes.length === 0) {
    return <div className="admin-empty">لا توجد أنواع تراخيص — تأكّد من البيانات في قاعدة البيانات.</div>
  }

  return (
    <div>
      {error   && <div className="auth-error"   style={{ marginBottom: 20 }}>{error}</div>}
      {success && <div className="auth-success" style={{ marginBottom: 20 }}>✓ تم حفظ الإعدادات بنجاح</div>}

      <div className="revenue-table">
        <div className="revenue-header">
          <span>نوع الترخيص</span>
          <span style={{ textAlign: 'center' }}>نسبة المنصة %</span>
          <span style={{ textAlign: 'center' }}>نسبة المساهم %</span>
          <span style={{ textAlign: 'center' }}>المجموع</span>
        </div>

        {licenseTypes.map(lt => {
          const p   = parseFloat(values[lt.id]?.platform)    || 0
          const c   = parseFloat(values[lt.id]?.contributor) || 0
          const sum = p + c
          const hasVal = values[lt.id]?.platform !== ''
          const ok  = hasVal && Math.abs(sum - 100) < 0.01

          return (
            <div className="revenue-row" key={lt.id}>
              <div>
                <div className="lt-name">{lt.name_ar}</div>
                {lt.description_ar && (
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {lt.description_ar}
                  </div>
                )}
              </div>

              <input
                type="number" min="0" max="100" step="1"
                value={values[lt.id]?.platform}
                onChange={e => handlePlatform(lt.id, e.target.value)}
                placeholder="مثال: 60"
              />

              <input
                type="number" min="0" max="100" step="1"
                value={values[lt.id]?.contributor}
                onChange={e => handleContributor(lt.id, e.target.value)}
                placeholder="مثال: 40"
              />

              <span className={`sum ${hasVal ? (ok ? 'ok' : 'err') : ''}`}>
                {hasVal ? `${sum.toFixed(0)}%` : '—'}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 22 }}>
        <button
          className="admin-save-btn"
          onClick={save}
          disabled={loading}
        >
          {loading ? 'جارٍ الحفظ…' : 'حفظ الإعدادات ←'}
        </button>
      </div>
    </div>
  )
}
