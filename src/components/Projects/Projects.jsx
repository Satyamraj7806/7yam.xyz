import './Projects.css';
import { useRef, useState, useEffect } from "react";

const projects = [
  {
    id: 1,
    title: "CatNet",
    desc: "Network reconnaissance framework for advanced penetration testing",
    tags: ["Python", "Nmap", "Security"],
    image: "./catnet.png",
    github: "https://github.com/Satyamraj7806/CatNet"
  },
  {
    id: 2,
    title: "IoT Dashboard",
    desc: "Real-time sensor system with live data visualization",
    tags: ["Flask", "SocketIO", "React"],
    image: "./Iot-dashboard.png",
    github: "https://github.com/Satyamraj7806/Smartphone-Surveillance-IoT-Suite"
  },
  {
    id: 3,
    title: "Strevo",
    desc: "E-Commerce Marketplace",
    tags: ["Java", "MySQL", "HTML"],
    image: "https://opengraph.githubassets.com/1/Satyamraj7806/E-Commerece-Marketplace",
    github: "https://github.com/Satyamraj7806/E-Commerece-Marketplace"
  },
  {
    id: 4,
    title: "Virtual Assistant",
    desc: " AI voice assistant built with Python. It can answer your questions using OpenAI's GPT.",
    tags: ["Python", "TensorFlow", "NLP"],
    image: "https://opengraph.githubassets.com/1/Satyamraj7806/BLACK-WIDOW-VIRTUAL-ASSISTANT",
    github: "https://github.com/Satyamraj7806/BLACK-WIDOW-VIRTUAL-ASSISTANT"
  },
  {
    id: "more",
    title: "More Projects",
    desc: "Explore all my work on GitHub",
    tags: ["GitHub", "Open Source"],
    isMoreCard: true
  }
];

export default function ProjectSlider() {
  const sliderRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollWidth, clientWidth } = sliderRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const progress =
        scrollWidth - clientWidth > 0
          ? (scrollLeft / (scrollWidth - clientWidth)) * 100
          : 0;
      setScrollProgress(progress);
    }
  };

  const scrollToNext = () => {
    sliderRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section className="projects-section" id='projects-section'>

      <div className="about-card">

        {/* SAME CORNERS */}
        <div className="project-card-corner project-card-corner--tl" />
        <div className="project-card-corner project-card-corner--tr" />
        <div className="project-card-corner project-card-corner--bl" />
        <div className="project-card-corner project-card-corner--br" />

        {/* HEADER */}
        <div className="projects-header">
          <h2 className="projects-title">Projects</h2>
          <a
            href="https://github.com/Satyamraj7806"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all-link"
          >
            view all →
          </a>
        </div>

        {/* SLIDER */}
        <div className="scroll-container-wrapper">
          <div
            className="project-track"
            ref={sliderRef}
            onScroll={handleScroll}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${project.isMoreCard ? 'more-card' : ''}`}
                onClick={() => {
                  if (project.isMoreCard) {
                    window.open("https://github.com/Satyamraj7806", "_blank");
                  } else {
                    window.open(project.github, "_blank");
                  }
                }}
              >
                {!project.isMoreCard && (
                  <div className="project-image-wrapper">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}

                <div className="card-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>

                  <div className="tag-list">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PROGRESS BAR */}
          {canScroll && (
            <div className="scroll-indicator-wrapper">
              <div
                className="scroll-progress-bar"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <a
          href="https://github.com/Satyamraj7806"
          target="_blank"
          rel="noopener noreferrer"
          className="projects-subtitle"
        >
          Visit my GitHub
        </a>

        {/* ARROW */}
        {canScroll && (
          <button className="scroll-arrow-btn" onClick={scrollToNext}>
            →
          </button>
        )}

      </div>
    </section>
  );
}