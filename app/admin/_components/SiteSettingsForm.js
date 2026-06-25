'use client'
import { useState } from 'react'
import { createClient } from '../../../lib/supabase-browser'

export default function SiteSettingsForm({ settings }) {
  const [vals, setVals] = useState({
    hook_line_1: settings.hook_line_1 || 'جمهورك عُماني...',
    hook_line_2: settings.hook_line_2 || 'فلماذا تبحث عن',
    hook_line_3: settings.hook_line_3 || 'صور أجنبية؟',
    nav_1: settings.nav_link_1_label || 'استكشاف المحتوى',
    nav_2: settings.nav_link_2_label || 'القطاعات',
    nav_3: settings.nav_link_3_label || 'الأسعار',
    nav_4: settings.nav_link_4_label || 'كن مساهماً',
    nav_5: settings.nav_link_5_label || 'عن عُمان ستوك',
  })
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const updates = [
      { key:'hook_line_1', value:vals.hook_line_1, description:'السطر الأول من الهوك' },
      { key:'hook_line_2', value:vals.hook_line_2, description:'السطر الثاني من الهوك' },
      { key:'hook_line_3', value:vals.hook_line_3, description:'السطر الثالث من الهوك' },
      { key:'nav_link_1_label', value:vals.nav_1, description:'رابط التنقّل الأول' },
      { key:'nav_link_2_label', value:vals.nav_2, description:'رابط التنقّل الثاني' },
      { key:'nav_link_3_label', value:vals.nav_3, description:'رابط التنقّل الثالث' },
      { key:'nav_link_4_label', value:vals.nav_4, description:'رابط التنقّل الرابع' },
      { key:'nav_link_5_label', value:vals.nav_5, description:'رابط التنقّل الخامس' },
    ]
    for (const u of updates) {
      await supabase.from('site_settings').upsert(u, { onConflict:'key' })
    }
    setSaving(false); setOk(true)
    setTimeout(() => setOk(false), 3000)
  }

  const field = (label, key, gold) => (
    <div style={{marginBottom:16}}>
      <label style={{display:'block',fontSize:14,fontWeight:600,color:'var(--ink)',marginBottom:6}}>{label}</label>
      <input value={vals[key]} onChange={e=>setVals({...vals,[key]:e.target.value})}
        style={{width:'100%',border:'1.5px solid var(--line)',borderRadius:10,padding:'10px 14px',
          fontFamily:'inherit',fontSize:15,color:gold?'var(--amber)':'var(--text)',fontWeight:gold?600:400}} />
    </div>
  )

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
      <div style={{background:'#fff',borderRadius:14,padding:28,border:'1.5px solid var(--line)'}}>
        <h2 style={{fontSize:17,color:'var(--ink)',marginBottom:20,fontFamily:'Noto Kufi Arabic'}}>
          📝 نص الهوك (الصفحة الرئيسية)
        </h2>
        {field('السطر الأول (أبيض)', 'hook_line_1')}
        {field('السطر الثاني (ذهبي)', 'hook_line_2', true)}
        {field('السطر الثالث (أبيض)', 'hook_line_3')}
        <div style={{background:'var(--navy)',borderRadius:10,padding:16,marginTop:8}}>
          <p style={{color:'#fff',fontSize:16,lineHeight:1.5,textAlign:'center'}}>
            {vals.hook_line_1}<br/>
            <span style={{color:'var(--amber)'}}>{vals.hook_line_2}</span><br/>
            {vals.hook_line_3}
          </p>
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:14,padding:28,border:'1.5px solid var(--line)'}}>
        <h2 style={{fontSize:17,color:'var(--ink)',marginBottom:20,fontFamily:'Noto Kufi Arabic'}}>
          🔗 روابط التنقّل
        </h2>
        {field('الرابط الأول', 'nav_1')}
        {field('الرابط الثاني', 'nav_2')}
        {field('الرابط الثالث', 'nav_3')}
        {field('الرابط الرابع', 'nav_4')}
        {field('الرابط الخامس', 'nav_5')}
      </div>

      <div style={{gridColumn:'1/-1'}}>
        {ok && <div className="auth-success" style={{marginBottom:12}}>✓ تم حفظ الإعدادات — ستظهر التغييرات فور تحديث الصفحة</div>}
        <button onClick={save} disabled={saving}
          style={{background:'var(--ink)',color:'#fff',border:0,padding:'13px 36px',borderRadius:999,
            fontFamily:'inherit',fontSize:15,fontWeight:600,cursor:'pointer'}}>
          {saving ? 'جارٍ الحفظ…' : 'حفظ الإعدادات ←'}
        </button>
      </div>
    </div>
  )
}
