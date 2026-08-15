import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './SecondSection.css';

export default function SecondSection() {
  const cardRef = useRef(null);
  const cordRef = useRef(null);
  
  // Cinematic scroll transition (matching Hero -> Page 2)
  const [wh, setWh] = useState(800);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWh(window.innerHeight);
    const checkMobile = () => {
      setWh(window.innerHeight);
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [wh, wh * 2], [1, isMobile ? 1 : 0.85]);
  const opacity = useTransform(scrollY, [wh, wh * 2], [1, isMobile ? 1 : 0]);
  const filter = useTransform(scrollY, [wh, wh * 2], ['blur(0px)', isMobile ? 'blur(0px)' : 'blur(12px)']);

    const physics = useRef({
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      isDragging: false,
      startPointer: { x: 0, y: 0 },
      startPos: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      anchor: { x: 0, y: -400 }, // Fixed attachment point far above
      restLength: 400,
      gravity: 0.08, // Ultra slow gravity
      spring: 0.008, // Extremely low tension for a very slow, heavy swing
      damping: 0.99, // Long sustained slow momentum
      time: 0
    });

  const handlePointerDown = (e) => {
    const p = physics.current;
    p.isDragging = true;
    p.startPointer = { x: e.clientX, y: e.clientY };
    p.startPos = { x: p.pos.x, y: p.pos.y };
    p.target = { x: p.pos.x, y: p.pos.y };
    
    if (cardRef.current) cardRef.current.style.cursor = 'grabbing';
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const p = physics.current;
    if (!p.isDragging) return;
    p.target.x = p.startPos.x + (e.clientX - p.startPointer.x);
    p.target.y = p.startPos.y + (e.clientY - p.startPointer.y);
  };

  const handlePointerUp = () => {
    const p = physics.current;
    p.isDragging = false;
    if (cardRef.current) cardRef.current.style.cursor = 'grab';
    
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  };

  useEffect(() => {
    let animationId;

    const update = () => {
      const p = physics.current;
      p.time += 0.05;

      // 1. Pointer Force (Rubber band toward mouse)
      if (p.isDragging) {
        p.vel.x += (p.target.x - p.pos.x) * 0.4;
        p.vel.y += (p.target.y - p.pos.y) * 0.4;
      }

      // 2. Gravity
      p.vel.y += p.gravity;

      // 3. Hooke's Law Spring (Attachment to Anchor)
      const dx = p.pos.x - p.anchor.x;
      const dy = p.pos.y - p.anchor.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Elastic stretch constraint
      if (distance > p.restLength) {
        const force = (distance - p.restLength) * p.spring;
        const nx = dx / distance;
        const ny = dy / distance;
        p.vel.x -= nx * force;
        p.vel.y -= ny * force;
      }

      // 4. Micro-movement (Subtle wind sway when resting)
      if (!p.isDragging) {
        p.vel.x += Math.sin(p.time) * 0.03;
      }

      // 5. Damping (Friction)
      p.vel.x *= p.damping;
      p.vel.y *= p.damping;

      // 6. Update Position
      p.pos.x += p.vel.x;
      p.pos.y += p.vel.y;

      // 7. Calculate 3D Rotations based on physical momentum
      // Z: The physical pendulum angle of the cord
      const angleZ = Math.atan2(dy, dx) - Math.PI / 2;
      let rotateZ = angleZ * (180 / Math.PI);
      
      // Y: Maps horizontal velocity to a 3D tilt (air resistance)
      const rotateY = p.vel.x * 0.4;
      
      // X: Maps vertical velocity to tilt
      const rotateX = -p.vel.y * 0.4;

      // 8. Render to DOM (Bypassing React for 60fps performance)
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${p.pos.x}px, ${p.pos.y}px, 0) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }

      // 9. Render Dynamic Cord connecting anchor to card pin
      if (cordRef.current) {
        cordRef.current.setAttribute("x2", p.pos.x);
        cordRef.current.setAttribute("y2", p.pos.y); 
      }

      animationId = requestAnimationFrame(update);
    };

    update();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <motion.section 
      id="second-section" 
      className="second-section"
      style={{ scale, opacity, filter }}
    >
      
      {/* Background/Composition Character (F2) with Seamless Fade Reveal */}
      <motion.div 
        className="second-visual"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}f2.png`} 
          alt="Batman Half Turned" 
          className="batman-f2" 
          draggable={false} 
        />
      </motion.div>

      {/* Physics-Based Floating Profile Card & About Text */}
      <div className="physics-stage">
        
        {/* NEW: About Me Text */}
        <motion.div 
          className="about-me-container"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="about-title">ABOUT ME</h2>
          <p className="about-desc">
            I'm Akarsh — a UI/UX designer and front-end developer with a strong interest in AI and Machine Learning, creating digital experiences where design, technology, and interaction come together.
          </p>
        </motion.div>

        {/* Entrance Animation Wrapper - Drops from the sky like it fell from Hero section */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? -50 : -300, rotate: isMobile ? 15 : 45, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 35, damping: 15, delay: 0.2 }}
          viewport={{ once: true, amount: 0.1 }}
          style={{ position: 'relative' }}
        >
          {/* Dynamic Physics Cord */}
          <svg style={{ position: 'absolute', top: 0, left: '50%', overflow: 'visible', zIndex: 4 }}>
            <defs>
              <linearGradient id="cord-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#111" />
                <stop offset="50%" stopColor="#444" />
                <stop offset="100%" stopColor="#111" />
              </linearGradient>
            </defs>
            <line 
              ref={cordRef} 
              x1="0" y1="-400" x2="0" y2="0" 
              stroke="url(#cord-grad)" 
              strokeWidth="4" 
              filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
            />
          </svg>

          {/* Physics Engine Managed Card */}
          <div
            ref={cardRef}
            className="bat-badge"
            onPointerDown={handlePointerDown}
          >
            {/* Hanging Mechanics */}
            <div className="badge-hanger">
              <div className="badge-pin"></div>
            </div>
            
            <div className="badge-content">
              {/* Batman Logo Symbol */}
              <svg className="batman-symbol-bg" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 55 C35 55, 20 40, 5 30 C15 35, 25 30, 20 20 C30 25, 35 15, 35 15 C38 20, 42 20, 45 10 L48 5 L50 15 L52 5 L55 10 C58 20, 62 20, 65 15 C65 15, 70 25, 80 20 C75 30, 85 35, 95 30 C80 40, 65 55, 50 55 Z" fill="currentColor" />
              </svg>

              <div className="badge-avatar">
                <img src={`${import.meta.env.BASE_URL}me.png`} alt="Akarsh Gopal" draggable={false} />
              </div>
              
              <div className="badge-info">
                <div className="badge-text">
                  <h2>AKARSH GOPAL</h2>
                  <p>Front-End Developer<br/>AI / ML Enthusiast</p>
                </div>
                
                <button 
                  className="badge-cta"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  draggable={false}
                >
                  VIEW WORK &rarr;
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
