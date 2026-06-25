const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL

export function previewUrl(path) {
  if (!path) return null
  return `${BASE}/storage/v1/object/public/previews/${path}`
}
