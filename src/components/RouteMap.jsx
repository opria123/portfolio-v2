import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'top',         label: 'Profile' },
  { id: 'playground',  label: 'Playground' },
  { id: 'experiences', label: 'Experience' },
  { id: 'projects',    label: 'Projects' },
  { id: 'skills',      label: 'Skills' },
  { id: 'education',   label: 'Education' },
  { id: 'publications', label: 'Publications' },
]

const PAD_X = 22
const SPACING_Y = 70
const MARGIN_Y = 34

function buildPath(points) {
  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    const my = (prev.y + cur.y) / 2
    d += ` C ${prev.x} ${my}, ${cur.x} ${my}, ${cur.x} ${cur.y}`
  }
  return d
}

export default function RouteMap() {
  const pathRef = useRef(null)
  const [pathLen, setPathLen] = useState(0)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)

  const W = 72
  const H = MARGIN_Y * 2 + SPACING_Y * (SECTIONS.length - 1)
  const waypoints = SECTIONS.map((s, i) => ({
    ...s,
    x: i % 2 === 0 ? PAD_X : W - PAD_X,
    y: MARGIN_Y + i * SPACING_Y,
  }))
  const pathD = buildPath(waypoints)

  useLayoutEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [pathD])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        setProgress(p)
        const probe = window.scrollY + window.innerHeight * 0.35
        let cur = 0
        for (let i = 0; i < SECTIONS.length; i++) {
          const el = document.getElementById(SECTIONS[i].id)
          if (!el) continue
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= probe) cur = i
        }
        // If we're at (or near) the bottom, force last section active
        const scrollBuffer = 8 // px
        if (window.innerHeight + window.scrollY >= doc.scrollHeight - scrollBuffer) {
          cur = SECTIONS.length - 1
        }
        setActive(cur)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  let carX = waypoints[0].x;
  let carY = waypoints[0].y;
  let carAngle = 0;
  if (pathRef.current && pathLen > 0) {
    const at = pathRef.current.getPointAtLength(pathLen * progress);
    const ahead = pathRef.current.getPointAtLength(Math.min(pathLen, pathLen * progress + 1));
    carX = at.x;
    carY = at.y;
    // Add -90 so car SVG (points up) faces forward along the path
    carAngle = Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180 / Math.PI - 90;
  }

  const onClickWaypoint = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="route-map" aria-label="Page sections">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="route-map-svg" role="navigation">
        {/* base dotted path */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="rgba(92,225,255,0.45)"
          strokeWidth="1.4"
          strokeDasharray="3 5"
          strokeLinecap="round"
        />
        {/* covered trail — solid sun-orange, revealed via dash-offset */}
        {pathLen > 0 && (
          <path
            d={pathD}
            fill="none"
            stroke="#ffa84a"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray={`${pathLen} ${pathLen}`}
            strokeDashoffset={pathLen * (1 - progress)}
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255,168,74,0.7))',
              transition: 'stroke-dashoffset .15s linear',
            }}
          />
        )}
        {waypoints.map((w, i) => {
          const cls = `route-map-waypoint${i === active ? ' active' : ''}${i < active ? ' visited' : ''}`
          return (
            <g
              key={w.id}
              className={cls}
              transform={`translate(${w.x} ${w.y})`}
              onClick={() => onClickWaypoint(w.id)}
            >
              <circle r="11" className="route-map-hit" />
              <Pin />
              <text
                x={w.x > W / 2 ? -12 : 12}
                y="-4"
                textAnchor={w.x > W / 2 ? 'end' : 'start'}
                className="route-map-label"
              >
                {w.label}
              </text>
            </g>
          )
        })}
        <g
          className="route-map-car"
          transform={`translate(${carX} ${carY}) rotate(${carAngle})`}
        >
          <GtiCar />
        </g>
      </svg>
    </aside>
  )
}

function Pin() {
  // teardrop pin: tip at (0,0), body curves up
  return (
    <g className="route-map-pin">
      <path
        className="route-map-pin-body"
        d="M0 0 C -4.5 -5 -5 -8 -5 -10 A 5 5 0 1 1 5 -10 C 5 -8 4.5 -5 0 0 Z"
      />
      <circle cx="0" cy="-10" r="2" className="route-map-pin-hole" />
    </g>
  )
}

function GtiCar() {
  return (
    <g>
      <rect x="-6" y="-10" width="12" height="20" rx="2.5" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="0.5"/>
      <rect x="-6" y="-10" width="12" height="2" fill="#000"/>
      <rect x="-6" y="8" width="12" height="2" fill="#000"/>
      <rect x="-5" y="-6" width="10" height="4.5" rx="1" fill="#1a2030"/>
      <rect x="-5" y="1.5" width="10" height="4.5" rx="1" fill="#1a2030"/>
      <rect x="-6.6" y="-3" width="1.6" height="2.5" fill="#222"/>
      <rect x="5" y="-3" width="1.6" height="2.5" fill="#222"/>
      <rect x="-6.6" y="0.5" width="1.6" height="2.5" fill="#222"/>
      <rect x="5" y="0.5" width="1.6" height="2.5" fill="#222"/>
      <rect x="-5" y="-1.2" width="10" height="0.7" fill="#d6212f"/>
      <rect x="-5" y="-0.3" width="10" height="0.4" fill="#ffffff"/>
      <circle cx="-3.5" cy="9" r="0.7" fill="#ff6b6b"/>
      <circle cx="3.5" cy="9" r="0.7" fill="#ff6b6b"/>
      <circle cx="-3.5" cy="-10" r="0.7" fill="#fff4c2"/>
      <circle cx="3.5" cy="-10" r="0.7" fill="#fff4c2"/>
    </g>
  )
}
