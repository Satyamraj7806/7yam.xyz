import React from 'react';
import './footer.css';

const Footer = () => {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset if you have a sticky header (change 0 to your header height if needed)
      const offset = 0; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="site-footer">
      <div className="animated-top-border"></div>
      
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-name">SATYAM RAJ</h2>
            <div className="status-box">
              <span className="pulse-dot"></span>
              <span className="status-text">CORE_SYSTEM_ONLINE</span>
            </div>
            <p className="footer-description">
              Computer Science Student <span className="dim">//</span> Cybersecurity <br/>
              Building open-source tools on Linux.
            </p>
          </div>

          <div className="footer-nav">
            <div className="nav-col">
              <span className="nav-label">DIRECTORY</span>
              
              <a href="#projects" onClick={(e) => scrollToSection(e, 'projects-section')}>PROJECTS</a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'photos-section')}>PHOTOGRAPHY</a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about-section')}>ABOUT</a>

            </div>

            <div className="nav-col">
              <span className="nav-label">CONNECT</span>
              <a href="#linktree" onClick={() => window.open('https://linktr.ee/Satyamraj78', '_blank')}>LINKTREE</a>
              <a href="https://github.com/Satyamraj7806" target="_blank" rel="noreferrer">GITHUB</a>
              <a href="https://www.linkedin.com/in/satyam-raj-b07813317/" target="_blank" rel="noreferrer">LINKEDIN</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="legal-left"></div>
          <div className="made-with-center">
            MADE WITH <span className="heart-icon">❤️</span> BY SATYAM
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;