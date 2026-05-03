import { useEffect, useRef } from "react";
import "./footer.css";

/* ── Star canvas ── */
const StarCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.002,
    }));

    const draw = (t) => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Constellation lines */
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = (stars[i].x - stars[j].x) * W;
          const dy = (stars[i].y - stars[j].y) * H;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.globalAlpha = (1 - d / 90) * 0.18;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(stars[i].x * W, stars[i].y * H);
            ctx.lineTo(stars[j].x * W, stars[j].y * H);
            ctx.stroke();
          }
        }
      }

      /* Stars */
      stars.forEach(s => {
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = pulse * 0.7;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
};

const NAV = [
  {
    label: "Navigate",
    links: [
      { name: "About", href: "#about" },
      { name: "Projects", href: "#projects" },
      { name: "Photos", href: "#photos" },
      { name: "Contact", href: "#contact" },
    ]
  },
  {
    label: "Connect",
    links: [
      { name: "Linktree", href: "https://linktr.ee/Satyamraj78" },
      { name: "GitHub", href: "https://github.com/Satyamraj7806" },
      { name: "Twitter", href: "https://x.com/SRAJ43187397" },
      { name: "Email", href: "mailto:0786satyamraj@gmail.com" },
    ]
  },
  
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Star canvas removed - shows starfield background */}
      <div className="animated-top-border" />

      <div className="footer-container" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Main row ── */}
        <div className="footer-content">

          {/* Brand */}
          <div className="footer-brand">
            <p className="footer-name">Satyam Raj</p>

            <div className="status-box">
              <span className="pulse-dot" />
              <span className="status-text">Open to opportunities</span>
            </div>

            <p className="footer-description">
              CSE student <br /> CyberSecurity <br />Photography & Cinematography<br />
              Delhi, India.
            </p>
          </div>

          <nav className="footer-nav">
            {NAV.map(col => (
              <div className="nav-col" key={col.label}>
                <span className="nav-label">{col.label}</span>
                <ul>
                  {col.links.map(l => (
                    <li key={l.name}>
                      <a href={l.href}>{l.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {year} Satyam Raj</span>



          <div className="footer-container">
            <span className="footer-made">
              Made with <span className="footer-heart">♥</span> by Satyam
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}