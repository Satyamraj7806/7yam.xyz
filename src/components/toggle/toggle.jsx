import { useState, useEffect, useRef, useCallback } from "react";
import "./toggle.css";

const ThemeSwitch = () => {
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const tRef = useRef(0);
  const glowPhaseRef = useRef(0);

  /* ── apply theme to document ── */
  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", active);
  }, [active]);

  /* ── canvas setup & resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── particle + aurora render loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      tRef.current += 16;
      glowPhaseRef.current += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* aurora bands — only when active */
      if (active) {
        const t = tRef.current;
        const bands = [
          { hue: 270, y: canvas.height * 0.12, amp: 32, speed: 0.0008 },
          { hue: 200, y: canvas.height * 0.22, amp: 24, speed: 0.0011 },
          { hue: 300, y: canvas.height * 0.08, amp: 18, speed: 0.0006 },
        ];
        for (const b of bands) {
          ctx.beginPath();
          for (let x = 0; x <= canvas.width; x += 4) {
            const wave =
              b.amp * Math.sin(x * 0.008 + t * b.speed * 1000) +
              10 * Math.sin(x * 0.02 + t * b.speed * 700);
            const y = b.y + wave;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          const grad = ctx.createLinearGradient(0, b.y - b.amp, 0, b.y + b.amp + 50);
          grad.addColorStop(0, `hsla(${b.hue},80%,65%,0)`);
          grad.addColorStop(0.3, `hsla(${b.hue},80%,65%,0.2)`);
          grad.addColorStop(0.6, `hsla(${b.hue + 30},90%,75%,0.15)`);
          grad.addColorStop(1, `hsla(${b.hue},80%,65%,0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 28 + 18 * Math.sin(t * 0.0009);
          ctx.stroke();
        }
      }

      /* particles */
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.life -= p.decay;

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++)
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          ctx.strokeStyle = `hsla(${p.hue},90%,75%,${p.life * 0.3})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.size * p.life), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,85%,${p.life})`;
        ctx.fill();
      }

      /* ambient orbit particles when active */
      if (active && Math.random() < 0.06) {
        const moonEl = document.querySelector(".moon-disc");
        if (moonEl) {
          const r = moonEl.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const a = Math.random() * Math.PI * 2;
          const radius = 30 + Math.random() * 8;
          particlesRef.current.push({
            x: cx + Math.cos(a) * radius,
            y: cy + Math.sin(a) * radius,
            vx: Math.cos(a) * 0.25,
            vy: Math.sin(a) * 0.25 - 0.4,
            life: 0.7,
            decay: 0.014,
            size: 1 + Math.random() * 2,
            hue: 260 + Math.random() * 80,
            trail: [],
          });
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  /* ── burst particles on click ── */
  const spawnBurst = useCallback(() => {
    const moonEl = document.querySelector(".moon-disc");
    if (!moonEl) return;
    const r = moonEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3.5;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life: 1,
        decay: 0.014 + Math.random() * 0.018,
        size: 1.5 + Math.random() * 3.5,
        hue: active ? 40 + Math.random() * 30 : 260 + Math.random() * 70,
        trail: [],
      });
    }
  }, [active]);

  const handleClick = () => {
    spawnBurst();
    setActive((v) => !v);
  };

  return (
    <>
      <canvas ref={canvasRef} className="moon-toggle-canvas" />

      <div className={`moon-toggle${active ? " active" : ""}`} onClick={handleClick}>
        <div className="moon-disc">
          {/* craters */}
          <div className="crater" style={{ width: 10, height: 10, top: 11, left: 14 }} />
          <div className="crater" style={{ width: 6,  height: 6,  top: 26, left: 31 }} />
          <div className="crater" style={{ width: 5,  height: 5,  top: 18, left: 9  }} />
          <div className="crater" style={{ width: 7,  height: 7,  top: 36, left: 18 }} />
          <div className="crater" style={{ width: 4,  height: 4,  top: 10, left: 36 }} />

          {/* spinning rune ring */}
          <svg className="rune-ring" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
            <circle cx="42" cy="42" r="38" fill="none" stroke="rgba(180,140,255,0.25)" strokeWidth="0.5" strokeDasharray="3 5" />
            {[0,45,90,135,180,225,270,315].map((deg, i) => (
              <g key={i} transform={`rotate(${deg},42,42)`}>
                <line x1="42" y1="3" x2="42" y2="10" stroke="rgba(200,160,255,0.65)" strokeWidth="1.1" strokeLinecap="round"/>
                <line x1="39" y1="6" x2="45" y2="6" stroke="rgba(200,160,255,0.65)" strokeWidth="1.1" strokeLinecap="round"/>
              </g>
            ))}
            {["ᚨ","ᚱ","ᚾ","ᛁ","ᛊ","ᛏ","ᛒ","ᛗ"].map((rune, i) => (
              <text
                key={i}
                transform={`rotate(${i * 45 + 22.5},42,42) translate(42,4)`}
                textAnchor="middle"
                fill="rgba(210,180,255,0.8)"
                fontSize="6"
                fontFamily="serif"
              >
                {rune}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
};

export default ThemeSwitch;