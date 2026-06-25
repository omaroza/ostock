import SiteSettingsForm from '../_components/SiteSettingsForm'
import { createClient } from '../../../lib/supabase-server'
export const revalidate = 0
export default async function SettingsPage() {
  const supabase = createClient()
  const { data: settings } = await supabase.from('site_settings').select('*')
  const map = {}
  ;(settings||[]).forEach(s => { map[s.key] = s.value })
  return (
    <div className="admin-main">
      <h1 className="admin-page-title">إعدادات الموقع</h1>
      <p className="admin-page-sub">تحكّم في نصوص الصفحة الرئيسية وعناوين التنقّل بدون أي برمجة</p>
      <SiteSettingsForm settings={map} />
    </div>
  )
}
