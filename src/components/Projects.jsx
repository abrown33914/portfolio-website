// src/components/Projects.jsx
import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { projects } from "../data/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const trackRef = useRef(null);
  const startSpacerRef = useRef(null);
  const hasAligned = useRef(false);
  const hasInteracted = useRef(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  };

  // desired-left-pad helper (your version)
  const calcDesiredLeftPad = (spacerWidth) => {
    const w = window.innerWidth;
    const pad =
      w >= 1536 ? 24 :
      w >= 1280 ? 24 :
      w >= 1024 ? 20 :
      w >= 768  ? 16 :
                  12;
    return Math.min(spacerWidth - 6, pad);
  };

  const alignToStart = () => {
    const el = trackRef.current;
    const spacer = startSpacerRef.current;
    if (!el || !spacer) return;
    const pad = calcDesiredLeftPad(spacer.offsetWidth);
    el.scrollLeft = Math.max(0, spacer.offsetWidth - pad);
  };

  useEffect(() => {
    if (!hasAligned.current) {
      alignToStart();
      hasAligned.current = true;
    }

    const checkOverflow = () => {
      if (!trackRef.current) return;
      setIsOverflowing(trackRef.current.scrollWidth > trackRef.current.clientWidth + 2);
    };
    checkOverflow();

    const onResize = () => {
      checkOverflow();
      if (!hasInteracted.current) alignToStart();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Section id="projects" title="Projects">
      <div
        className="relative overflow-visible px-4 sm:px-8 md:px-10"
        style={{
          "--gutter": "clamp(40px, 7vw, 96px)",
          "--arrowOffset": "clamp(32px, 6vw, 84px)",
          "--peek": "clamp(12px, 2vw, 28px)",
        }}
      >
        {/* ARROWS */}
        {isOverflowing && (
          <>
            <button
              aria-label="Previous"
              onClick={() => nudge(-1)}
              className="sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10
                         w-11 h-11 md:w-12 md:h-12 text-white/90 hover:text-white transition-transform hover:scale-110
                         outline-none focus:outline-none"
              style={{ left: "max(12px, calc(-1 * var(--arrowOffset)))" }}
            >
              <ChevronLeft size={34} strokeWidth={3} />
            </button>

            <button
              aria-label="Next"
              onClick={() => nudge(1)}
              className="sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10
                         w-11 h-11 md:w-12 md:h-12 text-white/90 hover:text-white transition-transform hover:scale-110
                         outline-none focus:outline-none"
              style={{ right: "max(12px, calc(-1 * var(--arrowOffset)))" }}
            >
              <ChevronRight size={34} strokeWidth={3} />
            </button>
          </>
        )}

        {/* TRACK */}
        <div
          ref={trackRef}
          onScroll={() => (hasInteracted.current = true)}
          className="overflow-x-auto no-scrollbar snap-x snap-proximity"
          style={{
            scrollBehavior: "smooth",
            scrollPaddingLeft: "var(--gutter)",
            scrollPaddingRight: "calc(var(--gutter) + var(--peek))",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)",
          }}
        >
          <div className="flex gap-6 sm:gap-7 lg:gap-8 px-1 items-stretch">
            {/* START spacer */}
            <div ref={startSpacerRef} className="shrink-0" style={{ width: "var(--gutter)" }} />

            {(projects ?? []).map((p) => (
              <ProjectCard
                key={p.title}
                {...p}
                onCoverClick={(proj) => {
                  // Wire this up later however you want:
                  // Example A (open repo): window.open(proj.repo, "_blank", "noopener,noreferrer");
                  // Example B (open modal): setModalProject(proj);
                  console.log("Cover clicked:", proj.title);
                }}
              />
            ))}

            {/* END spacer */}
            <div className="shrink-0" style={{ width: "var(--gutter)" }} />
          </div>
        </div>
      </div>
    </Section>
  );
}
