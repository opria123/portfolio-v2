
import { EXPERIENCES, PROJECTS } from '../data/portfolio'
import ProjectCard from './ProjectCard'
import AppIcon from './AppIcon'
import { asset } from '../utils/asset'
import SkillPill from './SkillPill'
import { useRef } from 'react'
import SectionHeaderCanvas from './SectionHeaderCanvas'

// Helper to group experiences by company
function groupByCompany(experiences) {
  const map = new Map();
  for (const exp of experiences) {
    if (!map.has(exp.company)) map.set(exp.company, []);
    map.get(exp.company).push(exp);
  }
  return Array.from(map.entries());
}

// Helper to deduplicate skills
function dedupe(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

function combineSkills(exps) {
  const tech = dedupe(exps.flatMap(e => e.technicalSkills || []));
  const soft = dedupe(exps.flatMap(e => e.softSkills || []));
  // crossSkills: dedupe by label
  const cross = [];
  const seen = new Set();
  for (const e of exps) {
    for (const s of (e.crossSkills || [])) {
      if (!seen.has(s.label)) { cross.push(s); seen.add(s.label); }
    }
  }
  return { tech, soft, cross };
}


export default function Experience() {
  const headerRef = useRef(null);
  // Group experiences by company
  // Sort roles within each company by most recent first, and sort companies by most recent role's end date
  const grouped = groupByCompany(EXPERIENCES)
    .map(([company, roles]) => {
      // Sort roles by most recent start date (handle 'Present' as latest, parse dates)
      // Parse a date string (e.g. 'Mar 2020', 'Present') robustly
      const parseDate = (str, isEnd = false) => {
        if (!str) return new Date(0);
        if (str.toLowerCase().includes('present')) return new Date(3000, 0, 1); // far future for 'Present'
        const months = {
          jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
        };
        const match = str.trim().toLowerCase().match(/([a-z]+)?\s*(\d{4})/);
        if (!match) return new Date(0);
        const [, monthStr, yearStr] = match;
        const year = parseInt(yearStr, 10);
        let m = monthStr ? (months[monthStr] ?? 0) : (isEnd ? 11 : 0); // default to Jan for start, Dec for end
        return new Date(year, m, 1);
      };
      // Sort by end date (desc), then start date (desc)
      const sortedRoles = [...roles].sort((a, b) => {
        // Extract start and end dates for both roles
        const getStart = (r) => {
          if (!r.period) return '';
          const parts = r.period.split('–');
          return (parts[0] || '').trim();
        };
        const getEnd = (r) => {
          if (!r.period) return '';
          const parts = r.period.split('–');
          return (parts[1] || parts[0]).trim();
        };
        const aEnd = parseDate(getEnd(a), true);
        const bEnd = parseDate(getEnd(b), true);
        if (bEnd.getTime() !== aEnd.getTime()) return bEnd - aEnd;
        // If end dates are equal, compare start dates (desc)
        const aStart = parseDate(getStart(a));
        const bStart = parseDate(getStart(b));
        return bStart - aStart;
      });
      return [company, sortedRoles];
    })
    // Sort companies by the most recent role's end date
    .sort((a, b) => {
      const getEnd = (r) => {
        if (!r.period) return '';
        const parts = r.period.split('–');
        return (parts[1] || parts[0]).trim();
      };
      return getEnd(b[1][0]).localeCompare(getEnd(a[1][0]));
    });
  return (
    <section className="experience-section">
      <div className="experience-header section-header-unified" ref={headerRef} style={{position:'relative'}}>
        <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
        <h2 className="section-title-unified" style={{position:'relative',zIndex:1}}>Experience</h2>
        <p className="experience-subtitle section-subtitle-unified" style={{position:'relative',zIndex:1}}>
          Seven years of building production systems — from internship to technical lead to applied AI.
        </p>
      </div>

      <div className="experience-timeline">
        {grouped.map(([company, roles]) => {
          // Use the first role's logo, location, etc.
          const main = roles[0];
          // Combine all skills for this company
          const { tech, soft, cross } = combineSkills(roles);
          // Get overall period (earliest start to latest end)
          const periods = roles.map(r => r.period).filter(Boolean);
          const overallPeriod = periods.length > 1 ? `${periods[periods.length-1].split('–')[0].trim()} – ${periods[0].split('–')[1]?.trim() || periods[0].split('–')[0].trim()}` : periods[0];
          return (
            <div key={company} className="experience-card">
              <div className="experience-header-card">
                <div className="company-info">
                  {main.logo ? (
                    <div className="company-logo">
                      <img src={asset(main.logo)} alt={company} loading="lazy" />
                    </div>
                  ) : null}
                  <div className="company-details">
                    <h4 className="company-name">{company}</h4>
                    <div className="job-meta">
                      <span className="job-period">{overallPeriod}</span>
                    </div>
                    <div className="job-info">
                      <span className="job-location"><AppIcon name="map-pin" size={12} /> {main.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="experience-content">
                {roles.map((exp, idx) => (
                  <div key={exp.id} className="role-section">
                    <h3 className="job-title">{exp.jobTitle}</h3>
                    <div className="job-meta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="job-period">{exp.period}</span>
                      <span className="job-duration">{exp.duration}</span>
                    </div>
                    <div className="job-meta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="job-type">{exp.type}</span>
                    </div>
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
                  </div>
                ))}
                {(tech.length > 0 || cross.length > 0) && (
                  <div className="experience-skills">
                    {tech.length > 0 && <>
                      <h5>Technical Skills:</h5>
                      <div className="skills-tags">
                        {tech.map((s) => (
                          <SkillPill key={s} name={s} />
                        ))}
                      </div>
                    </>}
                    {cross.length > 0 && <>
                      <h5>Cross-functional skills:</h5>
                      <div className="skills-tags">
                        {cross.map((s) => (
                          <SkillPill key={s.label} name={s.label} icon={s.icon} />
                        ))}
                      </div>
                    </>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
