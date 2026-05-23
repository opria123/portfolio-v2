import { Link } from 'react-router-dom'
import Skills from '../components/Skills'
import Icon from '../components/Icon'

export default function SkillsPage() {
  return (
    <div className="container">
      <main className="main-content">
        <Link to="/" className="back-link">
          <Icon id="arrow-right" size={16} className="rotate-180" />
          <span>Back to home</span>
        </Link>
        <Skills />
      </main>
    </div>
  )
}
