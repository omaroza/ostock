import { createClient } from '../../../lib/supabase-server'
import RoleSelect from '../_components/RoleSelect'

export const revalidate = 0

const ROLE_LABEL = {
  visitor: 'زائر', contributor: 'مساهم',
  reviewer: 'مراجع', admin: 'أدمن',
}

export default async function AdminUsersPage() {
  const supabase = createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, role, contributor_status, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: authUsers } = await supabase.auth.admin
    ? { data: null }
    : { data: null }

  const list = users || []

  return (
    <div className="admin-main">
      <h1 className="admin-page-title">المستخدمون</h1>
      <p className="admin-page-sub">
        {list.length} مستخدم مسجّل. غيّر دور أي مستخدم مباشرة من القائمة.
      </p>

      <div className="admin-table-wrap">
        <div className="admin-table-head">
          <span className="admin-table-title">قائمة المستخدمين</span>
        </div>

        {list.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>تاريخ التسجيل</th>
                <th>الدور الحالي</th>
                <th>تغيير الدور</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-content-title">
                      {u.full_name || '(بدون اسم)'}
                    </div>
                    <div className="admin-content-meta">{u.id.slice(0, 8)}…</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {new Date(u.created_at).toLocaleDateString('ar-OM', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td>
                    <span className={`sbadge ${
                      u.role === 'admin'       ? 'sbadge-published' :
                      u.role === 'contributor' ? 'sbadge-review'    :
                      u.role === 'reviewer'    ? 'sbadge-review'    : 'sbadge-draft'
                    }`}>
                      {ROLE_LABEL[u.role] || u.role}
                    </span>
                  </td>
                  <td>
                    <RoleSelect userId={u.id} currentRole={u.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">لا يوجد مستخدمون بعد.</div>
        )}
      </div>
    </div>
  )
}
