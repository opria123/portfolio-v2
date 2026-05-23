// Portfolio content data
// Content lives in /public/content.json so it can be updated without redeploying.
// Override the source at runtime with VITE_CONTENT_URL (e.g. a raw GitHub URL).
// This module uses top-level await so all consumers receive resolved data via
// their normal `import { X } from '../data/portfolio'` statements.

const CONTENT_URL =
  import.meta.env.VITE_CONTENT_URL ||
  `${import.meta.env.BASE_URL}content.json`

let _data = {}
try {
  const res = await fetch(CONTENT_URL, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`content.json HTTP ${res.status}`)
  _data = await res.json()
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[portfolio] failed to load content.json:', err)
}

export const slugFromUrl = (url) => {
  if (!url) return ''
  const m = url.replace(/\/+$/, '').split('/')
  return m[m.length - 1] || ''
}

export const PROFILE = _data.PROFILE || {}
export const PROJECT_CATEGORIES = _data.PROJECT_CATEGORIES || []
export const PROJECTS = _data.PROJECTS || []
export const EXPERIENCES = _data.EXPERIENCES || []
export const SKILLS = _data.SKILLS || {}
export const EDUCATION = _data.EDUCATION || []
export const POSTS = _data.POSTS || []
export const SOCIALS = _data.SOCIALS || []
export const TROPHIES = _data.TROPHIES || []
export const INITIAL_NOTIFICATIONS = _data.INITIAL_NOTIFICATIONS || []
