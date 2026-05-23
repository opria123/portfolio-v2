import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PROFILE } from '../data/portfolio'
import { usePdfModal } from './PdfModalContext';
import Icon from './Icon'

function useTypewriterRotation(words, { typeMs = 75, deleteMs = 40, holdMs = 1600 } = {}) {
  const [text, setText] = React.useState('');
  const [i, setI] = React.useState(0);
  const [phase, setPhase] = React.useState('typing'); // typing | holding | deleting

  React.useEffect(() => {
    if (!words || words.length === 0) return undefined;
    const current = words[i % words.length];
    let t;
    if (phase === 'typing') {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeMs);
      } else {
        t = setTimeout(() => setPhase('deleting'), holdMs);
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteMs);
      } else {
        setI((n) => n + 1);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, i, words, typeMs, deleteMs, holdMs]);

  return text;
}

import { ensureModalRoot } from '../utils/modalRoot';

export default function Profile() {
  const p = PROFILE;
  const rotations = p.titleRotations && p.titleRotations.length ? p.titleRotations : null;
  const typed = useTypewriterRotation(rotations || [], { typeMs: 70, deleteMs: 35, holdMs: 1800 });
  const pdfUrl = p.cvUrl && (p.cvUrl.startsWith('http') ? p.cvUrl : `/${p.cvUrl.replace(/^\//, '')}`);
  const { showPdf, setShowPdf } = usePdfModal();
  // Ensure modal root exists
  ensureModalRoot();
  useEffect(() => {
    if (showPdf) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPdf]);
  return (
    <section id="profil" className="profile-section hero-centered">
      <div className="hero-main">
        <div className="hero-content">
          <p className="hero-greeting">
            {p.greeting} <span className="hero-name">{p.firstName}</span>
          </p>
          <h1 className="hero-title">
            {rotations ? (
              <span className="hero-action-typed-block">
                <span
                  className="hero-action-spacer-block"
                  aria-hidden="true"
                >
                  {rotations.reduce((a, b) => (a.length >= b.length ? a : b))}
                </span>
                {/* Calculate minWidth in px for accurate centering */}
                {(() => {
                  let minWidth = undefined;
                  if (typeof window !== 'undefined' && rotations) {
                    const ctx = document.createElement('canvas').getContext('2d');
                    if (ctx) {
                      // Match the font used in the hero title
                      ctx.font = '700 3.5rem inherit';
                      const longest = rotations.reduce((a, b) => (a.length >= b.length ? a : b));
                      minWidth = ctx.measureText(longest).width + 'px';
                    }
                  }
                  // Fallback to ch units for SSR
                  if (!minWidth) {
                    minWidth = `${rotations.reduce((a, b) => (a.length >= b.length ? a : b)).length}ch`;
                  }
                  return (
                    <span
                      className="hero-action-visible-block"
                      style={{
                        display: 'inline-block',
                        minWidth,
                        textAlign: 'center',
                      }}
                    >
                      <span className="hero-typewriter-text">
                        {typed}
                        <span className="hero-typewriter-cursor" aria-hidden="true" />
                      </span>
                    </span>
                  );
                })()}
              </span>
            ) : (
              p.titleWords.map((w, i) => (
                <span key={i} className="hero-action">{w}</span>
              ))
            )}
          </h1>

          <p className="hero-description">{p.description}</p>

          <div className="hero-actions">
            <a href={`mailto:${p.email}`} className="btn-action">
              <Icon id="email" size={18} />
              Contact
            </a>
            <button
              className="btn-action primary"
              type="button"
              onClick={() => setShowPdf(true)}
            >
              <Icon id="download" size={18} />
              Download Resume
            </button>
          </div>
          <button
            type="button"
            className="hero-bottom"
            onClick={() => {
              const target = document.getElementById('playground');
              if (target) {
                const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            aria-label="Scroll to content"
          >
            <div className="hero-scroll-indicator">
              <Icon id="arrow-down" size={48} />
            </div>
          </button>
        </div>
      </div>
      {/* PDF Modal using project modal structure, rendered via portal */}
      {showPdf && typeof window !== 'undefined' && createPortal(
        <div className="pdf-modal-root" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">
          <div className="pdf-modal-backdrop" onClick={() => setShowPdf(false)} />
          <div className="pdf-modal-panel">
            <header className="pdf-modal-header">
              <div className="pdf-modal-title-block" style={{ flex: 1 }}>
                <h2 id="pdf-modal-title">Resume PDF Preview</h2>
              </div>
              <button type="button" className="pdf-modal-close" onClick={() => setShowPdf(false)} aria-label="Close PDF preview">×</button>
            </header>
            <div className="pdf-modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: 320, padding: 0 }}>
              <iframe
                src={pdfUrl}
                title="Resume PDF Preview"
                width="100%"
                height="600px"
                style={{ border: 'none', background: '#222', flex: 1 }}
                allow="autoplay"
              />
              <a
                href={pdfUrl}
                download
                className="btn-action primary pdf-modal-download"
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: 24, marginTop: 0 }}
              >
                <Icon id="download" size={18} />
                Download PDF
              </a>
            </div>
          </div>
        </div>,
        document.getElementById('modal-root')
      )}
    </section>
  );
}
