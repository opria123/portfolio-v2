
import { useRef } from 'react';
import { SKILLS } from '../data/portfolio'
import AppIcon from './AppIcon'
import { useSkillModal } from './SkillModal'
import SectionHeaderCanvas from './SectionHeaderCanvas';

function SkillBlock({ skill }) {
  const { openSkillModal } = useSkillModal()
  const isImg = skill.icon?.startsWith('http')
  return (
    <button
      type="button"
      className="skill-block clickable"
      onClick={() => openSkillModal(skill)}
    >
      <div className="skill-icon">
        {isImg ? <img src={skill.icon} alt={skill.key} loading="lazy" /> : <AppIcon name={skill.icon} size={28} className="skill-lucide" />}
      </div>
      <div className="skill-info">
        <div className="skill-name">{skill.key}</div>
      </div>
    </button>
  )
}

export default function Skills() {
  const headerRef = useRef(null);
  return (
    <section id="competences" className="skills-section">
      <div className="skills-header section-header-unified" ref={headerRef} style={{ position: 'relative' }}>
        <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
        <h2 className="section-title-unified" style={{ position: 'relative', zIndex: 1 }}>Technical Skills</h2>
        <p className="skills-subtitle section-subtitle-unified" style={{ position: 'relative', zIndex: 1 }}>
          Mastering modern technologies to build great user experiences and robust solutions.
        </p>
      </div>

      <div className="skills-categories-grid">
        <div className="skills-category">
          <h4>Programming languages</h4>
          <div className="skills-grid">
            {SKILLS.programmingLanguages.map((s) => (
              <SkillBlock key={s.key} skill={s} />
            ))}
          </div>
        </div>

        <div className="skills-category">
          <h4>Frameworks & Engines</h4>
          <div className="skills-grid">
            {SKILLS.frameworksEngines.map((s) => (
              <SkillBlock key={s.key} skill={s} />
            ))}
          </div>
        </div>

        <div className="skills-category">
          <h4>Specialties</h4>
          <div className="skills-grid">
            {SKILLS.specialties.map((s) => (
              <SkillBlock key={s.key} skill={s} />
            ))}
          </div>
        </div>

        <div className="skills-category">
          <h4>Soft Skills</h4>
          <div className="skills-grid">
            {SKILLS.softSkills.map((s) => (
              <SkillBlock key={s.key} skill={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
