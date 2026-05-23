import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const NOTIF_KEY = 'portfolio.notifications.v1'

const NotificationsContext = createContext(null)

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>')
  return ctx
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(NOTIF_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications))
  }, [notifications])

  const push = useCallback((notif) => {
    setNotifications((prev) => {
      if (notif.id && prev.some((n) => n.id === notif.id)) return prev
      return [notif, ...prev]
    })
  }, [])

  const clear = useCallback(() => setNotifications([]), [])

  const value = useMemo(() => ({ notifications, push, clear }), [notifications, push, clear])

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
