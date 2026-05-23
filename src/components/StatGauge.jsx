import { useEffect, useRef, useState, useId } from 'react'

// Mk8 GTI Digital Cockpit-style gauge.
// - speedo: cyan progressive fill, redline at end
// - rpm:    orange progressive fill, redline at end
// Numbered tick scale, GTI red badge at the bottom, honeycomb inner overlay.

const ANGLE_START = -125
const ANGLE_END = 125
const ANGLE_RANGE = ANGLE_END - ANGLE_START

const VARIANTS = {
  speedo: {
    track: 'rgba(255,255,255,0.10)',
    fill: '#00f0ff',
    fillGlow: 'rgba(0, 240, 255, 0.55)',
    needle: '#ff2bd6',
    needleGlow: 'rgba(255, 43, 214, 0.7)',
    redline: 0.85,
    redlineColor: '#ff2bd6',
    accent: '#00f0ff',
    centerLabel: 'SPD',
  },
  rpm: {
    track: 'rgba(255,255,255,0.10)',
    fill: '#ff7a00',
    fillGlow: 'rgba(255, 122, 0, 0.6)',
    needle: '#ff2bd6',
    needleGlow: 'rgba(255, 43, 214, 0.7)',
    redline: 0.78,
    redlineColor: '#ff003c',
    accent: '#ff7a00',
    centerLabel: 'RPM',
  },
}

export default function StatGauge({ value, label, numeric = 0, max = 100, unit = '', gauge = 'speedo' }) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)
  const cfg = VARIANTS[gauge] || VARIANTS.speedo
  const target = Math.max(0, Math.min(1, numeric / max))
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(target)
      return
    }
    let raf, started = false, hasScrolled = false
    const animate = (start) => {
      const duration = 1800
      const c1 = 1.70158
      const c3 = c1 + 1
      const easeOutBack = (t) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        setProgress(target * easeOutBack(t))
        if (t < 1) raf = requestAnimationFrame(tick)
        else setProgress(target)
      }
      raf = requestAnimationFrame(tick)
    }
    const tryStart = () => {
      if (started) return
      const rect = node.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15
      if (hasScrolled && inView) {
        started = true
        animate(performance.now())
        cleanup()
      }
    }
    const onScroll = () => { hasScrolled = true; tryStart() }
    const obs = new IntersectionObserver(() => tryStart(), { threshold: 0.4 })
    obs.observe(node)
    window.addEventListener('scroll', onScroll, { passive: true })
    const cleanup = () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
    return () => {
      cleanup()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target])

  // Geometry — viewBox 0 0 140 130
  const cx = 70, cy = 68
  const rOuter = 56
  const rArc = 50
  const rTickOuter = 46
  const rTickMajor = 38
  const rTickMinor = 41
  const rNumber = 31

  const polar = (angleDeg, radius) => {
    const a = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) }
  }
  const arcPath = (fromDeg, toDeg, radius) => {
    if (Math.abs(toDeg - fromDeg) < 0.01) return ''
    const a = polar(fromDeg, radius)
    const b = polar(toDeg, radius)
    const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
    const sweep = toDeg > fromDeg ? 1 : 0
    return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} ${sweep} ${b.x} ${b.y}`
  }

  const redlineAngle = ANGLE_START + cfg.redline * ANGLE_RANGE
  const needleAngle = ANGLE_START + progress * ANGLE_RANGE
  const fillEndAngle = ANGLE_START + progress * ANGLE_RANGE

  const MAJOR_COUNT = 5
  const MINOR_PER_SEGMENT = 4
  const ticks = []
  const numbers = []
  for (let i = 0; i <= MAJOR_COUNT; i++) {
    const t = i / MAJOR_COUNT
    const angle = ANGLE_START + t * ANGLE_RANGE
    const inner = polar(angle, rTickMajor)
    const outer = polar(angle, rTickOuter)
    const inRedline = angle >= redlineAngle - 0.001
    ticks.push({ inner, outer, isMajor: true, inRedline })
    const n = polar(angle, rNumber)
    numbers.push({ x: n.x, y: n.y, value: Math.round(t * max), inRedline })
    if (i < MAJOR_COUNT) {
      for (let j = 1; j <= MINOR_PER_SEGMENT; j++) {
        const tm = (i + j / (MINOR_PER_SEGMENT + 1)) / MAJOR_COUNT
        const am = ANGLE_START + tm * ANGLE_RANGE
        ticks.push({
          inner: polar(am, rTickMinor),
          outer: polar(am, rTickOuter),
          isMajor: false,
          inRedline: am >= redlineAngle - 0.001,
        })
      }
    }
  }

  const faceId = `face-${gauge}-${uid}`
  const innerId = `inner-${gauge}-${uid}`
  const honeyId = `honey-${gauge}-${uid}`

  return (
    <div className="stat-item gauge-card" ref={ref}>
      <svg viewBox="0 0 140 130" className="gauge-svg" aria-hidden="true">
        <defs>
          <radialGradient id={faceId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(40,18,80,0.95)" />
            <stop offset="60%" stopColor="rgba(15,6,38,0.98)" />
            <stop offset="100%" stopColor="rgba(2,1,8,1)" />
          </radialGradient>
          <radialGradient id={innerId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(8,4,24,0)" />
            <stop offset="80%" stopColor="rgba(8,4,24,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
          </radialGradient>
          <pattern id={honeyId} x="0" y="0" width="6" height="5.2" patternUnits="userSpaceOnUse">
            <path
              d="M3 0 L6 1.5 L6 3.7 L3 5.2 L0 3.7 L0 1.5 Z"
              fill="none"
              stroke={cfg.accent}
              strokeWidth="0.3"
              opacity="0.18"
            />
          </pattern>
        </defs>

        {/* Bezel */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={rOuter - 2} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" />
        {/* Face */}
        <circle cx={cx} cy={cy} r={rOuter - 3} fill={`url(#${faceId})`} />
        <circle cx={cx} cy={cy} r={rOuter - 6} fill={`url(#${honeyId})`} />
        <circle cx={cx} cy={cy} r={rOuter - 3} fill={`url(#${innerId})`} />

        {/* Track */}
        <path
          d={arcPath(ANGLE_START, ANGLE_END, rArc)}
          fill="none"
          stroke={cfg.track}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Dim redline track */}
        <path
          d={arcPath(redlineAngle, ANGLE_END, rArc)}
          fill="none"
          stroke={cfg.redlineColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* Active fill */}
        {progress > 0 && (
          <path
            d={arcPath(ANGLE_START, Math.min(fillEndAngle, redlineAngle), rArc)}
            fill="none"
            stroke={cfg.fill}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${cfg.fillGlow})` }}
          />
        )}
        {fillEndAngle > redlineAngle && (
          <path
            d={arcPath(redlineAngle, fillEndAngle, rArc)}
            fill="none"
            stroke={cfg.redlineColor}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${cfg.redlineColor})` }}
          />
        )}

        {/* Ticks */}
        {ticks.map((tk, i) => (
          <line
            key={i}
            x1={tk.inner.x}
            y1={tk.inner.y}
            x2={tk.outer.x}
            y2={tk.outer.y}
            stroke={tk.inRedline ? cfg.redlineColor : 'rgba(255,255,255,0.75)'}
            strokeWidth={tk.isMajor ? 1.4 : 0.6}
            strokeLinecap="round"
            opacity={tk.isMajor ? 1 : 0.7}
          />
        ))}

        {/* Numbers */}
        {numbers.map((n, i) => (
          <text
            key={i}
            x={n.x}
            y={n.y + 1.8}
            textAnchor="middle"
            className="gauge-scale-text"
            fill={n.inRedline ? cfg.redlineColor : 'rgba(255,255,255,0.85)'}
          >
            {n.value}
          </text>
        ))}

        {/* Center hub plate */}
        <circle cx={cx} cy={cy} r="22" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {/* Digital readout */}
        <text x={cx} y={cy - 2} textAnchor="middle" className="gauge-value-text" fill="#fff">
          {value}
        </text>
        {unit && (
          <text x={cx} y={cy + 7} textAnchor="middle" className="gauge-unit-text" fill={cfg.accent}>
            {unit}
          </text>
        )}
        <text x={cx} y={cy + 14} textAnchor="middle" className="gauge-mode-text" fill="rgba(255,255,255,0.4)">
          {cfg.centerLabel}
        </text>

        {/* Needle */}
        <g
          style={{
            transform: `rotate(${needleAngle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            filter: `drop-shadow(0 0 5px ${cfg.needleGlow})`,
          }}
        >
          <path d={`M ${cx - 2.2} ${cy} L ${cx + 2.2} ${cy} L ${cx + 1.4} ${cy + 8} L ${cx - 1.4} ${cy + 8} Z`} fill="#1a0a3e" />
          <path
            d={`M ${cx - 1.6} ${cy + 2} L ${cx} ${cy - rArc + 4} L ${cx + 1.6} ${cy + 2} Z`}
            fill={cfg.needle}
          />
          <circle cx={cx} cy={cy} r="3.5" fill="#0a0420" stroke={cfg.needle} strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="1.2" fill={cfg.needle} />
        </g>

        {/* GTI red badge */}
        <g>
          <rect
            x={cx - 11}
            y={cy + rOuter - 14}
            width="22"
            height="9"
            rx="1.5"
            fill="#cc0a2b"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.3"
          />
          <text
            x={cx}
            y={cy + rOuter - 7.5}
            textAnchor="middle"
            className="gauge-gti-text"
            fill="#fff"
          >
            GTI
          </text>
        </g>
      </svg>
      <div className="stat-label gauge-label">{label}</div>
    </div>
  )
}
