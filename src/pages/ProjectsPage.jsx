import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'
import ProjectCard from '../components/ProjectCard'
import Icon from '../components/Icon'

export default function ProjectsPage() {
  return (
    <div className="container projects-list-page">
      <main className="main-content">
        <div className="page-header section-header-unified">
          <Link to="/" className="back-link">
            <Icon id="arrow-right" size={16} className="rotate-180" />
            <span>Back to home</span>
          </Link>
          <h1 className="section-title-unified">All projects</h1>
          <p className="section-subtitle-unified">
            Every project I&apos;ve built — applied ML, developer tools, and open-source.
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </main>
    </div>
  )
}
