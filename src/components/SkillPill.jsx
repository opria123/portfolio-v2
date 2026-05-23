import AppIcon from './AppIcon'
import { useSkillModal } from './SkillModal'
import { findSkill, skillColor } from '../utils/skillColor'

export default function SkillPill({ name, icon }) {
  const { openSkillModal } = useSkillModal()
  const matched = findSkill(name)
  const color = skillColor(name)
  const style = {
    '--pill-color': color,
    color, // Use mapped color for text (original logic)
    borderColor: color + '88',
    background: color + '1a',
    textShadow: '0 1px 4px rgba(0,0,0,0.10)', // Lighter shadow for subtle readability
  }
  return (
    <button
      type="button"
      className={`skill-tag skill-tag-pill${matched ? '' : ' skill-tag-static'}`}
      style={style}
      onClick={() => matched && openSkillModal(matched)}
      disabled={!matched}
      title={matched ? `View where ${name} was used` : name}
    >
      {icon ? <AppIcon name={icon} size={14} /> : null}
      <span>{name}</span>
    </button>
  )
}
