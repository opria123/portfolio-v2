import { useEffect, useMemo, useRef, useState } from 'react'
import { useTrophies } from './TrophiesProvider'
import { useNotifications } from './NotificationsProvider'
import Icon from './Icon'
import AppIcon from './AppIcon'

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

export default function RightDock() {
  const { trophies } = useTrophies()
  const { notifications, clear } = useNotifications()
  const [trophiesOpen, setTrophiesOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)
  useClickOutside(notifRef, () => setNotifOpen(false))

  const { unlocked, total, percent, circumference, dashoffset } = useMemo(() => {
    const unlocked = trophies.filter((t) => t.unlocked).length
    const total = trophies.length
    const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0
    const r = 24
    const circumference = 2 * Math.PI * r
    const dashoffset = circumference * (1 - percent / 100)
    return { unlocked, total, percent, circumference, dashoffset }
  }, [trophies])

  return (
    <>
      <nav id="right-dock" className="right-dock" role="navigation" aria-label="Right toolbar">
        <div className="right-dock-container">
          <div className="dock-item trophies-item">
            <button
              className="dock-button trophies-btn"
              title="Trophies"
              aria-label="View unlocked trophies"
              onClick={() => setTrophiesOpen(true)}
            >
              <Icon id="trophy" size={20} className="dock-icon" />
              <span className="trophy-count" id="trophy-count">
                {percent}%
              </span>
              <div className="trophy-progress" id="trophy-progress">
                <svg className="trophy-progress-circle" viewBox="0 0 52 52">
                  <circle className="trophy-progress-track" cx="26" cy="26" r="24" fill="none" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="2" />
                  <circle
                    className="trophy-progress-bar"
                    cx="26"
                    cy="26"
                    r="24"
                    fill="none"
                    stroke="url(#trophyGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    transform="rotate(-90 26 26)"
                  />
                  <defs>
                    <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                      <stop offset="100%" stopColor="#FFA500" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </button>
          </div>

          <div className="dock-item notifications-item" ref={notifRef}>
            <button
              className="dock-button notifications-btn"
              title="Notifications"
              aria-label="View notifications"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Icon id="bell" size={20} className="dock-icon" />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            {notifOpen && (
              <div className="notifications-dropdown active">
                <div className="notifications-header">
                  <span>Notifications</span>
                  <button className="btn-action" onClick={clear}>
                    Clear all
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div className="notification-item" key={n.id}>
                        <span className="notification-icon"><AppIcon name={n.icon} size={18} /></span>
                        <div className="notification-body">
                          <strong>{n.title}</strong>
                          <p>{n.message}</p>
                          <small>{n.time}</small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>

      {trophiesOpen && (
        <div className="trophies-modal open" role="dialog" aria-modal="true">
          <div className="trophies-modal-overlay" onClick={() => setTrophiesOpen(false)} />
          <div className="trophies-modal-content">
            <div className="trophies-modal-header">
              <div className="modal-title-section">
                <h2 className="modal-title"><AppIcon name="trophy" size={22} /> Trophy Collection</h2>
                <p className="modal-subtitle">Your achievements while exploring the portfolio</p>
              </div>
              <div className="modal-progress-section">
                <div className="overall-progress">
                  <span className="progress-label">Overall progress</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="progress-text">
                      {unlocked}/{total}
                    </span>
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setTrophiesOpen(false)} aria-label="Close">
                <Icon id="close" size={24} />
              </button>
            </div>
            <div className="trophies-modal-body">
              <div className="trophies-grid">
                {trophies.map((t) => (
                  <div className={`trophy-card rarity-${t.rarity || 'common'} ${t.unlocked ? 'unlocked' : 'locked'}`} key={t.id}>
                    <div className="trophy-card-icon">{t.unlocked ? <AppIcon name={t.icon} size={28} /> : <AppIcon name="lock" size={28} />}</div>
                    <h3 className="trophy-card-name">{t.name}</h3>
                    <p className="trophy-card-desc">{t.description}</p>
                    {t.rarity && <span className={`trophy-card-rarity rarity-${t.rarity}`}>{t.rarity}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
