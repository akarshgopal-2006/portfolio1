import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [showNotification, setShowNotification] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    setShowNotification(true);
    
    // Hide notification and scroll after 1.5s
    setTimeout(() => {
      setShowNotification(false);
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    document.getElementById('second-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {showNotification && (
        <div className="notification-popup">
          Good decision!
        </div>
      )}
      <nav id="navbar" className="navbar">
        <a href="#" className="nav-logo">
          A.G<span className="accent-dot">.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#third-section">Work</a></li>
          <li><a href="#second-section" onClick={handleAboutClick}>About</a></li>
          <li><a href="#footer" onClick={handleContactClick}>Contact</a></li>
        </ul>
      </nav>
    </>
  );
}
