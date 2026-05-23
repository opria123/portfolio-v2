import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TROPHIES } from '../data/portfolio'
import { useNotifications } from './NotificationsProvider'
import AppIcon from './AppIcon'

const KEY = 'portfolio.trophies.unlocked.v2'
const FIRST_VISIT_KEY = 'portfolio.trophies.firstVisit'
const PROJECTS_KEY = 'portfolio.trophies.visitedProjects'
const SOCIALS_KEY = 'portfolio.trophies.visitedSocials'
const SECTIONS_KEY = 'portfolio.trophies.visitedSections'

const SECTION_IDS = ['portfolio_explorer', 'experience_reader', 'skills_explorer', 'education_buff', 'blog_reader']

const TrophiesContext = createContext(null)

export function useTrophies() {
  const ctx = useContext(TrophiesContext)
  if (!ctx) throw new Error('useTrophies must be used inside <TrophiesProvider>')
  return ctx
}

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set()
}
function saveSet(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])) } catch {}
}

export function TrophiesProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => loadSet(KEY))
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const { push: pushNotification, notifications } = useNotifications()

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      saveSet(KEY, next)
      return next
    })
  }, [])

  // Side effects (toast + notification) run once per actual unlock,
  // outside of the setState updater (which StrictMode invokes twice).
  const prevUnlockedRef = useRef(unlocked)
  useEffect(() => {
    const prev = prevUnlockedRef.current
    for (const id of unlocked) {
      if (prev.has(id)) continue
      const trophy = TROPHIES.find((t) => t.id === id)
      if (!trophy) continue
      setToast({ ...trophy, ts: Date.now() })
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 4500)
      pushNotification({
        id: `trophy-${id}`,
        title: 'Trophy Unlocked!',
        message: trophy.name,
        icon: trophy.icon,
        time: 'just now',
        type: 'trophy',
      })
    }
    prevUnlockedRef.current = unlocked
  }, [unlocked, pushNotification])

  const trophies = useMemo(
    () => TROPHIES.map((t) => ({ ...t, unlocked: unlocked.has(t.id) })),
    [unlocked]
  )

  useEffect(() => {
    const others = TROPHIES.filter((t) => t.id !== 'master_explorer')
    if (others.every((t) => unlocked.has(t.id)) && !unlocked.has('master_explorer')) {
      unlock('master_explorer')
    }
  }, [unlocked, unlock])

  const value = useMemo(
    () => ({ unlocked, unlock, trophies, toast, dismissToast: () => setToast(null) }),
    [unlocked, unlock, trophies, toast]
  )

  return (
    <TrophiesContext.Provider value={value}>
      {children}
      <TrophyTracker unlock={unlock} />
      <TrophyToast toast={toast} onClose={() => setToast(null)} />
    </TrophiesContext.Provider>
  )
}

const ROUTE_MAP = {
  '/projects': 'portfolio_explorer',
  '/experiences': 'experience_reader',
  '/skills': 'skills_explorer',
  '/educations': 'education_buff',
  '/posts': 'blog_reader',
}

const SECTION_MAP = [
  { sel: '.projects-section', id: 'portfolio_explorer' },
  { sel: '.experience-section', id: 'experience_reader' },
  { sel: '.skills-section', id: 'skills_explorer' },
  { sel: '.education-section', id: 'education_buff' },
  { sel: '.blog-section', id: 'blog_reader' },
]

function TrophyTracker({ unlock }) {
  const { pathname } = useLocation()

  useEffect(() => { unlock('welcome') }, [unlock])

  useEffect(() => {
    if (!localStorage.getItem(FIRST_VISIT_KEY)) {
      localStorage.setItem(FIRST_VISIT_KEY, String(Date.now()))
    }
  }, [])

  useEffect(() => {
    const visited = loadSet(SECTIONS_KEY)
    let mutated = false
    for (const prefix of Object.keys(ROUTE_MAP)) {
      if (pathname.startsWith(prefix)) {
        unlock(ROUTE_MAP[prefix])
        if (!visited.has(ROUTE_MAP[prefix])) {
          visited.add(ROUTE_MAP[prefix])
          mutated = true
        }
      }
    }
    if (mutated) {
      saveSet(SECTIONS_KEY, visited)
      if (SECTION_IDS.every((id) => visited.has(id))) unlock('completionist')
    }

    const slugMatch = pathname.match(/^\/projects\/([^/]+)/)
    if (slugMatch) {
      const projects = loadSet(PROJECTS_KEY)
      if (!projects.has(slugMatch[1])) {
        projects.add(slugMatch[1])
        saveSet(PROJECTS_KEY, projects)
      }
      if (projects.size >= 3) unlock('project_enthusiast')
    }

    if (/^\/posts\/[^/]+/.test(pathname)) unlock('blog_reader')
  }, [pathname, unlock])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const reached = window.innerHeight + window.scrollY >= doc.scrollHeight - 80
      if (reached) {
        unlock('scroll_master')
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [unlock])

  useEffect(() => {
    const start = Number(localStorage.getItem(FIRST_VISIT_KEY)) || Date.now()
    const elapsed = Date.now() - start
    const remaining = 5 * 60 * 1000 - elapsed
    if (remaining <= 0) {
      unlock('time_keeper')
      return
    }
    const t = setTimeout(() => unlock('time_keeper'), remaining)
    return () => clearTimeout(t)
  }, [unlock])

  useEffect(() => {
    const observers = []
    const visited = loadSet(SECTIONS_KEY)
    const setup = () => {
      for (const { sel, id } of SECTION_MAP) {
        document.querySelectorAll(sel).forEach((el) => {
          const obs = new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (e.isIntersecting) {
                  unlock(id)
                  if (SECTION_IDS.includes(id) && !visited.has(id)) {
                    visited.add(id)
                    saveSet(SECTIONS_KEY, visited)
                    if (SECTION_IDS.every((sid) => visited.has(sid))) unlock('completionist')
                  }
                  obs.disconnect()
                }
              }
            },
            { threshold: 0.25 }
          )
          obs.observe(el)
          observers.push(obs)
        })
      }
    }
    const t = setTimeout(setup, 300)
    return () => {
      clearTimeout(t)
      observers.forEach((o) => o.disconnect())
    }
  }, [pathname, unlock])

  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (href.startsWith('mailto:')) unlock('contact_me')
      if (a.classList.contains('download-btn') || /\.pdf|cv|resume/i.test(href)) unlock('cv_downloader')
      const socialId = a.dataset.social || (
        /linkedin\.com/i.test(href) ? 'linkedin'
        : /github\.com/i.test(href) ? 'github'
        : /discord\.com|discord\.gg/i.test(href) ? 'discord'
        : /artstation\.com/i.test(href) ? 'artstation'
        : /twitter\.com|x\.com/i.test(href) ? 'twitter'
        : null
      )
      if (socialId) {
        const socials = loadSet(SOCIALS_KEY)
        if (!socials.has(socialId)) {
          socials.add(socialId)
          saveSet(SOCIALS_KEY, socials)
        }
        if (socials.size >= 2) unlock('social_networker')
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [unlock])

  return null
}

function TrophyToast({ toast, onClose }) {
  if (!toast) return null
  return (
    <div className="trophy-toast" role="status" aria-live="polite">
      <div className={`trophy-toast-card rarity-${toast.rarity || 'common'}`}>
        <div className="trophy-toast-icon"><AppIcon name={toast.icon} size={24} /></div>
        <div className="trophy-toast-body">
          <div className="trophy-toast-title">Trophy Unlocked!</div>
          <div className="trophy-toast-name">{toast.name}</div>
          <div className="trophy-toast-desc">{toast.description}</div>
        </div>
        <button
          type="button"
          className="trophy-toast-close"
          onClick={onClose}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
