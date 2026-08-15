import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import VoxelBatman from './VoxelBatman';
import './ThirdSection.css';

export default function ThirdSection() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cinematic Scroll Animation for Batman
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const batmanY = useTransform(scrollYProgress, [0, 1], [isMobile ? 40 : 300, 0]);
  const batmanScale = useTransform(scrollYProgress, [0, 1], [isMobile ? 1.05 : 1.2, 1]);
  const batmanOpacity = useTransform(scrollYProgress, [0, 1], [isMobile ? 0.3 : 0, 1]);
  const batmanFilter = useTransform(scrollYProgress, [0, 1], [isMobile ? 'blur(4px) brightness(0.5)' : 'blur(20px) brightness(0.2)', 'blur(0px) brightness(1)']);
  // Staggered cinematic text entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <section ref={containerRef} id="third-section" className="third-section">

      {/* ── LEFT COLUMN: Text Content ── */}
      <div className="third-content-left">
        <motion.div
          className="resume-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* EXPERIENCE */}
          <motion.h2 variants={itemVariants} className="section-title">EXPERIENCE</motion.h2>

          <motion.div variants={itemVariants} className="resume-block">
            <h3 className="job-title">Volunteer &mdash; Huddle Global 2025</h3>
            <p className="job-meta">Kerala Startup Mission &mdash; The Leela Raviz, Kovalam <span className="job-date">| Dec 2025</span></p>
            <ul className="job-bullets">
              <li>Contributed to execution of a national-level startup and innovation summit with 1000+ attendees.</li>
              <li>Coordinated logistics and stakeholder communication across multiple teams.</li>
              <li>Ensured seamless workflow operations during event execution.</li>
              <li>Awarded Certificate of Appreciation for performance and teamwork.</li>
            </ul>
          </motion.div>

          {/* SKILLS */}
          <motion.h2 variants={itemVariants} className="section-title mt-xl">SKILLS</motion.h2>

          <div className="skills-grid">
            <motion.div variants={itemVariants} className="skill-category">
              <h4>Technical Skills</h4>
              <p>Python &bull; HTML &bull; CSS &bull; Machine Learning &bull; Agentic AI &bull; LLM Systems</p>
            </motion.div>

            <motion.div variants={itemVariants} className="skill-category">
              <h4>Research Skills</h4>
              <p>AI Research &bull; Multi-Agent Systems &bull; Prompt Engineering &bull; Knowledge Synthesis</p>
            </motion.div>

            <motion.div variants={itemVariants} className="skill-category">
              <h4>Soft Skills</h4>
              <p>Analytical Thinking &bull; Problem Solving &bull; Team Collaboration &bull; Communication</p>
            </motion.div>

            <motion.div variants={itemVariants} className="skill-category">
              <h4>Tools</h4>
              <p>Git &bull; GitHub &bull; VS Code &bull; Figma</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT COLUMN: Interactive Voxel Batman ── */}
      <div className="third-visual-right">
        <VoxelBatman 
          className="batman-f4-wrapper"
          style={{ y: batmanY, scale: batmanScale, opacity: batmanOpacity, filter: batmanFilter }}
        />
      </div>

    </section>
  );
}
