import { Link } from 'react-router-dom'
import Experience from '../components/Experience'
import Icon from '../components/Icon'

export default function ExperiencesPage() {
  return (
    <div className="container">
      <main className="main-content">
        <Link to="/" className="back-link">
          <Icon id="arrow-right" size={16} className="rotate-180" />
          <span>Back to home</span>
        </Link>
        <Experience />
      </main>
    </div>
  )
}
