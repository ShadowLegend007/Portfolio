import { useState, useEffect, useRef } from "react";
import { educationBg } from '../assets/assets';
import { useIsMobile } from '../hooks/useIsMobile';

const spinOnceStyle = `
  @keyframes spinOnce {
    from { transform: rotate(45deg) scale(1.25); }
    to   { transform: rotate(405deg) scale(1.25); }
  }
`;

const educationData = [
  {
    id: 1,
    period: "July 2023 - Jun 2027",
    institution: "RAMAKRISHNA MISSION VIVEKANANDA CENTENARY COLLAGE",
    degree: "B.Sc.Computer Science",
    grade: "8.69(Ongoing)",
  },
  {
    id: 2,
    period: "2021-2023",
    institution: "GSMS TAKI HOUSE (FOR BOYS)",
    degree: "Higher Secondary",
    grade: null,
  },
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

function TimelineEntry({ entry, index, isMobile }: { entry: typeof educationData[0], index: number, isMobile: boolean }) {
  const [ref, inView] = useInView(0.15);
  const [hovered, setHovered] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSpinning(false);
    // Force remount of animation by incrementing key
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
          {/* Subtle light box behind diamond for elegance like in screenshot */}
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
            paddingLeft: isMobile ? "0.8rem" : "1.5rem",
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

            {/* Institution Name */}
            <h3
              style={{
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "0.5rem",
                marginTop: 0,
                fontSize: isMobile ? "0.95rem" : "1.1rem",
                letterSpacing: "0.02em",
                color: "#111827",
                lineHeight: 1.3,
              }}
            >
              {entry.institution}
            </h3>

            {/* Degree with accent line */}
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
                {entry.degree}
              </span>
            </div>

            {/* Grade */}
            {entry.grade && (
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
                <span style={{ fontWeight: 700, color: "#111827" }}>CGPA:</span>{" "}
                {entry.grade}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function EducationTimeline() {
  const [headerRef, headerInView] = useInView(0.2);
  const isMobile = useIsMobile();

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
        padding: isMobile ? "4rem 5% 4rem" : "4rem 15% 4rem",
        backgroundImage: `url(${educationBg})`,
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
              03
            </span>
          </div>
          <h2
            style={{
              fontSize: isMobile ? "2.5rem" : "4rem",
              fontFamily: "'Zen Brush Old Mincho', serif",
              color: "#374151",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            My Education
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
            {educationData.map((entry, index) => (
              <TimelineEntry key={entry.id} entry={entry} index={index} isMobile={isMobile} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
