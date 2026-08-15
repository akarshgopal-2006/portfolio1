import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './Footer.css';

export default function Footer() {
  const containerRef = useRef(null);
  const [revealState, setRevealState] = useState(0);
  // 0 = initial, 1 = darkening, 2 = batman revealing, 3 = text revealing, 4 = fading back, 5 = contact info

  // Cinematic Scroll Transition (matching previous sections)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const footerScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const footerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const footerFilter = useTransform(scrollYProgress, [0, 1], ['blur(20px)', 'blur(0px)']);

  const handleReveal = () => {
    // 1. Begin transition to cinematic darkness
    setRevealState(1);

    // 2. Begin slow Batman reveal from the shadows
    setTimeout(() => {
      setRevealState(2);
    }, 1500); // 1.5s to let darkness settle

    // 3. Reveal the iconic text
    setTimeout(() => {
      setRevealState(3);
    }, 5000); // Wait for Batman to fully emerge (3.5s later)

    // 4. Reverse cinematic sequence
    setTimeout(() => {
      setRevealState(4);
    }, 10000); // Hold Batman for 5 seconds, then reverse

    // 5. Reveal real footer
    setTimeout(() => {
      setRevealState(5);
    }, 12500); // 2.5s later, show contact links
  };

  return (
    <motion.footer
      ref={containerRef}
      id="footer"
      className={`footer-section state-${revealState}`}
      style={{ scale: footerScale, opacity: footerOpacity, filter: footerFilter }}
    >
      <div className="footer-content">

        {/* The Secret Button */}
        <AnimatePresence>
          {revealState === 0 && (
            <motion.button
              className="secret-btn"
              onClick={handleReveal}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              don't click
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hidden Batman Cinematic Sequence */}
        <div className={`batman-reveal-wrapper state-${revealState}`}>
          {/* Exactly reusing the Hero Batman image */}
          <img
            src={`${import.meta.env.BASE_URL}batman.png`}
            alt="Batman Reveal"
            className="batman-footer-img"
            draggable={false}
          />

          <div className="batman-text-split">
            <h1 className="iam-batman-text left">GOT</h1>
            <h1 className="iam-batman-text right">YOU</h1>
          </div>
        </div>

        {/* Liquid Glass Contact Footer */}
        <div className={`contact-reveal-wrapper state-${revealState}`}>
          <h2 className="stay-connected-text">STAY CONNECTED</h2>
          <div className="contact-links">
            {/* Phone */}
            <a href="tel:+919645150443" className="contact-link glass-effect" aria-label="Phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
            {/* Gmail */}
            <a href="mailto:akarshgopal@gmail.com" className="contact-link glass-effect" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com/akarshgopal-2006" target="_blank" rel="noopener noreferrer" className="contact-link glass-effect" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/akarsh-g-574863333" target="_blank" rel="noopener noreferrer" className="contact-link glass-effect" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
