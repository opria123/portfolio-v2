import { Link } from 'react-router-dom';
import { PROFILE, SOCIALS } from '../data/portfolio';
import Icon from './Icon';
import { usePdfModal } from './PdfModalContext';

export default function LeftDock() {
  const { setShowPdf } = usePdfModal();
  return (
    <div id="profile-badge" className="profile-badge">
      <div className="profile-badge-header">
        <Link to="/" className="profile-info" aria-label="Home">
          <span className="profile-name">{PROFILE.firstName}</span>
        </Link>
      </div>

      <div className="profile-badge-primary-actions">
        <div className="profile-actions-separator" />
        <div className="profile-actions-group">
          <button
            type="button"
            className="dock-button primary-btn download-btn"
            title="Download Resume"
            aria-label="Download Resume"
            onClick={() => setShowPdf(true)}
          >
            <Icon id="document-download" size={22} className="dock-icon" />
          </button>
          <a
            href={`mailto:${PROFILE.email}`}
            className="dock-button primary-btn"
            title="Email"
            aria-label="Email"
          >
            <Icon id="email" size={22} className="dock-icon" />
          </a>
        </div>
      </div>

      <div className="profile-badge-social-actions">
        <div className="profile-actions-separator" />
        <div className="profile-actions-group social-group">
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target={s.external ? '_blank' : undefined}
              rel={s.external ? 'noopener noreferrer' : undefined}
              className="dock-button social-btn"
              title={s.title}
              aria-label={s.title}
              data-social={s.id}
            >
              <Icon id={s.icon} size={22} className="dock-icon" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
