import { EDUCATION } from '../data/portfolio'
import AppIcon from './AppIcon'
import { asset } from '../utils/asset'
import SkillPill from './SkillPill'
import { useRef } from 'react'
import SectionHeaderCanvas from './SectionHeaderCanvas'

export default function Education() {

  const headerRef = useRef(null);
  return (
    <section className="education-section">
      <div className="education-header section-header-unified" ref={headerRef} style={{position:'relative'}}>
        <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
        <h2 className="section-title-unified" style={{position:'relative',zIndex:1}}>Education & Certifications</h2>
        <p className="education-subtitle section-subtitle-unified" style={{position:'relative',zIndex:1}}>
          My academic and professional journey, building the foundation of my technical expertise
        </p>
      </div>

      <div className="tabs" role="tablist">
        <button className="tab-btn active">
          <AppIcon name="graduation-cap" size={16} className="icon" />
          <span className="tab-label">Education</span>
        </button>
      </div>

      <div className="timeline-container" data-tab="education">
        <div className="timeline-line" />

        {EDUCATION.map((edu, i) => {
          const cardRef = useRef(null);
          return (
          <div key={i} className="timeline-item education-item" ref={cardRef}>
            <div className="timeline-marker" style={{ backgroundColor: edu.color }}>
              {edu.logo ? (
                <img src={asset(edu.logo)} alt={edu.institution} className="timeline-school-logo" loading="lazy" />
              ) : (
                <AppIcon name="graduation-cap" size={20} className="timeline-icon" />
              )}
            </div>

            <div className="timeline-content">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="timeline-period">{edu.period}</div>
                  <div className={`timeline-status status-${edu.statusClass}`}>{edu.status}</div>
                </div>

                <h3 className="timeline-title">{edu.title}</h3>
                <h4 className="timeline-institution">
                  {edu.institution}{edu.city ? ` - ${edu.city}` : ''}
                </h4>

                <p className="timeline-description">{edu.description}</p>

                <div className="timeline-details">
                  {edu.technicalSkills?.length > 0 && (
                    <div className="timeline-skills" style={{position:'relative'}}>
                      <strong style={{position:'relative',zIndex:1}}>Technical skills:</strong>
                      <div className="skills-tags" style={{position:'relative',zIndex:1}}>
                        {edu.technicalSkills.map((s) => (
                          <SkillPill key={s} name={s} />
                        ))}
                      </div>
                    </div>
                  )}

                  {edu.crossSkills?.length > 0 && (
                    <div className="timeline-skills" style={{position:'relative'}}>
                      <strong style={{position:'relative',zIndex:1}}>Cross-functional skills:</strong>
                      <div className="skills-tags" style={{position:'relative',zIndex:1}}>
                        {edu.crossSkills.map((s) => (
                          <SkillPill key={s.label} name={s.label} icon={s.icon} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </section>
  )
}
