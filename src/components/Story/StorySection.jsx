import React, { useEffect, useRef, useState } from 'react';
import './StorySection.css';

function CoronaCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 160 }, () => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 120 + Math.random() * 220;
      return {
        angle,
        radius,
        speed:  (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        size:   Math.random() * 1.4 + 0.2,
        alpha:  Math.random() * 0.6 + 0.1,
        drift:  Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.01 + 0.003,
      };
    });

    const draw = () => {
      t += 1;
      const cx = canvas.width  / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      grad.addColorStop(0,   'rgba(255,255,255,0.018)');
      grad.addColorStop(0.4, 'rgba(180,210,255,0.010)');
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 320, 180, 0, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 3; i++) {
        const phase = ((t * 0.4 + i * 120) % 360) / 360;
        const r = phase * 260;
        const alpha = (1 - phase) * 0.12;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.6, r * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles.forEach(p => {
        p.angle += p.speed;
        const driftY = Math.sin(t * p.driftSpeed + p.drift) * 18;
        const x = cx + Math.cos(p.angle) * p.radius * 1.5;
        const y = cy + Math.sin(p.angle) * p.radius * 0.55 + driftY;

        ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.abs(Math.sin(t * 0.008 + p.drift)));
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="corona-canvas" />;
}

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 70, startDelay = 300) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function useScramble(finalText, startDelay = 900) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*';
  const [output, setOutput]   = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => {
      setVisible(true);
      let iteration = 0;
      const total   = finalText.length * 6; // 6 scramble frames per char

      const interval = setInterval(() => {
        setOutput(
          finalText.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < Math.floor(iteration / 6)) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        iteration++;
        if (iteration > total) { setOutput(finalText); clearInterval(interval); }
      }, 40);

      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(t0);
  }, [finalText, startDelay]);

  return { output, visible };
}

export default function StorySection() {
  const { displayed: greeting, done: greetingDone } = useTypewriter('Hiii,  I am', 80, 200);
  const { output: name, visible: nameVisible }       = useScramble('SATYAM RAJ', 1200);

  const bioTags = [
    'CSE Student',
    'CyberSecurity',
    'Development',
    'Photography & Cinematography',
  ];

  return (
    <div className="story-wrapper">

      <section className="hero-section">

        <CoronaCanvas />

        <div className="greeting-line" aria-label="Hiii, I am">
          {greeting}
          {!greetingDone && <span className="cursor">|</span>}
        </div>

        <div className={`name-wrapper ${nameVisible ? 'name-visible' : ''}`}>

          <h1 className="name-ghost name-ghost--r" aria-hidden="true">{name}</h1>
          <h1 className="name-ghost name-ghost--b" aria-hidden="true">{name}</h1>

          <h1 className="name-main">{name}</h1>

          <div className="name-ping" />
          <div className="name-ping name-ping--2" />
        </div>

        <div className="aka-line">aka Sattuuu</div>

        <div className="bio-tags">
          {bioTags.map((tag, i) => (
            <span
              key={tag}
              className="bio-tag"
              style={{ animationDelay: `${1.8 + i * 0.15}s` }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="scroll-hint">
          <div className="scroll-dot" />
        </div>

      </section>

      <section className="full-page" id='about-section'>
        <div className="about-card">
          <div className="about-card-corner about-card-corner--tl" />
          <div className="about-card-corner about-card-corner--tr" />
          <div className="about-card-corner about-card-corner--bl" />
          <div className="about-card-corner about-card-corner--br" />

          <h2 className="about-heading">About Me</h2>
          <div className="about-para">
            <p>
              I'm <strong>Satyam</strong>. I'm a Computer Science student, working around cybersecurity.
              <br /><br />
              Most of my work is done on Linux, and I prefer using open-source tools over closed systems.
              The FOSS approach makes more sense to me — being able to see, modify, and actually understand
              what's going on instead of just using things blindly.
              <br /><br />
              <strong>Development</strong> comes in as a way to build and test ideas, not just for the sake of it.
              I'm still figuring things out, learning as I go, and refining my approach through trial and error.
              <br /><br />
              Outside of this, I also work on <strong>photography</strong> and <strong>cinematography</strong>.
              <br /><br />
              Still figuring things out, but that's the whole point {':)'}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}