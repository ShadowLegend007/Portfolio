import { useState, useEffect, useRef } from "react";
import { homeBg as bg } from '../assets/assets';

const spinOnceStyle = `
  @keyframes spinOnce {
    from { transform: rotate(45deg) scale(1.25); }
    to   { transform: rotate(405deg) scale(1.25); }
  }
`;

const experienceData = [
  {
    id: 1,
    period: "Feb 2026",
    company: "VINCENZO'S ITALIAN ICE",
    role: "Freelance Web Developer",
    description: "Recreated the brand’s website with integrated online ordering functionality for direct customer purchases.",
  },
  {
    id: 2,
    period: "Jan 2026",
    company: "CODE CRAFTERS – PERCEPTRON (RKMVERI)",
    role: "Hackathon - Finalist – EDUHUB",
    description: "Built a platform where students can upload books, teachers can share study materials, and users can interact via a global chat system.",
  },
  {
    id: 3,
    period: "Jan 2026",
    company: "IIT GUWAHATI HACKATHON",
    role: "Participant – Food Incognito",
    description: "Developed an application that analyzes ingredients of packaged food products to provide user insights.",
  },
  {
    id: 4,
    period: "Jul 2025 – Nov 2025",
    company: "IIT BOMBAY TECHFEST",
    role: "Campus Ambassador Intern",
    description: "Conducted Techfest workshops and zonal events, and assisted in organizing technical sessions and outreach programs.",
  },
  {
    id: 5,
    period: "Jul 2025",
    company: "APTOS – My First Blockchain Hackathon",
    role: "Participant – Plagiarism Checker with Blockchain Certification",
    description: "Developed a plagiarism detection system using Python integrated with Aptos blockchain for secure certification.",
  },
  {
    id: 6,
    period: "May 2025",
    company: "AIGNITE",
    role: "Finalist – Customer Feedback Analysis AI",
    description: "Developed an AI model using Python and NLP techniques to analyze customer feedback and extract insights.",
  },
  {
    id: 7,
    period: "Jan 2025",
    company: "DeepThink Hackathon by RKMVERI",
    role: "Finalist (4th Position) - Sales Forecasting",
    description: "Developed an AI model using Python libraries",
  }
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function TimelineEntry({ entry, index }: { entry: typeof experienceData[0], index: number }) {
  const [ref, inView] = useInView(0.15);
  const [hovered, setHovered] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSpinning(false);
    requestAnimationFrame(() => {
      setSpinKey((k) => k + 1);
      setIsSpinning(true);
    });
    timerRef.current = setTimeout(() => {
      setIsSpinning(false);
    }, 650);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const diamondStyle = {
    width: "14px",
    height: "14px",
    backgroundColor: hovered ? "#3b5bdb" : "#4b5563",
    marginTop: "4px",
    flexShrink: 0,
    boxShadow: hovered
      ? "0 0 0 5px rgba(59,91,219,0.2)"
      : "0 0 0 0px rgba(59,91,219,0)",
    transition: "background-color 0.35s ease, box-shadow 0.3s ease",
    ...(isSpinning
      ? { animation: "spinOnce 0.6s cubic-bezier(0.4,0,0.2,1) forwards" }
      : { transform: "rotate(45deg)" }),
  };

  return (
    <>
      <style>{spinOnceStyle}</style>
      <div
        ref={ref}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0,
          position: "relative",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0px)" : "translateY(40px)",
          transition: `opacity 0.7s ease ${index * 0.18}s, transform 0.7s ease ${index * 0.18}s`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Diamond Marker */}
        <div
          style={{
            flexShrink: 0,
            width: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{
            position: 'absolute',
            width: '28px',
            height: '28px',
            backgroundColor: 'rgba(255,255,255,0.4)',
            top: '-3px',
            left: 'calc(1rem - 14px)',
            transform: 'rotate(45deg)',
            zIndex: -1,
            backdropFilter: 'blur(2px)'
          }}></div>
          <div key={spinKey} style={diamondStyle} />
        </div>

        {/* Content */}
        <div
          style={{
            paddingBottom: "4rem",
            paddingLeft: "1.5rem",
            flex: 1,
            transform: hovered ? "translateX(8px)" : "translateX(0px)",
            transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}>
            {/* Date Badge */}
            <div
              style={{
                display: "inline-block",
                marginBottom: "1rem",
                backgroundColor: hovered ? "#3b5bdb" : "#4b5563",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                padding: "6px 20px 6px 14px",
                borderRadius: "2px",
                transition: "background-color 0.35s ease",
                WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath d='M0,2 Q100,0 180,5 Q200,20 170,35 Q100,40 0,38 Z' fill='white'/%3E%3C/svg%3E\")",
                WebkitMaskSize: "100% 100%",
              }}
            >
              {entry.period}
            </div>

            {/* Company / Title */}
            <h3
              style={{
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "0.5rem",
                marginTop: 0,
                fontSize: "1.1rem",
                letterSpacing: "0.02em",
                color: "#111827",
                lineHeight: 1.3,
              }}
            >
              {entry.company}
            </h3>

            {/* Role */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div
                style={{
                  width: hovered ? "28px" : "20px",
                  height: "1px",
                  backgroundColor: hovered ? "#3b5bdb" : "#111827",
                  transition: "width 0.3s ease, background-color 0.3s ease",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: hovered ? "#3b5bdb" : "#1f2937",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  transition: "color 0.3s ease",
                }}
              >
                {entry.role}
              </span>
            </div>

            {/* Description */}
            {entry.description && (
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#374151",
                  marginTop: "0.75rem",
                  marginBottom: 0,
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {entry.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ExperienceTimeline() {
  const [headerRef, headerInView] = useInView(0.2);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 0,
        width: '100%',
        height: 'calc(100vh - 80px)',
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "4rem 15% 4rem",
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Noto Serif JP', serif",
        overflowY: 'auto'
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        {/* Section Header */}
        <div
          ref={headerRef}
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            marginBottom: "3rem",
          }}
        >
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
              04
            </span>
          </div>
          <h2
            style={{
              fontSize: "4rem",
              fontFamily: "'Zen Brush Old Mincho', serif",
              color: "#374151",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            My Experience
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", marginLeft: '20px' }}>
          {/* Vertical Line */}
          <div
            style={{
              position: "absolute",
              left: "calc(1rem - 1px)",
              top: "6px",
              bottom: "0",
              width: "2px",
              backgroundColor: "#d1d5db",
              zIndex: -1,
            }}
          />

          {/* Entries */}
          <div>
            {experienceData.map((entry, index) => (
              <TimelineEntry key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
