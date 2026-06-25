'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase-browser'

function uid36() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function ext(filename) {
  return filename.split('.').pop().toLowerCase()
}

function acceptByCode(code) {
  if (code === 'photo')                            return 'image/jpeg,image/png,image/webp,image/tiff'
  if (['ground_video','drone_video'].includes(code)) return 'video/mp4,video/quicktime'
  if (['audio_ambient','voiceover'].includes(code)) return 'audio/mpeg,audio/wav,audio/aac,audio/flac'
  if (code === 'template')                          return '.zip,.psd,.ai,.sketch,.fig,.pptx,.key'
  return '*/*'
}

export default function UploadPage() {
  const router = useRouter()
  const supabase = createClient()

  const [categories,   setCategories]   = useState([])
  const [productTypes, setProductTypes] = useState([])

  const [form, setForm] = useState({
    title_ar: '', description_ar: '',
    product_type_id: '', product_type_code: '',
    category_id: '', omani_location: '', keywords: '',
    has_identifiable_people: false,
  })

  const [originalFile, setOriginalFile] = useState(null)
  const [previewFile,  setPreviewFile]  = useState(null)
  const [consentFile,  setConsentFile]  = useState(null)
  const [modelName,    setModelName]    = useState('')

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
      setCategories(cats  || [])
      setProductTypes((types || []).filter(t => t.code !== 'bundle'))
    }
    load()
  }, [])

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit() {
    if (!form.title_ar)         { setError('العنوان مطلوب'); return }
    if (!form.product_type_id)  { setError('نوع المحتوى مطلوب'); return }
    if (!originalFile)          { setError('الملف الأصلي مطلوب'); return }

    setLoading(true); setError(''); setProgress(5)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const fileId  = uid36()
    const origExt = ext(originalFile.name)
    const origPath = `${user.id}/${fileId}.${origExt}`

    // رفع الملف الأصلي
    const { error: e1 } = await supabase.storage.from('originals').upload(origPath, originalFile)
    if (e1) { setError('فشل رفع الملف: ' + e1.message); setLoading(false); return }
    setProgress(45)

    // رفع المعاينة
    let previewPath = null
    if (previewFile) {
      const prevPath = `${user.id}/${fileId}_preview.${ext(previewFile.name)}`
      const { error: e2 } = await supabase.storage.from('previews').upload(prevPath, previewFile)
      if (!e2) previewPath = prevPath
    }
    setProgress(65)

    // إدراج سجل المحتوى
    const keywords = form.keywords
      ? form.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : []

    const { data: row, error: e3 } = await supabase.from('content').insert({
      contributor_id:          user.id,
      ownership:               'contributor',
      product_type_id:         form.product_type_id,
      category_id:             form.category_id  || null,
      title_ar:                form.title_ar,
      description_ar:          form.description_ar || null,
      keywords,
      omani_location:          form.omani_location || null,
      file_path:               origPath,
      preview_path:            previewPath,
      file_format:             origExt,
      has_identifiable_people: form.has_identifiable_people,
      status:                  'uploaded',
    }).select('id').single()

    if (e3) { setError('فشل حفظ البيانات: ' + e3.message); setLoading(false); return }
    setProgress(82)

    // رفع نموذج الموافقة
    if (form.has_identifiable_people && consentFile && row) {
      const conPath = `${user.id}/${fileId}_consent.${ext(consentFile.name)}`
      const { error: e4 } = await supabase.storage.from('consent-docs').upload(conPath, consentFile)
      if (!e4) {
        await supabase.from('content_consent').insert({
          content_id:    row.id,
          model_full_name: modelName || 'غير محدد',
          document_path: conPath,
          consent_scope: 'استخدام تجاري — منصة عُمان ستوك',
        })
      }
    }

    setProgress(100)
    setSuccess(true)
    setLoading(false)
  }

  function resetForm() {
    setSuccess(false); setError(''); setProgress(0)
    setOriginalFile(null); setPreviewFile(null); setConsentFile(null); setModelName('')
    setForm({ title_ar:'', description_ar:'', product_type_id:'', product_type_code:'', category_id:'', omani_location:'', keywords:'', has_identifiable_people: false })
  }

  if (success) {
    return (
      <div className="dash-main">
        <div className="upload-success-page">
          <div className="upload-success-icon">✓</div>
          <h2>تم رفع العمل بنجاح!</h2>
          <p>عملك الآن في طابور المراجعة. ستتلقى إشعاراً عند اكتمال المراجعة ونشره.</p>
          <div className="upload-success-actions">
            <button className="dash-upload-btn" onClick={resetForm}>+ رفع عمل آخر</button>
            <Link href="/dashboard" className="dash-back-link">العودة للوحتي</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-main">
      <div className="dash-header">
        <div>
          <h1 className="dash-welcome">رفع عمل جديد</h1>
          <p className="dash-sub">أرسل محتواك للمراجعة وانتظر نشره في المنصة</p>
        </div>
        <Link href="/dashboard" className="dash-back-link">← لوحتي</Link>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 24 }}>{error}</div>}

      <div className="upload-form">

        {/* ١ — نوع المحتوى والملف الأصلي */}
        <div className="upload-section">
          <h3 className="upload-section-title"><span>١</span> الملف الأصلي</h3>

          <div className="form-field">
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
              {productTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name_ar}</option>
              ))}
            </select>
          </div>

          <div
            className={`file-drop ${originalFile ? 'file-selected' : ''}`}
            onClick={() => document.getElementById('orig-inp').click()}
          >
            <input
              id="orig-inp"
              type="file"
              accept={acceptByCode(form.product_type_code)}
              onChange={e => setOriginalFile(e.target.files[0] || null)}
            />
            <div className="drop-icon">{originalFile ? '✓' : '↑'}</div>
            {originalFile
              ? <p><b>{originalFile.name}</b> ({(originalFile.size/1024/1024).toFixed(2)} MB)</p>
              : <p>اضغط لاختيار الملف<br/>
                  <span style={{ fontSize: 12, color: '#bbb' }}>
                    {form.product_type_code === 'photo'    ? 'JPG · PNG · WEBP'  :
                     form.product_type_code?.includes('video') ? 'MP4 · MOV'    :
                     form.product_type_code?.includes('audio') ? 'MP3 · WAV · AAC' : '*'}
                  </span>
                </p>
            }
          </div>
        </div>

        {/* ٢ — صورة المعاينة */}
        <div className="upload-section">
          <h3 className="upload-section-title"><span>٢</span> صورة المعاينة</h3>
          <p className="upload-hint">تظهر للمتصفّحين قبل الشراء. مطلوبة للفيديو والصوت والقوالب.</p>

          <div
            className={`file-drop ${previewFile ? 'file-selected' : ''}`}
            onClick={() => document.getElementById('prev-inp').click()}
          >
            <input
              id="prev-inp"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setPreviewFile(e.target.files[0] || null)}
            />
            <div className="drop-icon">{previewFile ? '✓' : '🖼'}</div>
            {previewFile
              ? <p><b>{previewFile.name}</b></p>
              : <p>اضغط لاختيار صورة المعاينة (JPG · PNG · WEBP)</p>
            }
          </div>
        </div>

        {/* ٣ — البيانات */}
        <div className="upload-section">
          <h3 className="upload-section-title"><span>٣</span> بيانات العمل</h3>

          <div className="form-field">
            <label>العنوان <span className="req">*</span></label>
            <input
              type="text"
              value={form.title_ar}
              onChange={e => set('title_ar', e.target.value)}
              placeholder="مثال: شيخ عُماني في سوق مطرح"
            />
          </div>

          <div className="form-field">
            <label>الوصف <span className="opt">(اختياري)</span></label>
            <textarea
              value={form.description_ar}
              onChange={e => set('description_ar', e.target.value)}
              placeholder="وصف مختصر للمحتوى وظروف التصوير"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>القطاع <span className="opt">(اختياري)</span></label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">— اختر القطاع —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_ar}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>الموقع العُماني <span className="opt">(اختياري)</span></label>
              <input
                type="text"
                value={form.omani_location}
                onChange={e => set('omani_location', e.target.value)}
                placeholder="مثال: سوق مطرح، مسقط"
              />
            </div>
          </div>

          <div className="form-field">
            <label>
              الكلمات المفتاحية{' '}
              <span className="opt">افصل بينها بفاصلة</span>
            </label>
            <input
              type="text"
              value={form.keywords}
              onChange={e => set('keywords', e.target.value)}
              placeholder="دشداشة، كمة، تراث، عُمان، أسرة"
            />
          </div>
        </div>

        {/* ٤ — نموذج الموافقة */}
        <div className="upload-section">
          <h3 className="upload-section-title"><span>٤</span> نموذج الموافقة</h3>

          <label className="consent-toggle">
            <input
              type="checkbox"
              checked={form.has_identifiable_people}
              onChange={e => set('has_identifiable_people', e.target.checked)}
            />
            يوجد في العمل أشخاص يمكن التعرّف عليهم
          </label>

          {form.has_identifiable_people && (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label>اسم الشخص الظاهر</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  placeholder="الاسم الكامل"
                />
              </div>

              <div
                className={`file-drop ${consentFile ? 'file-selected' : ''}`}
                onClick={() => document.getElementById('con-inp').click()}
              >
                <input
                  id="con-inp"
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={e => setConsentFile(e.target.files[0] || null)}
                />
                <div className="drop-icon">{consentFile ? '✓' : '📄'}</div>
                {consentFile
                  ? <p><b>{consentFile.name}</b></p>
                  : <p>ارفع نموذج الموافقة الموقّع (PDF أو صورة)</p>
                }
              </div>
            </div>
          )}
        </div>

        {/* زر الإرسال */}
        {loading && (
          <div className="upload-progress">
            <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        <button className="upload-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? `جارٍ الرفع… ${progress}%` : 'إرسال للمراجعة ←'}
        </button>
      </div>
    </div>
  )
}
