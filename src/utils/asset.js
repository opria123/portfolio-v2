export function asset(path) {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '')
}
