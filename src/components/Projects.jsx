import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'
import ProjectCard from './ProjectCard'
import Icon from './Icon'
import { useRef } from 'react'
import SectionHeaderCanvas from './SectionHeaderCanvas'

export default function Projects() {
  const headerRef = useRef(null);
  return (
    <section className="projects-section">
      <div className="projects-header section-header-unified" ref={headerRef} style={{position:'relative'}}>
        <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
        <h2 className="section-title-unified" style={{position:'relative',zIndex:1}}>Projects</h2>
        <p className="projects-subtitle section-subtitle-unified" style={{position:'relative',zIndex:1}}>
          A few things I&apos;ve built end-to-end  applied ML, developer tools, and open-source.
        </p>
      </div>

      <div className="projects-grid">
        {PROJECTS.filter((p) => !p.hideFromHome).map((p) => (
          <div key={p.title} className="project-card-wrapper" data-category={p.category}>
            <ProjectCard {...p} />
          </div>
        ))}
      </div>

      <div className="projects-see-all">
        <Link to="/projects" className="btn-action">
          <span>See all projects</span>
          <Icon id="arrow-right" size={18} />
        </Link>
      </div>
    </section>
  )
}
