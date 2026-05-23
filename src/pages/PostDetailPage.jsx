import { Link, useParams, Navigate } from 'react-router-dom'
import { POSTS, slugFromUrl } from '../data/portfolio'
import Icon from '../components/Icon'

export default function PostDetailPage() {
  const { slug } = useParams()
  const post = POSTS.find((p) => slugFromUrl(p.url) === slug)
  if (!post) return <Navigate to="/posts" replace />

  return (
    <div className="container">
      <Link to="/posts" className="back-link">
        <Icon id="arrow-right" size={16} className="rotate-180" />
        <span>Back to posts</span>
      </Link>

      <article className="post-detail">
        {post.image && (
          <div className="post-detail-image">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <header className="post-detail-header">
          <div className="blog-meta">
            {post.category && <span className="blog-category">{post.category}</span>}
            {post.readTime && <span className="blog-read-time">{post.readTime}</span>}
            {post.date && <span className="blog-date">{post.date}</span>}
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          {post.excerpt && <p className="post-detail-excerpt">{post.excerpt}</p>}
        </header>

        {post.content && (
          <section className="post-detail-body">
            <p>{post.content}</p>
          </section>
        )}

        {post.url && (
          <div className="post-detail-actions">
            <a href={post.url} className="btn-action primary" target="_blank" rel="noreferrer">
              Read full article
              <Icon id="arrow-right" size={18} />
            </a>
          </div>
        )}
      </article>
    </div>
  )
}
