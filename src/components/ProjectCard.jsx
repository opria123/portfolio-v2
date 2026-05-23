import { slugFromUrl } from '../data/portfolio'
import { asset } from '../utils/asset'
import { useProjectModal } from './ProjectModal'

export default function ProjectCard(project) {
  const { title, subtitle, description, image, imageFit, url, technologies = [], status, maxTechnologies = 4 } = project
  const visibleTech = technologies.slice(0, maxTechnologies)
  const extra = technologies.length - maxTechnologies
  const slug = slugFromUrl(url)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const detailHref = slug ? `${base}/projects/${slug}` : `${base}/projects`
  const { openProjectModal } = useProjectModal()

  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    openProjectModal(project)
  }

  return (
    <a href={detailHref} onClick={handleClick} className="project-card-unified">
      <div className="project-card-unified-header">
        {image && (
          <div className={`project-card-unified-image${imageFit === 'contain' ? ' fit-contain' : ''}`}>
            <img src={asset(image)} alt={title} loading="lazy" />
          </div>
        )}

        <div className="project-card-unified-content">
          <h3 className="project-card-unified-title">{title}</h3>
          {subtitle && <p className="project-card-unified-subtitle">{subtitle}</p>}
        </div>

        <div className="project-card-unified-detailed-info">
          <div>
            <h3 className="project-card-unified-title">{title}</h3>
            {description && <p className="project-card-unified-detailed-description">{description}</p>}
            {technologies.length > 0 && (
              <div className="project-card-unified-technologies">
                {visibleTech.map((t) => (
                  <span key={t} className="project-card-unified-tech-item">{t}</span>
                ))}
                {extra > 0 && <span className="project-card-unified-tech-item">+{extra}</span>}
              </div>
            )}
            {status && (
              <div className="project-card-unified-meta">
                <span className={`project-card-unified-status status-${status}`}>
                  {status === 'in-progress' ? 'In progress' : 'Completed'}
                </span>
              </div>
            )}
          </div>
          <span className="btn-action">
            See project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  )
}
