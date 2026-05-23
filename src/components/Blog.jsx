import { Link } from 'react-router-dom'
import { POSTS, slugFromUrl } from '../data/portfolio'
import Icon from './Icon'
import { useRef } from 'react'
import SectionHeaderCanvas from './SectionHeaderCanvas'

export default function Publications() {

  if (!POSTS.length) return null
  const headerRef = useRef(null);
  return (
    <section className="publications-section">
      <div className="publications-header section-header-unified" ref={headerRef} style={{position:'relative'}}>
        <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
        <h2 className="section-title-unified" style={{position:'relative',zIndex:1}}>Publications</h2>
        <p className="publications-subtitle section-subtitle-unified" style={{position:'relative',zIndex:1}}>
          Research papers, technical write-ups, and articles I've published.
        </p>
      </div>

      <div className="publications-grid">
        {POSTS.map((post) => {
          const slug = slugFromUrl(post.url)
          const isExternal = post.external || /^https?:\/\//.test(post.url || '')
          const titleLink = isExternal
            ? <a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
            : <Link to={`/posts/${slug}`}>{post.title}</Link>
          const readLink = isExternal
            ? <a href={post.url} target="_blank" rel="noopener noreferrer" className="publications-read-more">Read paper →</a>
            : <Link to={`/posts/${slug}`} className="publications-read-more">Read more →</Link>
          return (
            <article key={post.url} className="publications-card project-card-unified">
              <div className="project-card-unified-header">
                {post.image && (
                  <div className="project-card-unified-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                  </div>
                )}
                <div className="project-card-unified-content">
                  <div className="publications-meta">
                    {post.category && <span className="publications-category">{post.category}</span>}
                    {post.readTime && <span className="publications-read-time">{post.readTime}</span>}
                  </div>
                  <h3 className="project-card-unified-title">{titleLink}</h3>
                  <p className="project-card-unified-subtitle">{post.excerpt}</p>
                  <div className="publications-footer">
                    {post.date && <span className="publications-date">{post.date}</span>}
                    {readLink}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
