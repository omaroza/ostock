'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase-browser'

function uid36() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
function ext(name) { return name.split('.').pop().toLowerCase() }

function acceptByCode(code) {
  if (code === 'photo')                              return 'image/jpeg,image/png,image/webp,image/tiff'
  if (['ground_video','drone_video'].includes(code)) return 'video/mp4,video/quicktime'
  if (['audio_ambient','voiceover'].includes(code))  return 'audio/mpeg,audio/wav,audio/aac,audio/flac'
  if (code === 'template')                            return '.zip,.psd,.ai,.svg,.eps,.pptx'
  return '*/*'
}

export default function AdminUploadPage() {
  const router = useRouter()
  const supabase = createClient()

  const [categories,   setCategories]   = useState([])
  const [productTypes, setProductTypes] = useState([])

  const [form, setForm] = useState({
    title_ar: '', description_ar: '',
    product_type_id: '', product_type_code: '',
    category_id: '', omani_location: '', keywords: '',
    voice_over_script: '',
  })
  const [originalFile, setOriginalFile] = useState(null)
  const [previewFile,  setPreviewFile]  = useState(null)
  const [publishNow,   setPublishNow]   = useState(true)

  const [loading,  setLoading]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: types }] = await Promise.all([
        supabase.from('categories').select('id,name_ar').eq('level','sector').eq('is_active',true).order('sort_order'),
        supabase.from('product_types').select('id,code,name_ar').eq('is_active',true).order('sort_order'),
      ])
      setCategories(cats || [])
      setProductTypes((types || []).filter(t => t.code !== 'bundle'))
    }
    load()
  }, [])

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  const isVoice = form.product_type_code === 'voiceover'

  async function handleSubmit() {
    if (!form.title_ar)        { setError('العنوان مطلوب'); return }
    if (!form.product_type_id) { setError('نوع المحتوى مطلوب'); return }
    if (!originalFile)         { setError('الملف الأصلي مطلوب'); return }

    setLoading(true); setError(''); setProgress(8)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const fileId   = uid36()
    const origExt  = ext(originalFile.name)
    const origPath = `${user.id}/platform_${fileId}.${origExt}`

    const { error: e1 } = await supabase.storage.from('originals').upload(origPath, originalFile)
    if (e1) { setError('فشل رفع الملف: ' + e1.message); setLoading(false); return }
    setProgress(45)

    let previewPath = null
    if (previewFile) {
      const prevPath = `${user.id}/platform_${fileId}_preview.${ext(previewFile.name)}`
      const { error: e2 } = await supabase.storage.from('previews').upload(prevPath, previewFile)
      if (!e2) previewPath = prevPath
    }
    setProgress(70)

    const keywords = form.keywords
      ? form.keywords.split(',').map(k => k.trim()).filter(Boolean) : []

    const { error: e3 } = await supabase.from('content').insert({
      contributor_id:  null,                          // محتوى مملوك للمنصة
      ownership:       'platform',
      product_type_id: form.product_type_id,
      category_id:     form.category_id || null,
      title_ar:        form.title_ar,
      description_ar:  form.description_ar || null,
      keywords,
      omani_location:  form.omani_location || null,
      file_path:       origPath,
      preview_path:    previewPath,
      file_format:     origExt,
      has_identifiable_people: false,
      status:          publishNow ? 'published' : 'draft',
      published_at:    publishNow ? new Date().toISOString() : null,
    })

    if (e3) { setError('فشل الحفظ: ' + e3.message); setLoading(false); return }

    setProgress(100); setSuccess(true); setLoading(false)
  }

  function reset() {
    setSuccess(false); setError(''); setProgress(0)
    setOriginalFile(null); setPreviewFile(null); setPublishNow(true)
    setForm({ title_ar:'', description_ar:'', product_type_id:'', product_type_code:'', category_id:'', omani_location:'', keywords:'', voice_over_script:'' })
  }

  if (success) {
    return (
      <div className="admin-main">
        <div className="aupload-success">
          <div className="ic">✓</div>
          <h2 style={{ fontSize: 22, color: 'var(--ink)' }}>تم رفع محتوى المنصة</h2>
          <p style={{ color: 'var(--muted)' }}>
            {publishNow
              ? 'العمل الآن منشور للبيع مباشرةً باسم المنصة.'
              : 'العمل محفوظ كمسودة — انشره متى شئت من مراجعة المحتوى.'}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="dash-upload-btn" onClick={reset} style={{ background: 'var(--ink)' }}>+ رفع عمل آخر</button>
            <Link href="/admin/content" className="admin-action-link">عرض المحتوى ←</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-main">
      <h1 className="admin-page-title">رفع محتوى المنصة</h1>
      <p className="admin-page-sub">محتوى من إنتاج فريقكم — يُسجَّل باسم المنصة بنسبة ملكية كاملة، دون مساهم خارجي.</p>

      {error && <div className="auth-error" style={{ marginBottom: 20, maxWidth: 760 }}>{error}</div>}

      <div className="aupload-form">
        <div className="aupload-note">
          🏛 هذا المحتوى مملوك للمنصة بالكامل (إنتاج ذاتي)، ولا يدخل في حساب مستحقات المساهمين.
        </div>

        {/* الملف */}
        <div className="aupload-section">
          <h3 className="aupload-section-title"><span>1</span> الملف الأصلي</h3>
          <div className="afield">
            <label>نوع المحتوى <span className="req">*</span></label>
            <select
              value={form.product_type_id}
              onChange={e => {
                const sel = productTypes.find(t => t.id === e.target.value)
                set('product_type_id', e.target.value)
                set('product_type_code', sel?.code || '')
                setOriginalFile(null)
              }}
            >
              <option value="">— اختر النوع —</option>
              {productTypes.map(t => <option key={t.id} value={t.id}>{t.name_ar}</option>)}
            </select>
          </div>

          <div className={`afile-drop ${originalFile ? 'afile-sel' : ''}`}
               onClick={() => document.getElementById('a-orig').click()}>
            <input id="a-orig" type="file"
                   accept={acceptByCode(form.product_type_code)}
                   onChange={e => setOriginalFile(e.target.files[0] || null)} />
            <div className="ic">{originalFile ? '✓' : '↑'}</div>
            {originalFile
              ? <p><b>{originalFile.name}</b> ({(originalFile.size/1024/1024).toFixed(2)} MB)</p>
              : <p>اضغط لاختيار الملف</p>}
          </div>
        </div>

        {/* المعاينة */}
        <div className="aupload-section">
          <h3 className="aupload-section-title"><span>2</span> صورة المعاينة <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>(تظهر للمتصفّحين)</span></h3>
          <div className={`afile-drop ${previewFile ? 'afile-sel' : ''}`}
               onClick={() => document.getElementById('a-prev').click()}>
            <input id="a-prev" type="file" accept="image/jpeg,image/png,image/webp"
                   onChange={e => setPreviewFile(e.target.files[0] || null)} />
            <div className="ic">{previewFile ? '✓' : '🖼'}</div>
            {previewFile ? <p><b>{previewFile.name}</b></p> : <p>اضغط لاختيار صورة المعاينة</p>}
          </div>
        </div>

        {/* البيانات */}
        <div className="aupload-section">
          <h3 className="aupload-section-title"><span>3</span> بيانات العمل</h3>
          <div className="afield">
            <label>العنوان <span className="req">*</span></label>
            <input type="text" value={form.title_ar} onChange={e => set('title_ar', e.target.value)}
                   placeholder="مثال: لقطة جوية لقلعة نزوى عند الغروب" />
          </div>
          <div className="afield">
            <label>الوصف <span className="opt">(اختياري)</span></label>
            <textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)}
                      placeholder="وصف مختصر للعمل" />
          </div>
          <div className="arow">
            <div className="afield">
              <label>القطاع <span className="opt">(اختياري)</span></label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">— اختر القطاع —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>
            <div className="afield">
              <label>الموقع العُماني <span className="opt">(اختياري)</span></label>
              <input type="text" value={form.omani_location} onChange={e => set('omani_location', e.target.value)}
                     placeholder="مثال: نزوى، الداخلية" />
            </div>
          </div>
          {isVoice && (
            <div className="afield">
              <label>نص التعليق الصوتي <span className="opt">(للفويس أوفر)</span></label>
              <textarea value={form.voice_over_script} onChange={e => set('voice_over_script', e.target.value)}
                        placeholder="النص المكتوب للتعليق الصوتي" />
            </div>
          )}
          <div className="afield">
            <label>الكلمات المفتاحية <span className="opt">افصل بفاصلة</span></label>
            <input type="text" value={form.keywords} onChange={e => set('keywords', e.target.value)}
                   placeholder="قلعة، نزوى، تراث، جوي، غروب" />
          </div>
        </div>

        {/* النشر */}
        <div className="aupload-section">
          <h3 className="aupload-section-title"><span>4</span> النشر</h3>
          <label className="apublish-toggle">
            <input type="checkbox" checked={publishNow} onChange={e => setPublishNow(e.target.checked)} />
            نشر مباشر للبيع الآن (محتوى المنصة لا يحتاج مراجعة خارجية)
          </label>
        </div>

        {loading && <div className="aprogress"><div className="aprogress-bar" style={{ width: `${progress}%` }} /></div>}

        <button className="aupload-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? `جارٍ الرفع… ${progress}%` : (publishNow ? 'رفع ونشر ←' : 'حفظ كمسودة ←')}
        </button>
      </div>
    </div>
  )
}
