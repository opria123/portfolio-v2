import Icon from './Icon'

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-background" />
      <div className="footer-content">
        <div className="footer-cards">
          <div className="footer-card tech-card">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon"><Icon id="lightning" size={20} /></div>
              <div className="card-text">
                <span className="card-label">Powered by</span>
                <a href="https://react.dev" target="_blank" rel="noreferrer" className="card-link">React + Vite</a>
              </div>
            </div>
          </div>

          <div className="footer-card design-card">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon"><Icon id="star" size={20} /></div>
              <div className="card-text">
                <span className="card-label">Designed by</span>
                <span className="card-designer">Clément GARCIA</span>
              </div>
            </div>
          </div>

          <div className="footer-card theme-card">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon"><Icon id="check" size={20} /></div>
              <div className="card-text">
                <span className="card-label">Theme</span>
                <span className="card-designer">WaveGlass</span>
              </div>
            </div>
          </div>

          <div className="footer-card opensource-card">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon"><Icon id="clock" size={20} /></div>
              <div className="card-text">
                <span className="card-label">Open Source</span>
                <span className="card-designer">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <span className="copyright">© {new Date().getFullYear()} Clément GARCIA</span>
            <span className="location">Full-Stack Developer • France</span>
          </div>
        </div>
      </div>
    </div>
  )
}
