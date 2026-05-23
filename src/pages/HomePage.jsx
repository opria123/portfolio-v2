import React, { useEffect, useRef, useState } from 'react';
import PalmTree from '../components/PalmTree';
import HeroBackground from '../components/HeroBackground';
import Profile from '../components/Profile';
import LeftDock from '../components/LeftDock';
import { PdfModalContext } from '../components/PdfModalContext';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Education from '../components/Education';
import Publications from '../components/Blog';
import Terminal from '../components/Terminal';
import RouteMap from '../components/RouteMap';
import MobileNav from '../components/MobileNav';

export default function HomePage() {
    const [palms, setPalms] = useState([]);
    const palmsRef = useRef([]);
    const rafRef = useRef();
    const [showPdf, setShowPdf] = useState(false);

    const SPAWN_INTERVAL = 650;
    const SPEED = 0.00042;
    const HORIZON_Y = 0.58;

    useEffect(() => {
        let lastSpawn = performance.now();
        let lastFrame = performance.now();
        let palmId = 0;
        function spawnPalm(now) {
            const interval = SPAWN_INTERVAL * (0.8 + Math.random() * 0.6);
            if (now - lastSpawn > interval) {
                const side = Math.random() < 0.5 ? -1 : 1;
                palmsRef.current.push({
                    id: palmId++,
                    lane: side,
                    z: -0.12 - Math.random() * 0.1,
                    offset: Math.random() * 0.03,
                    baseScale: 0.85 + Math.random() * 0.5,
                    wobble: Math.random() * Math.PI * 2,
                });
                lastSpawn = now;
            }
        }
        function animate(now) {
            const dt = now - lastFrame;
            lastFrame = now;
            spawnPalm(now);
            palmsRef.current = palmsRef.current
                .map((p) => ({ ...p, z: p.z + SPEED * dt }))
                .filter((p) => p.z < 1.6);
            setPalms([...palmsRef.current]);
            rafRef.current = requestAnimationFrame(animate);
        }
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <PdfModalContext.Provider value={{ showPdf, setShowPdf }}>
            <RouteMap />
            <HeroBackground />
            {/* PALM OVERLAY - always behind all content */}
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'fixed',
                    inset: 0,
                    overflow: 'hidden',
                    zIndex: 0,
                }}
            >
                {palms.map((p) => {
                    const progress = Math.max(0, p.z);
                    const depth = 1 - Math.pow(1 - progress, 0.5);
                    const horizon = HORIZON_Y;
                    const y = horizon + depth * (1 - horizon);
                    const vw = Math.max(window.innerWidth, 320);
                    const isMobile = vw <= 600;
                    const roadNear = isMobile ? 1.05 : 0.78;
                    const roadFar = isMobile ? 0.18 : 0.02;
                    const roadWidth = roadFar + (roadNear - roadFar) * depth;
                    const shoulder = (isMobile ? 0.18 : 0.04) + p.offset;
                    const x = p.lane * (roadWidth + shoulder);
                    const left = 50 + x * 140;
                    const scale = p.baseScale * (0.25 + depth * 3.1);
                    const drift = Math.sin(p.wobble + progress * 5) * (1 + depth * 2);
                    const opacity = 0.4 + depth * 0.9;
                    const flip = p.lane === -1 ? -1 : 1;
                    return (
                        <div
                            key={p.id}
                            style={{
                                position: 'absolute',
                                top: `${y * 100}vh`,
                                left: `calc(${left}vw + ${drift}px)`,
                                width: '160px',
                                height: '200px',
                                transform: `translate(-50%, -100%) scale(${scale}) scaleX(${flip})`,
                                transformOrigin: 'bottom center',
                                opacity,
                                zIndex: Math.floor(1000 + depth * 1000),
                            }}
                        >
                            <PalmTree />
                        </div>
                    );
                })}
            </div>
            <MobileNav />
            <LeftDock />
            <div className="container">
                <main className="main-content">
                    <section id="top">
                        <Profile />
                    </section>
                    <section id="playground" className="playground-section">
                        <Terminal />
                    </section>
                    <section id="experiences">
                        <Experience />
                    </section>
                    <section id="projects">
                        <Projects />
                    </section>
                    <section id="skills">
                        <Skills />
                    </section>
                    <section id="education">
                        <Education />
                    </section>
                    <section id="publications">
                        <Publications />
                    </section>
                </main>
            </div>
        </PdfModalContext.Provider>
    );
}