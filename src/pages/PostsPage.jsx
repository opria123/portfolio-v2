import { Link } from 'react-router-dom'
import Blog from '../components/Blog'
import Icon from '../components/Icon'

export default function PostsPage() {
  return (
    <div className="container">
      <main className="main-content">
        <Link to="/" className="back-link">
          <Icon id="arrow-right" size={16} className="rotate-180" />
          <span>Back to home</span>
        </Link>
        <Blog />
      </main>
    </div>
  )
}
