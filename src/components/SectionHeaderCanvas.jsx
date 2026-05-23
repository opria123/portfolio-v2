import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';

/**
 * SectionHeaderCanvas
 * Canvas-based background fade for section headers, driven by scroll position.
 *
 * Usage: Place this component absolutely behind your section header text.
 *
 * Props:
 * - containerRef: ref to the section DOM node (for scroll tracking)
 * - width, height: canvas size (default: 600x120)
 * - color: background color (default: 'rgba(10,16,32,0.85)')
 */

export default function SectionHeaderCanvas({ containerRef, width = 600, height = 120, color = 'rgba(18,22,36,0.92)' }) {
  const canvasRef = useRef(null);
  // Track scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Smoothstep for extra soft fade
  function smoothstep(edge0, edge1, x) {
    x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return x * x * (3 - 2 * x);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let currentProgress = 0;
    const unsubscribe = scrollYProgress.onChange((v) => {
      currentProgress = v;
    });

    // Sun sweep: as you scroll, the sun (gradient center) moves from top to bottom
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Sun center moves top to bottom as you scroll
      const sunX = canvas.width / 2;
      // Tighter sweep range, so the fade zone matches the sun's position more closely
      const sunY = canvas.height * (0.28 + 0.44 * currentProgress); // from 28% to 72%
      // Fade in/out with a tighter, more centered smoothstep and more contrast
      let fade = smoothstep(0.18, 0.38, currentProgress) * (1 - smoothstep(0.62, 0.82, currentProgress));
      // Make the fade curve more pronounced for higher contrast
      fade = Math.pow(fade, 1.2);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, fade));
      // Draw a larger, still soft radial ellipse background
      const grad = ctx.createRadialGradient(
        sunX, sunY, canvas.height / 7.5,
        sunX, sunY, canvas.width * 0.55
      );
      grad.addColorStop(0, color);
      grad.addColorStop(0.25, color);
      grad.addColorStop(0.6, 'rgba(18,22,36,0.18)');
      grad.addColorStop(1, 'rgba(18,22,36,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubscribe();
    };
  }, [scrollYProgress, color, width, height]);

  // Responsive resize (optional: can be improved for dynamic headers)
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
