import { Link, useParams, Navigate } from 'react-router-dom'
import { PROJECTS, PROJECT_CATEGORIES, slugFromUrl } from '../data/portfolio'
import Icon from '../components/Icon'
import AppIcon from '../components/AppIcon'
import SkillPill from '../components/SkillPill'
import { asset } from '../utils/asset'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = PROJECTS.find((p) => slugFromUrl(p.url) === slug)
  if (!project) return <Navigate to="/projects" replace />

  const category = PROJECT_CATEGORIES.find((c) => c.id === project.category)
  const statusLabel = project.status === 'in-progress' ? 'In Progress' : 'Completed'
  const links = (project.links && project.links.length > 0)
    ? project.links
    : (project.url ? [{ label: 'Visit project', url: project.url }] : [])

  return (
    <div className="container project-detail-page">
      <Link to="/projects" className="back-link">
        <Icon id="arrow-right" size={16} className="rotate-180" />
        <span>Back to projects</span>
      </Link>

      <article className="project-detail">
        <header
          className={`project-detail-hero${project.image ? ' has-image' : ''}`}
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
            <h1 className="project-detail-title">{project.title}</h1>
            {project.subtitle && <p className="project-detail-subtitle">{project.subtitle}</p>}
          </div>
        </header>

        <div className="project-detail-body">
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
      </article>
    </div>
  )
}
