import { useEffect, useState } from 'react'
import Icon from './Icon'

const SECTIONS = [
  { id: 'top',         label: 'Profile' },
  { id: 'playground',  label: 'Play' },
  { id: 'experiences', label: 'Experience' },
  { id: 'projects',    label: 'Projects' },
  { id: 'skills',      label: 'Skills' },
  { id: 'education',   label: 'Education' },
  { id: 'blog',        label: 'Publications' },
]

const SECTION_ICONS = {
  top: 'profile',
  playground: 'gamepad',
  experiences: 'experiences',
  projects: 'projects',
  skills: 'skills',
  education: 'education',
  blog: 'blog',
}

export default function MobileNav() {
  const [active, setActive] = useState(0)
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const probe = window.scrollY + window.innerHeight * 0.35
        let cur = 0
        for (let i = 0; i < SECTIONS.length; i++) {
          const el = document.getElementById(SECTIONS[i].id)
          if (!el) continue
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= probe) cur = i
        }
        setActive(cur)
      })
    }
    const onResize = () => setIsTablet(window.innerWidth <= 1024)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const jump = (id) => {
    if (id === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' })
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="mobile-nav" aria-label="Page sections">
      <div className="mobile-nav-scroll">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`mobile-nav-pill${i === active ? ' active' : ''}`}
            onClick={() => jump(s.id)}
            aria-label={s.label}
          >
            {isTablet ? <Icon id={SECTION_ICONS[s.id]} size={24} /> : s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
