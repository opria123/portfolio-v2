import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS, EXPERIENCES, EDUCATION, slugFromUrl } from '../data/portfolio'
import AppIcon from './AppIcon'
import { asset } from '../utils/asset'

const SkillModalContext = createContext(null)

export function useSkillModal() {
  const ctx = useContext(SkillModalContext)
  if (!ctx) throw new Error('useSkillModal must be used inside <SkillModalProvider>')
  return ctx
}

export function SkillModalProvider({ children }) {
  const [skill, setSkill] = useState(null)

  const openSkillModal = useCallback((s) => setSkill(s), [])
  const closeSkillModal = useCallback(() => setSkill(null), [])

  const value = useMemo(() => ({ openSkillModal, closeSkillModal }), [openSkillModal, closeSkillModal])

  return (
    <SkillModalContext.Provider value={value}>
      {children}
      <SkillModal skill={skill} onClose={closeSkillModal} />
    </SkillModalContext.Provider>
  )
}

const TABS = [
  { id: 'projects', label: 'Projects', icon: 'briefcase' },
  { id: 'experiences', label: 'Experiences', icon: 'building-2' },
  { id: 'educations', label: 'Educations', icon: 'graduation-cap' },
]

const eq = (a, b) => a && b && a.toString().toLowerCase() === b.toString().toLowerCase()
const matchSkill = (lists, key) => {
  for (const list of lists) {
    if (!list) continue
    for (const item of list) {
      const label = typeof item === 'string' ? item : item?.label
      if (label && eq(label, key)) return true
    }
  }
  return false
}

function SkillModal({ skill, onClose }) {
  const [tab, setTab] = useState('projects')

  useEffect(() => {
    if (!skill) return
    const key = skill.key
    const has = {
      projects: PROJECTS.some((p) => matchSkill([p.technologies, p.softSkills, p.crossSkills], key)),
      experiences: EXPERIENCES.some((e) => matchSkill([e.technicalSkills, e.softSkills, e.crossSkills], key)),
      educations: EDUCATION.some((ed) => matchSkill([ed.technicalSkills, ed.softSkills, ed.crossSkills], key)),
    }
    const firstWith = TABS.find((t) => has[t.id])
    setTab(firstWith ? firstWith.id : 'projects')
  }, [skill])

  useEffect(() => {
    if (!skill) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [skill, onClose])

  const data = useMemo(() => {
    if (!skill) return { projects: [], experiences: [], educations: [] }
    const key = skill.key
    return {
      projects: PROJECTS.filter((p) => matchSkill([p.technologies, p.softSkills, p.crossSkills], key)),
      experiences: EXPERIENCES.filter((e) => matchSkill([e.technicalSkills, e.softSkills, e.crossSkills], key)),
      educations: EDUCATION.filter((ed) => matchSkill([ed.technicalSkills, ed.softSkills, ed.crossSkills], key)),
    }
  }, [skill])

  if (!skill) return null

  const isImg = skill.icon?.startsWith('http')
  const counts = {
    projects: data.projects.length,
    experiences: data.experiences.length,
    educations: data.educations.length,
  }

  return (
    <div className="skill-modal-root" role="dialog" aria-modal="true" aria-labelledby="skill-modal-title">
      <div className="skill-modal-backdrop" onClick={onClose} />
      <div className="skill-modal-panel">
        <button type="button" className="skill-modal-close" onClick={onClose} aria-label="Close">×</button>

        <header className="skill-modal-header">
          <div className="skill-modal-icon">
            {isImg ? <img src={skill.icon} alt={skill.key} /> : <AppIcon name={skill.icon} size={32} />}
          </div>
          <div className="skill-modal-title-block">
            <h2 id="skill-modal-title">{skill.key}</h2>
            <div className="skill-modal-chips">
              {skill.experience && <span className="skill-modal-chip">{skill.experience}</span>}
              {skill.description && <span className="skill-modal-chip secondary">{skill.description}</span>}
            </div>
          </div>
        </header>

        <nav className="skill-modal-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`skill-modal-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <AppIcon name={t.icon} size={16} className="icon" />
              <span>{t.label}</span>
              <span className="count">{counts[t.id]}</span>
            </button>
          ))}
        </nav>

        <div className="skill-modal-body">
          {tab === 'projects' && <ProjectsList items={data.projects} onNavigate={onClose} />}
          {tab === 'experiences' && <ExperiencesList items={data.experiences} />}
          {tab === 'educations' && <EducationsList items={data.educations} />}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ children }) {
  return <div className="skill-modal-empty">{children}</div>
}

function ProjectsList({ items, onNavigate }) {
  if (!items.length) return <EmptyState>No projects use this skill yet.</EmptyState>
  return (
    <div className="skill-modal-grid">
      {items.map((p) => {
        const slug = slugFromUrl(p.url)
        return (
          <Link
            key={p.title}
            to={slug ? `/projects/${slug}` : '/projects'}
            className="skill-modal-card"
            onClick={onNavigate}
          >
            {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
            <div className="skill-modal-card-body">
              <h4>{p.title}</h4>
              {p.subtitle && <p>{p.subtitle}</p>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function ExperiencesList({ items }) {
  if (!items.length) return <EmptyState>No experiences use this skill yet.</EmptyState>
  return (
    <ul className="skill-modal-list">
      {items.map((e) => (
        <li key={e.id} className="skill-modal-list-item">
          {e.logo && <img src={asset(e.logo)} alt={e.company} loading="lazy" />}
          <div>
            <h4>{e.jobTitle}</h4>
            <p className="muted">{e.company} · {e.period}</p>
            {e.description && <p>{e.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

function EducationsList({ items }) {
  if (!items.length) return <EmptyState>No education uses this skill yet.</EmptyState>
  return (
    <ul className="skill-modal-list">
      {items.map((ed) => (
        <li key={ed.title} className="skill-modal-list-item">
          {ed.logo && <img src={asset(ed.logo)} alt={ed.institution} loading="lazy" />}
          <div>
            <h4>{ed.title}</h4>
            <p className="muted">{ed.institution} · {ed.period}</p>
            {ed.description && <p>{ed.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
