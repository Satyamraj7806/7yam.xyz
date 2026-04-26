import React from 'react';
import './Contact.css';

const Contact = () => {
  const socials = [
    { name: 'Linktree', link: 'https://linktr.ee/Satyamraj78', icon: 'M13.5 10.5L21 3M16 3H21V8M13.5 13.5L21 21M16 21H21V16M10.5 13.5L3 21M8 21H3V16M10.5 10.5L3 3M8 3H3V8' },
    { name: 'Email', link: 'mailto:your@email.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'GitHub', link: 'https://github.com/Satyamraj7806', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
    { name: 'Telegram', link: 'https://t.me/Flimdyseed', icon: 'M21 5L2 12.5l7 1L21 5l-11 10.5 8.5 3.5L21 5z' },
    { name: 'LinkedIn', link: 'https://www.linkedin.com/in/satyam-raj-b07813317/', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z' },
    { name: 'PicoCTF', link: 'https://play.picoctf.org/users/Satyam__78', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
    { name: 'X', link: 'https://x.com/SRAJ43187397', icon: 'M4 4l11.7 16H20L8.3 4H4zm0 16l6.4-6.4M13.6 10.4L20 4' },
    { name: 'Instagram', link: 'https://www.instagram.com/Satyamframes_', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01' },
  ];

  return (
    <section className="contact-section">
      <div className="contact-glass-container">
        <div className="corner corner--tl" />
        <div className="corner corner--tr" />
        <div className="corner corner--bl" />
        <div className="corner corner--br" />

        <div className="contact-header">
          <h2 className="contact-title">CONTACT</h2>
          <span className="tech-subtitle">// ESTABLISH_CONNECTION</span>
        </div>

        <div className="contact-grid">
          {socials.map((social, i) => (
            <a key={i} href={social.link} target="_blank" rel="noreferrer" className="contact-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="contact-icon">
                <path d={social.icon}></path>
              </svg>
              <span className="contact-label">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;