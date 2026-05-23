import { useEffect, useRef } from 'react'
import PalmTree from './PalmTree'

// Synthwave horizon background:
//   * starfield + bokeh in the sky
//   * neon "sun" with horizontal scan lines clipped above the horizon
//   * distant pink mountain silhouettes
//   * perspective vector grid floor, slowly scrolling toward the viewer
export default function HeroBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')

    let raf
    let stars = []
    let shooters = []
    let nextShooterAt = 1500 + Math.random() * 3000
    let lastTs = 0
    let scroll = 0
    const HORIZON_RATIO = 0.55

    const STAR_PALETTE = [
      '#ffffff', '#ffffff', '#ffffff',
      '#cfe9ff', '#bfefff',
      '#ffd2f4', '#ffb3e6',
      '#fff3a8',
    ]

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedStars()
    }

    const seedStars = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const count = Math.min(220, Math.floor((w * h) / 9000))
      stars = []
      for (let i = 0; i < count; i++) {
        const bright = Math.random() < 0.18
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * HORIZON_RATIO,
          r: bright ? Math.random() * 1.6 + 1.0 : Math.random() * 1.1 + 0.25,
          a: 0.3 + Math.random() * 0.7,
          tw: Math.random() * Math.PI * 2,
          twSpeed: 0.4 + Math.random() * 1.8,
          color: STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)],
          drift: (Math.random() - 0.5) * 0.04,
          bright,
        })
      }
    }

    const spawnShooter = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const fromLeft = Math.random() < 0.5
      const startY = Math.random() * h * HORIZON_RATIO * 0.7
      const startX = fromLeft ? -40 : w + 40
      const angle = fromLeft
        ? Math.PI / 6 + Math.random() * (Math.PI / 8) // down-right
        : Math.PI - Math.PI / 6 - Math.random() * (Math.PI / 8) // down-left
      const speed = 900 + Math.random() * 600 // px/sec
      shooters.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.4,
        len: 120 + Math.random() * 120,
      })
    }

    resize()
    window.addEventListener('resize', resize)

    // Static palm placements matching your frame array
const palms = [
  { t: 0.18, side: -1, jitter: 0.03 },
  { t: 0.18, side: 1,  jitter: 0.03 },
  { t: 0.42, side: -1, jitter: 0.06 },
  { t: 0.42, side: 1,  jitter: 0.06 },
  { t: 0.78, side: -1, jitter: 0.09 },
  { t: 0.78, side: 1,  jitter: 0.09 },
];

// The raw, untouched jagged leaf coordinates from your clip-path
const LEAF_CLIP_PATH = [
  [49.7, 16.42],[69.46, 11.94],[87.03, 17.91],[98.4, 30.85],[96.01, 34.33],
  [85.43, 30.85],[79.64, 37.81],[76.65, 57.71],[74.65, 48.76],[74.05, 65.17],
  [70.46, 70.15],[69.86, 50.25],[67.27, 67.16],[63.67, 72.64],[65.07, 61.19],
  [63.87, 53.23],[60.48, 70.65],[56.69, 75.62],[58.48, 64.18],[57.68, 58.21],
  [53.69, 77.61],[49.9, 82.09],[51.9, 60.2],[48.9, 74.13],[46.31, 81.09],
  [41.92, 85.07],[45.71, 62.69],[39.52, 83.58],[33.53, 88.06],[36.13, 81.09],
  [39.52, 66.67],[31.74, 85.57],[25.55, 91.54],[28.74, 84.58],[31.74, 69.15],
  [28.14, 78.61],[25.15, 85.07],[16.77, 92.54],[18.96, 86.07],[22.55, 74.63],
  [16.57, 85.07],[13.97, 88.56],[6.59, 93.03],[12.77, 80.1],[9.18, 85.57],
  [0.8, 96.52],[3.39, 86.07],[16.57, 54.73],[31.94, 28.36]
];

// Helper translating exact CSS element boundaries into canvas paths
const drawLeafElement = (cqmin, widthPct, heightPct, txPct, tyPct, rotateDeg, scaleX, scaleY) => {
  ctx.save();

  // 1. Establish the actual size of this leaf bounding box (cqmin container matching)
  const leafW = (widthPct / 100) * cqmin;
  const leafH = (heightPct / 100) * cqmin;

  // 2. Mirror exact CSS transform parsing order: Translate first -> then Rotate -> then Scale
  ctx.translate((txPct / 100) * cqmin, (tyPct / 100) * cqmin);
  ctx.rotate((rotateDeg * Math.PI) / 180);
  ctx.scale(scaleX, scaleY);

  // 3. Trace out the serrated path scaling raw points into the dynamic bounding box
  ctx.beginPath();
  ctx.moveTo((LEAF_CLIP_PATH[0][0] / 100) * leafW, (LEAF_CLIP_PATH[0][1] / 100) * leafH);
  for (let i = 1; i < LEAF_CLIP_PATH.length; i++) {
    ctx.lineTo((LEAF_CLIP_PATH[i][0] / 100) * leafW, (LEAF_CLIP_PATH[i][1] / 100) * leafH);
  }
  ctx.closePath();

  // 4. Exact CSS: linear-gradient(160deg, var(--color-palm-leaf) 50%, var(--color-palm-leaf-2))
  // Map 160 deg angle using standard bounding layout bounding box geometry vectors
  const grad = ctx.createLinearGradient(0, 0, leafW * 0.34, leafH * 0.94);
  grad.addColorStop(0, '#ff00ff');   // Neon Magenta
  grad.addColorStop(0.5, '#ff00ff'); // Sharp cut line at 50%
  grad.addColorStop(0.51, '#000000'); // Clean drop directly to black shadow
  grad.addColorStop(1, '#000000');

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
};





    const drawHaze = (w, h) => {
      const g = ctx.createRadialGradient(w * 0.5, h * HORIZON_RATIO, 0, w * 0.5, h * HORIZON_RATIO, Math.max(w, h) * 0.7)
      g.addColorStop(0, 'rgba(255, 102, 196, 0.10)')
      g.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)')
      g.addColorStop(1, 'rgba(10, 4, 32, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    const NEBULAE = [
      { ox: 0.20, oy: 0.18, rx: 0.32, color: 'rgba(255, 43, 214,', alpha: 0.10, sp: 0.018, ph: 0 },
      { ox: 0.75, oy: 0.12, rx: 0.28, color: 'rgba(0, 240, 255,',  alpha: 0.08, sp: 0.012, ph: 1.7 },
      { ox: 0.50, oy: 0.30, rx: 0.40, color: 'rgba(124, 58, 237,', alpha: 0.09, sp: 0.009, ph: 3.4 },
    ]

    const drawNebulae = (w, h, now) => {
      const t = now / 1000
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (const n of NEBULAE) {
        const drift = Math.sin(t * n.sp + n.ph) * 0.06
        const cx = w * (n.ox + drift)
        const cy = h * (n.oy + Math.cos(t * n.sp * 1.3 + n.ph) * 0.02)
        const rr = Math.max(w, h) * n.rx
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr)
        g.addColorStop(0, `${n.color} ${n.alpha.toFixed(3)})`)
        g.addColorStop(0.5, `${n.color} ${(n.alpha * 0.4).toFixed(3)})`)
        g.addColorStop(1, `${n.color} 0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2)
      }
      ctx.restore()
    }

    const drawStars = (now, dt) => {
      const w = window.innerWidth
      const t = now / 1000
      for (const s of stars) {
        if (!reduced) {
          s.x += s.drift * dt * 60
          if (s.x < -2) s.x = w + 2
          else if (s.x > w + 2) s.x = -2
        }
        const tw = 0.55 + 0.45 * Math.sin(t * s.twSpeed + s.tw)
        const alpha = s.a * tw
        if (s.bright) {
          const haloR = s.r * 5
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR)
          g.addColorStop(0, s.color)
          g.addColorStop(0.3, s.color + '80')
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.globalAlpha = alpha * 0.55
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(s.x, s.y, haloR, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = alpha
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const drawShooters = (dt) => {
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        s.life += dt
        if (s.life >= s.maxLife) { shooters.splice(i, 1); continue }
        s.x += s.vx * dt
        s.y += s.vy * dt
        const k = s.life / s.maxLife
        const fade = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85
        const dirX = s.vx / Math.hypot(s.vx, s.vy)
        const dirY = s.vy / Math.hypot(s.vx, s.vy)
        const tailX = s.x - dirX * s.len
        const tailY = s.y - dirY * s.len
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 255, 255, ${(fade).toFixed(2)})`)
        grad.addColorStop(0.3, `rgba(200, 240, 255, ${(fade * 0.7).toFixed(2)})`)
        grad.addColorStop(1, 'rgba(124, 58, 237, 0)')
        ctx.save()
        ctx.strokeStyle = grad
        ctx.lineWidth = 2.2
        ctx.lineCap = 'round'
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()
        // bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${fade.toFixed(2)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const drawSun = (w, h, now) => {
      const cx = w * 0.5
      const horizonY = h * HORIZON_RATIO
      const radius = Math.min(w, h) * 0.16
      // Sun is now CLIPPED at the horizon (so it sits behind the highway/mountains)
      // Center the sun so most of the disk sits above the horizon line.
      const cy = horizonY - radius * 0.15
      const t = now / 1000
      const pulse = 0.92 + 0.08 * Math.sin(t * 1.4)

      // Glow halo
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2.6 * pulse)
      halo.addColorStop(0,   `rgba(187, 153, 255, ${(0.50 * pulse).toFixed(3)})`)
      halo.addColorStop(0.4, `rgba(246, 114, 202, ${(0.25 * pulse).toFixed(3)})`)
      halo.addColorStop(1,   'rgba(124, 58, 237, 0)')
      ctx.fillStyle = halo
      ctx.fillRect(cx - radius * 2.6, cy - radius * 2.6, radius * 5.2, radius * 5.2)

      // Sun disk gradient
      const sunGrad = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius)
      sunGrad.addColorStop(0,    '#fdb428')
      sunGrad.addColorStop(0.60, '#f672ca')
      sunGrad.addColorStop(1,    '#f672ca')
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, Math.PI, 2 * Math.PI) // top half only
      // Clip at the horizon
      ctx.lineTo(cx + radius, horizonY)
      ctx.lineTo(cx - radius, horizonY)
      ctx.closePath()
      ctx.clip()
      ctx.fillStyle = sunGrad
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      // Improved scanlines: seamless loop, bars match sun width, fade/thin at top
      ctx.globalCompositeOperation = 'destination-out'
      // Classic scanlines: evenly spaced, animated upward, not bunched
      const spacing = 0.11 // vertical spacing as fraction of radius (tweak for density)
      const thicknessBase = 0.045 // base thickness as fraction of radius
      const maxFrac = 0.82 // draw higher so lines start shrinking earlier and fade out more gradually
      const speed = 0.16 // animation speed (faster)
      const offset = ((t * speed) % spacing) * radius * 2
      for (let frac = 0; frac < maxFrac; frac += spacing) {
        // Animate upward, wrap smoothly
        const y = cy + radius - (frac * radius * 2 + offset)
        if (y < cy - radius - 2 || y > Math.min(cy + radius, horizonY)) continue // allow a little above the arc
        // Distance from center, normalized
        const rel = (y - cy) / radius
        // Bars always take full sun width
        const sunHalfWidth = radius;
        // Thickness: shrink earlier and with a smoother curve
        let shrinkFrac = Math.max(0, 1.08 - Math.abs(rel) * 1.22); // start shrinking earlier
        let thickness = thicknessBase * radius * Math.pow(shrinkFrac, 2.7)
        thickness = Math.max(0.02, thickness)
        // Smoother fade out near top
        let alpha = 0.82 * Math.pow(shrinkFrac, 2.2)
        if (y < cy - radius + 0.18 * radius) alpha *= 0.5
        ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(2)})`
        ctx.fillRect(cx - sunHalfWidth, y - thickness / 2, sunHalfWidth * 2, thickness)
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()
    }

    const drawMountains = (w, h) => {
      const horizonY = h * HORIZON_RATIO;
      // Sun geometry
      const cx = w * 0.5;
      const radius = Math.min(w, h) * 0.16;
      const leftSun = cx - radius;
      const rightSun = cx + radius;
      ctx.save();
      ctx.shadowColor = 'rgba(255, 43, 214, 0.6)';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = 'rgba(255, 43, 214, 0.85)';
      ctx.lineWidth = 2;
      // Peaks spanning the full width
      const peaks = [
        [0, horizonY], [w * 0.08, horizonY - 38], [w * 0.16, horizonY - 12],
        [w * 0.24, horizonY - 60], [w * 0.32, horizonY - 20], [w * 0.40, horizonY - 70],
        [w * 0.60, horizonY - 70], [w * 0.68, horizonY - 18], [w * 0.76, horizonY - 55],
        [w * 0.84, horizonY - 10], [w * 0.92, horizonY - 42], [w, horizonY],
      ];
      // Split peaks into left and right of the sun
      const leftPeaks = peaks.filter(([x, _]) => x <= leftSun);
      const rightPeaks = peaks.filter(([x, _]) => x >= rightSun);
      // Draw left segment
      ctx.beginPath();
      if (leftPeaks.length > 0) {
        ctx.moveTo(leftPeaks[0][0], leftPeaks[0][1]);
        for (let i = 1; i < leftPeaks.length; i++) ctx.lineTo(leftPeaks[i][0], leftPeaks[i][1]);
        // Drop to horizon at leftSun
        ctx.lineTo(leftSun, horizonY);
      }
      ctx.stroke();
      // Draw right segment
      ctx.beginPath();
      ctx.moveTo(rightSun, horizonY);
      for (let i = 0; i < rightPeaks.length; i++) ctx.lineTo(rightPeaks[i][0], rightPeaks[i][1]);
      ctx.stroke();
      ctx.restore();
    }

    const drawGrid = (w, h, now) => {
      const horizonY = h * HORIZON_RATIO
      const bottom = h
      const depth = bottom - horizonY

      ctx.save()
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(0, 240, 255, 0.45)'
      ctx.shadowBlur = 10

      const rows = 14
      for (let i = 0; i <= rows; i++) {
        const k = (i + (scroll % 1)) / rows
        const y = horizonY + Math.pow(k, 2.2) * depth
        const alpha = 0.25 + k * 0.55
        ctx.strokeStyle = `rgba(255, 43, 214, ${alpha.toFixed(2)})`
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Periodic cyan pulse rolling toward the viewer along the grid.
      const pulseT = ((now / 1000) % 5) / 5 // 0..1 every 5s
      if (pulseT > 0 && pulseT < 1) {
        const py = horizonY + Math.pow(pulseT, 2.2) * depth
        const fade = pulseT < 0.1 ? pulseT / 0.1 : 1 - (pulseT - 0.1) / 0.9
        ctx.save()
        ctx.shadowColor = 'rgba(0, 240, 255, 0.95)'
        ctx.shadowBlur = 22
        ctx.strokeStyle = `rgba(0, 240, 255, ${(0.85 * fade).toFixed(2)})`
        ctx.lineWidth = 2.4
        ctx.beginPath()
        ctx.moveTo(0, py)
        ctx.lineTo(w, py)
        ctx.stroke()
        ctx.restore()
      }

      const vp = { x: w * 0.5, y: horizonY }
      const cols = 24
      for (let i = -cols; i <= cols; i++) {
        const x = w * 0.5 + (i / cols) * w * 1.4
        ctx.strokeStyle = i === 0 ? 'rgba(0, 240, 255, 0.85)' : 'rgba(255, 43, 214, 0.55)'
        ctx.beginPath()
        ctx.moveTo(x, bottom)
        ctx.lineTo(vp.x, vp.y)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawCar = (w, h, now) => {
      const horizonY = h * HORIZON_RATIO
      const bottom = h
      const t = now / 1000

      // Mk8 Golf GTI proportions: wide and squat
      const carW = Math.max(160, Math.min(280, w * 0.17))
      const carH = carW * 0.52
      const cx = w * 0.5
      const cy = horizonY + (bottom - horizonY) * 0.62

      const x0 = cx - carW / 2

      // Headlight bloom on the road in front of the car (toward the sun)
      ctx.save()
      const beam = ctx.createRadialGradient(
        cx, cy - carH * 0.95, 0,
        cx, cy - carH * 0.95, carW * 1.4
      )
      beam.addColorStop(0, 'rgba(255, 240, 200, 0.35)')
      beam.addColorStop(0.4, 'rgba(255, 200, 120, 0.12)')
      beam.addColorStop(1, 'rgba(255, 180, 80, 0)')
      ctx.fillStyle = beam
      ctx.fillRect(cx - carW * 1.4, cy - carH * 2.0, carW * 2.8, carH * 2.0)
      ctx.restore()

      // Side mirrors — drawn BEFORE the body so the silhouette occludes most
      // of them, leaving small wedges peeking out at the A-pillar shoulders.
      ctx.save()
      ctx.shadowColor = 'rgba(255, 43, 214, 0.6)'
      ctx.shadowBlur = 8
      ctx.fillStyle = '#15052a'
      ctx.strokeStyle = 'rgba(255, 43, 214, 0.9)'
      ctx.lineWidth = 1
      const mirrorY = cy - carH * 0.93                  // up at the A-pillar / roof line
      const mirrorH = carH * 0.10
      const stickOut = carW * 0.1                     // how far past body edge
      // body edge at mirrorY (interpolating between roof 0.22 @ -1.00 and shoulder 0.16 @ -0.78)
      const bodyEdgeL = 0.22
      const bodyEdgeR = 0.78
      // left mirror: starts inside body, extends OUT past bodyEdgeL
      ctx.beginPath()
      ctx.moveTo(x0 + carW * (bodyEdgeL - 0.04), mirrorY)
      ctx.lineTo(x0 + carW * bodyEdgeL - stickOut, mirrorY + mirrorH * 0.30)
      ctx.lineTo(x0 + carW * bodyEdgeL - stickOut * 0.8, mirrorY + mirrorH * 0.85)
      ctx.lineTo(x0 + carW * (bodyEdgeL + 0.02), mirrorY + mirrorH)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      // right mirror
      ctx.beginPath()
      ctx.moveTo(x0 + carW * (bodyEdgeR + 0.04), mirrorY)
      ctx.lineTo(x0 + carW * bodyEdgeR + stickOut, mirrorY + mirrorH * 0.30)
      ctx.lineTo(x0 + carW * bodyEdgeR + stickOut * 0.8, mirrorY + mirrorH * 0.85)
      ctx.lineTo(x0 + carW * (bodyEdgeR - 0.02), mirrorY + mirrorH)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // Red taillight wash spilling back toward the viewer
      ctx.save()
      const trail = ctx.createLinearGradient(cx, cy - carH * 0.2, cx, bottom)
      trail.addColorStop(0, 'rgba(255, 40, 100, 0.50)')
      trail.addColorStop(0.5, 'rgba(255, 40, 100, 0.18)')
      trail.addColorStop(1, 'rgba(255, 40, 100, 0)')
      ctx.fillStyle = trail
      ctx.beginPath()
      ctx.moveTo(cx - carW * 0.36, cy + carH * 0.05)
      ctx.lineTo(cx + carW * 0.36, cy + carH * 0.05)
      ctx.lineTo(cx + carW * 1.7, bottom)
      ctx.lineTo(cx - carW * 1.7, bottom)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Body silhouette — bold, squat, wide hips, clear C-pillar
      ctx.save()
      ctx.shadowColor = 'rgba(255, 43, 214, 0.7)'
      ctx.shadowBlur = 18
      ctx.fillStyle = '#15052a'
      ctx.strokeStyle = 'rgba(255, 43, 214, 0.95)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(x0, cy)
      ctx.lineTo(x0 + carW * 0.02, cy - carH * 0.25)
      ctx.lineTo(x0 + carW * 0.06, cy - carH * 0.55)   // wide rear shoulders
      ctx.lineTo(x0 + carW * 0.16, cy - carH * 0.78)   // shoulder break
      ctx.lineTo(x0 + carW * 0.20, cy - carH * 0.92)   // C-pillar base
      ctx.lineTo(x0 + carW * 0.22, cy - carH * 1.00)   // roof edge (with spoiler lip)
      ctx.lineTo(x0 + carW * 0.78, cy - carH * 1.00)
      ctx.lineTo(x0 + carW * 0.80, cy - carH * 0.92)
      ctx.lineTo(x0 + carW * 0.84, cy - carH * 0.78)
      ctx.lineTo(x0 + carW * 0.94, cy - carH * 0.55)
      ctx.lineTo(x0 + carW * 0.98, cy - carH * 0.25)
      ctx.lineTo(x0 + carW, cy)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // Integrated roof spoiler lip (thin shadow line just below the roof edge)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(x0 + carW * 0.22, cy - carH * 0.95, carW * 0.56, carH * 0.04)


      // Rear window — wide, short, set into the C-pillar
      ctx.save()
      const win = ctx.createLinearGradient(0, cy - carH * 0.92, 0, cy - carH * 0.65)
      win.addColorStop(0, 'rgba(0, 240, 255, 0.40)')
      win.addColorStop(1, 'rgba(124, 58, 237, 0.55)')
      ctx.fillStyle = win
      ctx.beginPath()
      ctx.moveTo(x0 + carW * 0.26, cy - carH * 0.65)
      ctx.lineTo(x0 + carW * 0.28, cy - carH * 0.90)
      ctx.lineTo(x0 + carW * 0.72, cy - carH * 0.90)
      ctx.lineTo(x0 + carW * 0.74, cy - carH * 0.65)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Single full-width red light bar — the Mk8's defining rear feature
      // brighter at each end (the actual cluster), softer in the middle
      const pulse = 0.85 + 0.15 * Math.sin(t * 3.2)
      ctx.save()
      ctx.shadowColor = 'rgba(255, 30, 80, 1)'
      ctx.shadowBlur = 24
      const lightY = cy - carH * 0.42
      const lightH = carH * 0.13
      const lightX = x0 + carW * 0.06
      const lightW = carW * 0.88
      const lightGrad = ctx.createLinearGradient(lightX, 0, lightX + lightW, 0)
      lightGrad.addColorStop(0.00, `rgba(255, 50, 100, ${pulse.toFixed(2)})`)
      lightGrad.addColorStop(0.18, `rgba(255, 60, 110, ${pulse.toFixed(2)})`)
      lightGrad.addColorStop(0.50, `rgba(255, 90, 140, ${(pulse * 0.55).toFixed(2)})`)
      lightGrad.addColorStop(0.82, `rgba(255, 60, 110, ${pulse.toFixed(2)})`)
      lightGrad.addColorStop(1.00, `rgba(255, 50, 100, ${pulse.toFixed(2)})`)
      ctx.fillStyle = lightGrad
      ctx.fillRect(lightX, lightY, lightW, lightH)
      ctx.restore()

      // Light-bar internal detail (no shadow so lines stay crisp)
      ctx.save()
      // top + bottom chrome housing edge
      ctx.fillStyle = 'rgba(255, 220, 230, 0.55)'
      ctx.fillRect(lightX, lightY, lightW, Math.max(1, lightH * 0.07))
      ctx.fillStyle = 'rgba(120, 0, 30, 0.85)'
      ctx.fillRect(lightX, lightY + lightH - Math.max(1, lightH * 0.10), lightW, Math.max(1, lightH * 0.10))
      // horizontal LED segment lines through the bar
      ctx.fillStyle = 'rgba(60, 0, 20, 0.55)'
      for (let i = 1; i <= 2; i++) {
        const ly = lightY + (lightH * i) / 3
        ctx.fillRect(lightX, ly - 0.5, lightW, 1)
      }
      // vertical cluster dividers where the cluster meets the centre bar
      ctx.fillStyle = 'rgba(40, 0, 15, 0.75)'
      ctx.fillRect(lightX + lightW * 0.20, lightY, Math.max(1, carW * 0.006), lightH)
      ctx.fillRect(lightX + lightW * 0.78, lightY, Math.max(1, carW * 0.006), lightH)
      // bright cluster cores (the actual brake LEDs at each end)
      const coreA = ctx.createRadialGradient(
        lightX + lightW * 0.08, lightY + lightH * 0.5, 0,
        lightX + lightW * 0.08, lightY + lightH * 0.5, lightW * 0.10
      )
      coreA.addColorStop(0, `rgba(255, 200, 220, ${(pulse * 0.95).toFixed(2)})`)
      coreA.addColorStop(1, 'rgba(255, 50, 100, 0)')
      ctx.fillStyle = coreA
      ctx.fillRect(lightX - lightW * 0.05, lightY - lightH * 0.5, lightW * 0.3, lightH * 2)
      const coreB = ctx.createRadialGradient(
        lightX + lightW * 0.92, lightY + lightH * 0.5, 0,
        lightX + lightW * 0.92, lightY + lightH * 0.5, lightW * 0.10
      )
      coreB.addColorStop(0, `rgba(255, 200, 220, ${(pulse * 0.95).toFixed(2)})`)
      coreB.addColorStop(1, 'rgba(255, 50, 100, 0)')
      ctx.fillStyle = coreB
      ctx.fillRect(lightX + lightW * 0.75, lightY - lightH * 0.5, lightW * 0.3, lightH * 2)
      // animated specular sweep travelling across the bar
      const sweepX = lightX + ((Math.sin(t * 0.6) * 0.5 + 0.5) * lightW)
      const sweep = ctx.createLinearGradient(sweepX - lightW * 0.12, 0, sweepX + lightW * 0.12, 0)
      sweep.addColorStop(0, 'rgba(255, 255, 255, 0)')
      sweep.addColorStop(0.5, `rgba(255, 240, 245, ${(0.35 + pulse * 0.25).toFixed(2)})`)
      sweep.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = sweep
      ctx.fillRect(lightX, lightY + lightH * 0.10, lightW, lightH * 0.55)
      ctx.globalCompositeOperation = 'source-over'
      // thin upper brake strip riding just above the main bar
      ctx.shadowColor = 'rgba(255, 30, 80, 0.9)'
      ctx.shadowBlur = 12
      ctx.fillStyle = `rgba(255, 70, 120, ${(pulse * 0.9).toFixed(2)})`
      ctx.fillRect(lightX + lightW * 0.06, lightY - lightH * 0.22, lightW * 0.88, Math.max(1, lightH * 0.10))
      // hot inner core line glowing along the bar centre
      ctx.shadowColor = 'rgba(255, 120, 160, 1)'
      ctx.shadowBlur = 16
      ctx.fillStyle = `rgba(255, 200, 220, ${(0.6 + pulse * 0.25).toFixed(2)})`
      ctx.fillRect(lightX + lightW * 0.02, lightY + lightH * 0.42, lightW * 0.96, Math.max(1, lightH * 0.10))
      ctx.restore()

      // Outer ambient bloom under the bar (paints onto the body for spill light)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const bloom = ctx.createRadialGradient(
        cx, lightY + lightH * 0.5, 0,
        cx, lightY + lightH * 0.5, lightW * 0.7
      )
      bloom.addColorStop(0, `rgba(255, 60, 110, ${(0.18 + pulse * 0.07).toFixed(2)})`)
      bloom.addColorStop(1, 'rgba(255, 30, 80, 0)')
      ctx.fillStyle = bloom
      ctx.fillRect(cx - lightW, lightY - lightH * 1.5, lightW * 2, lightH * 4)
      ctx.restore()

      // VW roundel — chrome circle with V-over-W monogram, centered on the LED light bar
      ctx.save()
      const logoR = carH * 0.11
      const logoX = cx
      const logoY = cy - carH * 0.355
      ctx.shadowColor = 'rgba(220, 240, 255, 0.7)'
      ctx.shadowBlur = 8
      // chrome ring
      ctx.strokeStyle = 'rgba(230, 240, 255, 0.95)'
      ctx.fillStyle = 'rgba(20, 30, 50, 0.8)'
      ctx.lineWidth = Math.max(1, carH * 0.018)
      ctx.beginPath()
      ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // V (top half, apex pointing down to center)
      ctx.lineWidth = Math.max(1, carH * 0.022)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(logoX - logoR * 0.55, logoY - logoR * 0.55)
      ctx.lineTo(logoX, logoY + logoR * 0.05)
      ctx.lineTo(logoX + logoR * 0.55, logoY - logoR * 0.55)
      ctx.stroke()
      // W (bottom half)
      ctx.beginPath()
      ctx.moveTo(logoX - logoR * 0.7, logoY + logoR * 0.05)
      ctx.lineTo(logoX - logoR * 0.35, logoY + logoR * 0.55)
      ctx.lineTo(logoX, logoY + logoR * 0.05)
      ctx.lineTo(logoX + logoR * 0.35, logoY + logoR * 0.55)
      ctx.lineTo(logoX + logoR * 0.7, logoY + logoR * 0.05)
      ctx.stroke()
      ctx.restore()

      // GTI script — red italic lettering on the trunk lid (no plate)
      ctx.save()
      const badgeCX = Math.round(x0 + carW * 0.68)
      const badgeCY = Math.round(cy - carH * 0.18)
      const fontPx = Math.max(6, Math.round(carH * 0.085))
      ctx.font = `900 italic ${fontPx}px "Orbitron", "Arial Black", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      // dark shadow underneath for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillText('GTI', badgeCX + 1, badgeCY + 1)
      // red face with bloom
      ctx.shadowColor = 'rgba(255, 24, 68, 1)'
      ctx.shadowBlur = 5
      ctx.fillStyle = '#ff1844'
      ctx.fillText('GTI', badgeCX, badgeCY)
      ctx.restore()

      // Lower diffuser
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(x0 + carW * 0.16, cy - carH * 0.08, carW * 0.68, carH * 0.08)

      // Twin exhaust tips
      ctx.save()
      ctx.shadowColor = 'rgba(0, 240, 255, 0.9)'
      ctx.shadowBlur = 10
      ctx.fillStyle = 'rgba(180, 240, 255, 0.95)'
      const exW = carW * 0.07
      const exH = carH * 0.05
      ctx.fillRect(x0 + carW * 0.20, cy - carH * 0.06, exW, exH)
      ctx.fillRect(x0 + carW * 0.73, cy - carH * 0.06, exW, exH)
      ctx.restore()

      // Tires peeking under the bumper
      ctx.save()
      ctx.fillStyle = '#08031a'
      const tireW = carW * 0.15
      const tireH = carH * 0.11
      ctx.fillRect(x0 + carW * 0.03, cy - tireH * 0.2, tireW, tireH)
      ctx.fillRect(x0 + carW * 0.82, cy - tireH * 0.2, tireW, tireH)
      ctx.restore()
    }

    const tick = (now) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dt = lastTs ? Math.min(0.05, (now - lastTs) / 1000) : 0
      lastTs = now
      ctx.clearRect(0, 0, w, h)
      drawHaze(w, h)
      drawNebulae(w, h, now)
      drawStars(now, dt)
      drawShooters(dt)
      drawMountains(w, h)
      drawSun(w, h, now)
      drawGrid(w, h, now)
      // drawPalms removed
      drawCar(w, h, now)
      if (!reduced) {
        scroll += 0.045
        nextShooterAt -= dt * 1000
        if (nextShooterAt <= 0) {
          spawnShooter()
          nextShooterAt = 3500 + Math.random() * 5500
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div id="hero-background" className="hero-background synthwave-bg" aria-hidden="true">
      <canvas ref={canvasRef} id="synthwave-canvas" />
    </div>
  )
}
