import { createClient } from '../../../lib/supabase-server'
import RevenueForm from '../_components/RevenueForm'

export const revalidate = 0

export default async function RevenuePage() {
  const supabase = createClient()

  const { data: licenseTypes, error: e1 } = await supabase
    .from('license_types')
    .select('id, code, name_ar, description_ar')
    .eq('is_active', true)
    .order('sort_order')

  const { data: currentSettings, error: e2 } = await supabase
    .from('revenue_settings')
    .select('*')

  // إذا فيه خطأ نعرضه
  if (e1) {
    return (
      <div className="admin-main">
        <h1 className="admin-page-title">إعدادات الأرباح</h1>
        <div className="auth-error">خطأ في تحميل أنواع التراخيص: {e1.message}</div>
      </div>
    )
  }

  return (
    <div className="admin-main">
      <h1 className="admin-page-title">إعدادات الأرباح</h1>
      <p className="admin-page-sub">
        حدّد نِسبة تقسيم الأرباح بين المنصة والمساهم لكل نوع ترخيص.
        عند إدخال نِسبة المنصة، نِسبة المساهم تُحسب تلقائياً.
      </p>

      <RevenueForm
        licenseTypes={licenseTypes || []}
        currentSettings={currentSettings || []}
      />
    </div>
  )
}
