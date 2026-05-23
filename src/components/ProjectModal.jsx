import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PROJECT_CATEGORIES } from '../data/portfolio'
import AppIcon from './AppIcon'
import Icon from './Icon'
import SkillPill from './SkillPill'
import { asset } from '../utils/asset'

const ProjectModalContext = createContext(null)

export function useProjectModal() {
  const ctx = useContext(ProjectModalContext)
  if (!ctx) throw new Error('useProjectModal must be used inside <ProjectModalProvider>')
  return ctx
}

export function ProjectModalProvider({ children }) {
  const [project, setProject] = useState(null)

  const openProjectModal = useCallback((p) => setProject(p), [])
  const closeProjectModal = useCallback(() => setProject(null), [])

  const value = useMemo(
    () => ({ openProjectModal, closeProjectModal }),
    [openProjectModal, closeProjectModal],
  )

  return (
    <ProjectModalContext.Provider value={value}>
      {children}
      <ProjectModal project={project} onClose={closeProjectModal} />
    </ProjectModalContext.Provider>
  )
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  if (!project) return null

  const category = PROJECT_CATEGORIES.find((c) => c.id === project.category)
  const statusLabel = project.status === 'in-progress' ? 'In Progress' : 'Completed'
  const links = (project.links && project.links.length > 0)
    ? project.links
    : (project.url ? [{ label: 'Visit project', url: project.url }] : [])

  return (
    <div className="skill-modal-root project-modal-root" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div className="skill-modal-backdrop" onClick={onClose} />
      <div className="skill-modal-panel project-modal-panel">
        <button type="button" className="skill-modal-close" onClick={onClose} aria-label="Close">×</button>

        <header
          className={`project-detail-hero${project.image ? ' has-image' : ''}${project.imageFit === 'contain' ? ' contain-image' : ''}`}
          style={project.image ? { backgroundImage: `url(${asset(project.image)})` } : undefined}
        >
          <div className="project-detail-hero-overlay" />
          <div className="project-detail-hero-content">
            <div className="project-detail-hero-badges">
              {category && (
                <span className="project-detail-category">
                  <AppIcon name={category.icon} size={14} className="icon" />
                  <span>{category.label}</span>
                </span>
              )}
              {project.status && (
                <span className={`project-detail-status status-${project.status}`}>
                  <span className="dot" /> {statusLabel}
                </span>
              )}
            </div>
            <h1 id="project-modal-title" className="project-detail-title">{project.title}</h1>
            {project.subtitle && <p className="project-detail-subtitle">{project.subtitle}</p>}
          </div>
        </header>

        <div className="project-detail-body project-modal-body">
          {project.description && (
            <section className="project-detail-section">
              <h2>About</h2>
              <p>{project.description}</p>
            </section>
          )}

          {project.technologies?.length > 0 && (
            <section className="project-detail-section">
              <h2>Tech stack</h2>
              <div className="project-detail-tech-list">
                {project.technologies.map((t) => (
                  <SkillPill key={t} name={t} />
                ))}
              </div>
            </section>
          )}

          {project.softSkills?.length > 0 && (
            <section className="project-detail-section">
              <h2>Soft skills</h2>
              <div className="project-detail-tech-list">
                {project.softSkills.map((t) => (
                  <SkillPill key={t} name={t} />
                ))}
              </div>
            </section>
          )}

          {links.length > 0 && (
            <section className="project-detail-section">
              <h2>Links</h2>
              <div className="project-detail-actions">
                {links.map((l, i) => (
                  <a
                    key={l.url}
                    href={l.url}
                    className={`btn-action ${i === 0 ? 'primary' : ''}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label}
                    <Icon id="arrow-right" size={16} />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
