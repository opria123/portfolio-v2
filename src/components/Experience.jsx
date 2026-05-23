import { EXPERIENCES, PROJECTS } from '../data/portfolio'
import ProjectCard from './ProjectCard'
import AppIcon from './AppIcon'
import { asset } from '../utils/asset'
import SkillPill from './SkillPill'
import { useRef } from 'react'
import SectionHeaderCanvas from './SectionHeaderCanvas'

export default function Experience() {

  const headerRef = useRef(null);
  return (
    <section className="experience-section">
      <div className="experience-header section-header-unified" ref={headerRef} style={{position:'relative'}}>
        <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
        <h2 className="section-title-unified" style={{position:'relative',zIndex:1}}>Experience</h2>
        <p className="experience-subtitle section-subtitle-unified" style={{position:'relative',zIndex:1}}>
          Seven years of building production systems  from internship to technical lead to applied AI.
        </p>
      </div>

      <div className="experience-timeline">
        {EXPERIENCES.map((exp) => (
          <div key={exp.id} className={`experience-card ${exp.status === 'current' ? 'current' : ''}`}>
            <div className="experience-header-card">
              <div className="company-info">
                {exp.logo ? (
                  <div className="company-logo">
                    <img src={asset(exp.logo)} alt={exp.company} loading="lazy" />
                  </div>
                ) : null}
                <div className="company-details">
                  <h3 className="job-title">{exp.jobTitle}</h3>
                  <h4 className="company-name">{exp.company}</h4>
                  <div className="job-meta">
                    <span className="job-period">{exp.period}</span>
                    <span className="job-duration">{exp.duration}</span>
                  </div>
                  <div className="job-info">
                    <span className="job-type">{exp.type}</span>
                    <span className="job-location"><AppIcon name="map-pin" size={12} /> {exp.location}</span>
                  </div>
                </div>
              </div>
              {exp.status === 'current' ? (
                <div className="current-badge">Current</div>
              ) : (
                <div className="completed-badge">Past role</div>
              )}
            </div>

            <div className="experience-content">
              <p className="experience-description">{exp.description}</p>

              {exp.bullets?.length > 0 && (
                <ul className="experience-bullets">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}

              {exp.projects?.length > 0 && (
                <div className="projects-section">
                  <div className="projects-header">
                    <h5>Main projects:</h5>
                  </div>
                  <div className="projects-container projects-container-horizontal">
                    {exp.projects.map((slug) => {
                      const proj = PROJECTS.find((p) =>
                        p.url?.includes(`/${slug}/`) || p.title.toLowerCase().includes(slug.replace(/-/g, ' '))
                      )
                      if (!proj) return null
                      return <ProjectCard key={slug} {...proj} />
                    })}
                  </div>
                </div>
              )}

              <div className="experience-skills">
                <h5>Technical Skills:</h5>
                <div className="skills-tags">
                  {exp.technicalSkills.map((s) => (
                    <SkillPill key={s} name={s} />
                  ))}
                </div>
              </div>

              {exp.crossSkills?.length > 0 && (
                <div className="experience-skills">
                  <h5>Cross-functional skills:</h5>
                  <div className="skills-tags">
                    {exp.crossSkills.map((s) => (
                      <SkillPill key={s.label} name={s.label} icon={s.icon} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
