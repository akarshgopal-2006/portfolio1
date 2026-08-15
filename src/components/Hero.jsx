import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

export default function Hero() {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);


  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    if (touch) {
      setMousePos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
    // Mobile doesn't have a true 'hover', so we toggle it on tap
    setHovered(prev => !prev);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    if (touch) {
      setMousePos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  };

  const handleStageClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage position
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    // The Batman chest emblem is roughly in the center-middle (X: 40-60%, Y: 50-75%)
    if (pctX > 40 && pctX < 60 && pctY > 50 && pctY < 75) {
      document.getElementById('second-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3D Cinematic Depth Transforms based on Window Scroll
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 800], [1, isMobile ? 1 : 0.85]);
  const opacity = useTransform(scrollY, [0, 800], [1, isMobile ? 1 : 0]);
  const filter = useTransform(scrollY, [0, 800], ['blur(0px)', isMobile ? 'blur(0px)' : 'blur(12px)']);

  return (
    <motion.section
      id="hero"
      className="hero"
      style={{ scale, opacity, filter }}
    >
      {/* ── LEFT: Personal Introduction ── */}
      <div className="hero-content-left">
        <div className="hero-intro">
          <p className="hero-greeting">Hi, I'm</p>
          <h1 className="hero-name">AKARSH</h1>
          <p className="hero-subheading">Front-End Developer &amp; AI/ML Student</p>
          <div className="hero-cta-group">
            <a href="#work" className="btn btn-primary">View Work</a>
            <a
              href="#footer"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      {/* ── RIGHT TEXT: Last Name ── */}
      <div className="hero-content-right">
        <div className="hero-intro" style={{ animationDelay: "0.1s" }}>
          <h1 className="hero-name" style={{ marginBottom: 0 }}>GOPAL</h1>
        </div>
      </div>

      {/* ── CENTER: Large Interactive Character ── */}
      <div className="hero-visual-center">
        <div
          className="hero-image-stage"
          ref={containerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          onClick={handleStageClick}
          style={{ cursor: hovered ? 'crosshair' : 'default' }}
        >
          <img
            src="/batman.png"
            alt="Batman"
            className="hero-layer layer-batman"
            draggable={false}
          />
          <div className="hero-head-mask">
            <img
              src="/me.png"
              alt="Akarsh Sharma"
              className={`hero-layer layer-photo ${hovered ? 'is-revealed' : ''}`}
              draggable={false}
              style={{
                WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 85%)`,
                maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 85%)`
              }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
