import { useRef, useState } from "react";
import "./Photos.css";

const INSTAGRAM_PAGE = "https://www.instagram.com/satyamframes_/";

const photos = [
  {
    id: 1,
    image: "./allphotos/safdarjung5.jpeg",
    link: "https://www.instagram.com/satyamframes_/p/DTfOWVkDQZ-/",
    frame: "A-001"
  },
  {
    id: 2,
    image: "/./allphotos/wildlife1.jpeg",
    link: "https://www.instagram.com/satyamframes_/p/DXhRwXjGdCk/",
    frame: "B-002"
  },
  {
    id: 3,
    image: "./allphotos/thumbnail1.png",
    link: "https://www.instagram.com/satyamframes_/reel/DQZZ-hJkofl/",
    frame: "C-003"
  },
  {
    id: 4,
    image: "./allphotos/nature3.jpeg",
    link: "https://www.instagram.com/satyamframes_/p/DUfZNamEpbx/",
    frame: "D-004"
  },
  {
    id: 5,
    image: "./allphotos/aarti4.jpeg",
    link: "https://www.instagram.com/satyamframes_/p/DWJI8NemVeX/",
    frame: "E-005"
  }
];

const PhotosSlider = () => {
  const sliderRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tilts, setTilts] = useState({});

  const handleScroll = () => {
    const el = sliderRef.current;
    const progress = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
    setScrollProgress(isNaN(progress) ? 0 : progress);
  };

  const scrollNext = () => {
    sliderRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY =  ((x - cx) / cx) * 9;
    const rotX = -((y - cy) / cy) * 6;
    setTilts(prev => ({ ...prev, [id]: { rotX, rotY } }));
  };

  const handleMouseLeave = (id) => {
    setTilts(prev => ({ ...prev, [id]: { rotX: 0, rotY: 0 } }));
  };

  return (
    <div className="photo-wrapper">

      {/* Glass container — arrow is anchored here */}
      <div className="photo-glass">

        {/* Corner brackets */}
        <div className="photo-corner photo-corner--tl" />
        <div className="photo-corner photo-corner--tr" />
        <div className="photo-corner photo-corner--bl" />
        <div className="photo-corner photo-corner--br" />

        {/* ── Header row — title left, Instagram link right ── */}
        <div className="photo-header">
          <h2 className="photo-title">Photography</h2>
          <a
            href={INSTAGRAM_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="photo-view-all"
          >
            view on instagram →
          </a>
        </div>

        {/* ── Scroll track ── */}
        <div
          className="photo-track"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {photos.map((photo, index) => {
            const tilt = tilts[photo.id] || { rotX: 0, rotY: 0 };
            const isActive = !!(tilt.rotX || tilt.rotY);

            return (
              <div
                key={photo.id}
                className={`photo-card ${index === 0 ? "featured" : ""}`}
                style={{
                  transform: `perspective(900px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale(${isActive ? 1.05 : 1})`
                }}
                onClick={() => window.open(photo.link, "_blank")}
                onMouseMove={(e) => handleMouseMove(e, photo.id)}
                onMouseLeave={() => handleMouseLeave(photo.id)}
              >
                <div className="photo-image-wrap">
                  <img src={photo.image} alt="" />
                </div>
                <div className="photo-overlay" />
                <div className="photo-liquid" />
                <div className="photo-scanlines" />
                <div className="photo-vf" />
                <div className="photo-vf-br" />
                <div className="photo-frame-num">{photo.frame}</div>
              </div>
            );
          })}

          {/* Explore more card at end of track */}
          <div
            className="photo-card view-all-card"
            onClick={() => window.open(INSTAGRAM_PAGE, "_blank")}
          >
            <div className="view-all-content">
              <span>View all</span>
              <div className="view-all-arrow">→</div>
            </div>
          </div>
        </div>

        {/* Progress bar — inside glass, below track */}
        <div className="photo-progress">
          <div style={{ width: `${scrollProgress}%` }} />
        </div>

        <a
          href="https://www.instagram.com/satyamframes_/"
          target="_blank"
          rel="noopener noreferrer"
          className="projects-subtitle"
        >
          Visit my Instagram
        </a>

        {/* Arrow — absolute to .photo-glass, positioned at right-center of the TRACK */}
        <button className="photo-arrow" onClick={scrollNext} aria-label="Scroll photos">
          →
        </button>

      </div>
    </div>
  );
};

export default PhotosSlider;