import { useState, useRef, useEffect } from "react";
import { educationBg as bg } from '../assets/assets';
import { useIsMobile } from '../hooks/useIsMobile';

const projectsData = [
  {
    id: 1,
    title: "Dev Portfolio - UI/UX Designer",
    tags: ["HTML", "CSS", "Javascript"],
    description: "A personal portfolio website showcasing UI/UX design work and skills.",
    category: "WEB DEVELOPMENT",
    imageFallbackColor: "#e5e7eb", // Light gray
  },
  {
    id: 2,
    title: "AI-Powered Calculator",
    tags: ["Python", "Tkinter"],
    description: "A Python-based calculator utilizing Tkinter and Ai features.",
    category: "AI & ML",
    imageFallbackColor: "#5ab4c5", // Teal/cyan to match mockup feeling
  },
  {
    id: 3,
    title: "C Matrix Project",
    tags: ["C"],
    description: "A C program that performs matrix multiplication and prints the result in a matrix format.",
    category: "PROGRAMMING",
    imageFallbackColor: "#1f2937", // Dark gray/black terminal look
  }
];

function useAnimatedFilter(items: typeof projectsData, filter: string) {
  const [visibleItems, setVisibleItems] = useState(
    items.map(i => ({ ...i, state: "visible" }))
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const filtered = filter === "ALL" ? items : items.filter(i => i.category === filter);

    // Skip animation on the very first mount so it doesn't glitch on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setVisibleItems(filtered.map(item => ({ ...item, state: "visible" })));
      return;
    }

    // Filter items immediately so the grid layout resolves instantly, achieving smoothness without empty gaps
    setVisibleItems(
      filtered.map(item => ({ ...item, state: "entering" }))
    );

    timeoutRef.current = setTimeout(() => {
      setVisibleItems(
        filtered.map(item => ({ ...item, state: "visible" }))
      );
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return visibleItems;
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filters = ["ALL", "WEB DEVELOPMENT", "AI & ML", "PROGRAMMING"];

  const visibleProjects = useAnimatedFilter(projectsData, activeFilter);
  const isMobile = useIsMobile();

  return (
    <>
      <style>{`
        .project-card {
          transition:
            opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1) !important;
        }

        .project-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .project-card.entering {
          opacity: 0;
          transform: translateY(16px) scale(0.97);
          animation: cardIn 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .project-card.exiting {
          opacity: 0;
          transform: translateY(-10px) scale(0.96);
          pointer-events: none;
        }

        @keyframes cardIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      
      <div
        style={{
          position: 'relative',
          zIndex: 0,
          width: '100%',
          height: 'calc(100vh - 80px)',
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center", // Center vertically when it fits
          padding: isMobile ? "1rem 5% 1rem" : "1rem 12% 1rem",
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          fontFamily: "'Noto Serif JP', serif",
          overflowY: 'auto'
        }}
      >
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          
          {/* Header section */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "5px" }}>
              <div style={{ width: "20px", height: "2px", backgroundColor: "#3b5bdb" }} />
              <span
                style={{
                  color: "#3b5bdb",
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                }}
              >
                05
              </span>
            </div>
            <h2
              style={{
                fontSize: isMobile ? "2rem" : "2.8rem",
                fontFamily: "'Zen Brush Old Mincho', serif",
                color: "#374151",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              My Projects
            </h2>
          </div>

          {/* Filter Bar */}
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "1.5rem",
            flexWrap: "wrap"
          }}>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  background: activeFilter === filter ? "#4b6cba" : "transparent",
                  color: activeFilter === filter ? "#fff" : "#4b5563",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(min(100%, 260px), 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
            width: "100%"
          }} >
            {visibleProjects.map((project, i) => (
              <div
                key={project.id}
                className={`project-card ${project.state}`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  animationDelay: project.state === "entering" ? `${i * 35}ms` : "0ms",
                }}
              >
                {/* Image Placeholder */}
                <div style={{
                  height: "130px",
                  width: "100%",
                  backgroundColor: project.imageFallbackColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                  [Image Placeholder]
                </div>

                {/* Card Content */}
                <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{
                    margin: "0 0 0.8rem 0",
                    fontSize: "1.1rem",
                    color: "#111827",
                    fontWeight: 600
                  }}>
                    {project.title}
                  </h3>
                  
                  {/* Tags */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.06)",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "#4b5563",
                    lineHeight: 1.4,
                    paddingBottom: "0.5rem",
                  }}>
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
