import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';
import { usePdfModal } from './PdfModalContext';
import { PROFILE, SOCIALS } from '../data/portfolio';

export default function LeftDock() {

  const { setShowPdf } = usePdfModal();
  const badgeRef = useRef(null);
  const [atTop, setAtTop] = useState(true);
  const [isToggledOpen, setIsToggledOpen] = useState(false);
  const [rightDockHeight, setRightDockHeight] = useState(50); // fallback default

  // Dynamically sync right dock height
  useEffect(() => {
    function updateDockHeight() {
      const rightDock = document.getElementById('right-dock');
      if (rightDock) {
        const computed = window.getComputedStyle(rightDock);
        const h = parseFloat(computed.height);
        if (!isNaN(h) && h > 0) setRightDockHeight(h);
      }
    }
    updateDockHeight();
    window.addEventListener('resize', updateDockHeight);
    return () => window.removeEventListener('resize', updateDockHeight);
  }, []);

  useEffect(() => {
    let sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.id = 'scroll-sentinel';
      Object.assign(sentinel.style, {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '1px',
        width: '1px',
        pointerEvents: 'none',
        zIndex: '-1000'
      });
      document.body.prepend(sentinel);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const structuralTop = entry.isIntersecting;
        setAtTop(structuralTop);
        if (structuralTop) {
          setIsToggledOpen(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);

    const onScroll = () => {
      if (!window.scrollY && atTop) return;
      if (!atTop && isToggledOpen) {
        setIsToggledOpen(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [atTop, isToggledOpen]);

  const handleHamburgerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggledOpen(true);
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggledOpen(false);
  };

  const isFullyExpanded = atTop || isToggledOpen;
  const showCloseBtn = !atTop && isToggledOpen;

  // --- Smooth Height & Fixed Screen Tracking Engine ---
  const smoothContainerStyle = {
    position: 'fixed',    // CRITICAL: Forces it to move with the screen on scroll
    left: '20px',        // Adjust this layout spacing to match your style
    top: '24px',         // Adjust this layout spacing to match your style
    zIndex: 1000,        // Ensures it stays floating on top of page content
    transition: 'max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    maxHeight: isFullyExpanded ? '300px' : `${rightDockHeight}px`,
    overflow: 'hidden'
  };

  const crossfadeStyle = {
    transition: 'opacity 0.25s ease-in-out',
    width: '100%'
  };

  return (
    <div 
      id="profile-badge" 
      className={`profile-badge ${isFullyExpanded ? 'expanded' : 'collapsed'}`} 
      style={smoothContainerStyle}
      ref={badgeRef}
    >
      {/* 1. HAMBURGER STATE (Always in DOM, fades out smoothly) */}
      <div style={{ 
        ...crossfadeStyle, 
        opacity: isFullyExpanded ? 0 : 1,
        pointerEvents: isFullyExpanded ? 'none' : 'auto',
        position: isFullyExpanded ? 'absolute' : 'relative',
        top: 0, left: 0
      }}>
        <a 
          
          aria-label="Open menu" 
          onClick={handleHamburgerClick} 
          style={{ marginTop: '-5.5px', width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0rem 0', cursor: 'pointer' }} 
        >
          <Icon id="menu" size={45}  onClick={handleHamburgerClick}/>
        </a>
      </div>

      {/* 2. EXPANDED STATE (Always in DOM, slides up/down smoothly) */}
      <div style={{ 
        ...crossfadeStyle, 
        opacity: isFullyExpanded ? 1 : 0,
        pointerEvents: isFullyExpanded ? 'auto' : 'none'
      }}>
        <div className="profile-badge-header" style={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: '200px' }}>
          <Link to="/" className="profile-info" aria-label="Home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <span className="profile-name" style={{ whiteSpace: 'nowrap' }}>
              {PROFILE.firstName}
            </span>
          </Link>
          
          <button 
            className="dock-button close-btn" 
            aria-label="Close menu" 
            onClick={handleCloseClick} 
            style={{ 
              marginLeft: 'auto', 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              opacity: showCloseBtn ? 1 : 0,
              pointerEvents: showCloseBtn ? 'auto' : 'none'
            }} 
          >
            <Icon id="close" size={22} className="dock-icon" />
          </button>
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
            <a href={`mailto:${PROFILE.email}`} className="dock-button primary-btn" title="Email" aria-label="Email">
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
    </div>
  );
}
