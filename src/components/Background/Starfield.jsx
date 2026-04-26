import { useEffect, useRef } from "react";

// ============================================================
//  STARFIELD — SETTINGS
// ============================================================
const SETTINGS = {
  // --- STARS ---
  numStars:          200,

  numArms:           3,
  spiralTightness:   0.045,
  tilt:              0.45,
  galaxySize:        0.35,
  idleRotationSpeed: 0.0002,

  // --- TRANSITION ---
  warpStart:         80,     // scroll px where transition begins
  warpFull:          100,    // scroll px where starfield is fully active
  transitionEase:    0.05,   // lerp smoothness (lower = slower blend)

  // --- STARFIELD SPEED ---
  idleSpeed:         1.5,   // drift speed with no input
  boostSpeed:        2.5,    // speed on mouse move / scroll
  boostDecay:        0.88,   // how fast boost fades

  // --- VISUALS ---
  trailAlpha:        40,
  minStarAlpha:      80,
  maxStarAlpha:      255,
  starWeight:        1.5,
};
// ============================================================

let _ctx         = null;
let _W           = 0;
let _H           = 0;
let _galaxyStars = [];   // flat 2D galaxy dots
let _warpStars   = [];   // 3D perspective starfield
let _scrollY     = 0;
let _boost       = 0;
let _progress    = 0;    // 0 = full galaxy, 1 = full starfield
let _galaxyAngle = 0;
let _rafId       = null;
// Mouse tilt for galaxy
let _mouseX      = 0;    // normalised -1 to 1
let _mouseY      = 0;
let _tiltX       = 0;    // smoothed tilt
let _tiltY       = 0;

// ── Galaxy Star (2D spiral) ────────────────────────────────
class GalaxyStar {
  constructor(index) {
    this.index     = index;
    this.dist      = Math.random() * _W * SETTINGS.galaxySize;
    this.baseAngle = Math.random() * Math.PI * 2;
    this.size      = Math.random() * 1.5 + 0.3;
    this.brightness = Math.random() * 0.5 + 0.5;
    this._calcPos();
  }

  _calcPos() {
    const armAngle = (Math.PI * 2 / SETTINGS.numArms) * (this.index % SETTINGS.numArms);
    const spiral   = this.dist * SETTINGS.spiralTightness;
    const angle    = armAngle + spiral + this.baseAngle + _galaxyAngle;
    // _tiltX/Y nudge the galaxy so it softly follows the mouse
    this.x = _W / 2 + Math.cos(angle) * this.dist + _tiltX * 60;
    this.y = _H / 2 + Math.sin(angle) * this.dist * SETTINGS.tilt + _tiltY * 30;
  }

  update() {
    this._calcPos();
  }

  draw(alpha) {
    const a = this.brightness * alpha;
    _ctx.fillStyle = "rgba(255,255,255," + a + ")";
    _ctx.beginPath();
    _ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    _ctx.fill();
  }
}

// ── Warp Star (3D perspective) ─────────────────────────────
class WarpStar {
  constructor() {
    this._place();
  }

  _place() {
    this.x  = (Math.random() - 0.5) * _W * 2;
    this.y  = (Math.random() - 0.5) * _H * 2;
    this.z  = Math.random() * _W;
    this.pz = this.z;
  }

  _respawn() {
    this.x  = (Math.random() - 0.5) * _W * 2;
    this.y  = (Math.random() - 0.5) * _H * 2;
    this.z  = _W;
    this.pz = this.z;
  }

  update(speed) {
    this.pz = this.z;
    this.z -= speed;
    if (this.z <= 0) this._respawn();
  }

  draw(alpha) {
    const sx  = (this.x  / this.z)  * _W + _W / 2;
    const sy  = (this.y  / this.z)  * _H + _H / 2;
    const spx = (this.x  / this.pz) * _W + _W / 2;
    const spy = (this.y  / this.pz) * _H + _H / 2;

    if (sx < -20 || sx > _W + 20 || sy < -20 || sy > _H + 20) {
      this._respawn();
      return;
    }

    const t      = 1 - this.z / _W;
    const a      = alpha * (SETTINGS.minStarAlpha / 255 + t * (SETTINGS.maxStarAlpha - SETTINGS.minStarAlpha) / 255);
    const r      = Math.max(0.4, t * 1.8);
    const dx     = sx - spx;
    const dy     = sy - spy;
    const trail  = Math.hypot(dx, dy);

    _ctx.strokeStyle = "rgba(255,255,255," + a + ")";
    _ctx.lineWidth   = r * SETTINGS.starWeight;
    _ctx.beginPath();

    if (trail < 0.5) {
      _ctx.fillStyle = "rgba(255,255,255," + a + ")";
      _ctx.arc(sx, sy, r, 0, Math.PI * 2);
      _ctx.fill();
    } else {
      _ctx.moveTo(spx, spy);
      _ctx.lineTo(sx,  sy);
      _ctx.stroke();
    }
  }
}

window.Starfield = {
  updateScroll(px) {
    _scrollY = px;
    _boost   = 1.0;
  },

  setup(config) {
    const canvas = config.canvas;
    if (!canvas) return;

    _W = window.innerWidth;
    _H = window.innerHeight;
    canvas.width  = _W;
    canvas.height = _H;
    _ctx = canvas.getContext("2d");

    _scrollY     = 0;
    _boost       = 0;
    _progress    = 0;
    _galaxyAngle = 0;

    // Build both star pools
    _galaxyStars = [];
    _warpStars   = [];
    for (let i = 0; i < SETTINGS.numStars; i++) {
      _galaxyStars.push(new GalaxyStar(i));
      _warpStars.push(new WarpStar());
    }

    function draw() {
      _rafId = requestAnimationFrame(draw);

      _ctx.fillStyle = "rgba(0,0,0," + (SETTINGS.trailAlpha / 255) + ")";
      _ctx.fillRect(0, 0, _W, _H);

      // Smooth progress
      const targetProgress = Math.max(0, Math.min(1,
        (_scrollY - SETTINGS.warpStart) / (SETTINGS.warpFull - SETTINGS.warpStart)
      ));
      _progress    += (targetProgress - _progress) * SETTINGS.transitionEase;
      _galaxyAngle += SETTINGS.idleRotationSpeed;
      _boost       *= SETTINGS.boostDecay;

      // Smooth mouse tilt for galaxy
      _tiltX += (_mouseX - _tiltX) * 0.04;
      _tiltY += (_mouseY - _tiltY) * 0.04;

      const galaxyAlpha = 1 - _progress;   // galaxy fades out
      const warpAlpha   = _progress;        // starfield fades in

      if (galaxyAlpha > 0.01) {
        for (let i = 0; i < _galaxyStars.length; i++) {
          _galaxyStars[i].update();
          _galaxyStars[i].draw(galaxyAlpha);
        }
      }

      if (warpAlpha > 0.01) {
        const speed = SETTINGS.idleSpeed + _boost * (SETTINGS.boostSpeed - SETTINGS.idleSpeed);
        for (let i = 0; i < _warpStars.length; i++) {
          _warpStars[i].update(speed);
          _warpStars[i].draw(warpAlpha);
        }
      }
    }

    if (_rafId) cancelAnimationFrame(_rafId);
    draw();

    function onResize() {
      _W = window.innerWidth;
      _H = window.innerHeight;
      canvas.width  = _W;
      canvas.height = _H;
      _galaxyStars = [];
      _warpStars   = [];
      for (let i = 0; i < SETTINGS.numStars; i++) {
        _galaxyStars.push(new GalaxyStar(i));
        _warpStars.push(new WarpStar());
      }
    }

    function onMouseMove(e) {
      _mouseX = (e.clientX / _W - 0.5) * 2;
      _mouseY = (e.clientY / _H - 0.5) * 2;
      if (_progress > 0.05) _boost = 1.0;
    }

    window.addEventListener("resize",    onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    config._cleanup = () => {
      cancelAnimationFrame(_rafId);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }
};

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const config = { canvas: canvasRef.current };

    function onScroll() {
      window.Starfield.updateScroll(window.scrollY);
    }

    window.Starfield.setup(config);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (config._cleanup) config._cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        background:    "#000",
        zIndex:        0,
        display:       "block",
        pointerEvents: "none",
      }}
    />
  );
}