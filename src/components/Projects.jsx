import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { projects } from "../data/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

// Projects: horizontal scrollable track of project cards with optional arrows
// The component aims to:
// - provide a start spacer so the first card can be centered/peeked
// - show left/right arrows only when the track overflows
// - allow keyboard/interaction-friendly card activation (handled in ProjectCard)
export default function Projects() {
  // references to DOM nodes and flags used for alignment/interaction
  const trackRef = useRef(null); // main scroll container
  const startSpacerRef = useRef(null); // spacer element to provide left padding
  const hasAligned = useRef(false); // ensure we align start only once on mount
  const hasInteracted = useRef(false); // mark true when user scrolls/interacts
  const [isOverflowing, setIsOverflowing] = useState(false); // whether arrows should show

  // scroll nudge helper used by navigation arrows
  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // move roughly one viewport's worth (80%) left or right
    el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  };

  // Calculate a desired left padding based on viewport width so the first card
  // appears nicely aligned. This is intentionally simple and tuned for this layout.
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

  // alignToStart: programmatically set scrollLeft so the first card sits after
  // the start spacer with a small calculated pad
  const alignToStart = () => {
    const el = trackRef.current;
    const spacer = startSpacerRef.current;
    if (!el || !spacer) return;
    const pad = calcDesiredLeftPad(spacer.offsetWidth);
    el.scrollLeft = Math.max(0, spacer.offsetWidth - pad);
  };

  // On mount: align track, check overflow, and wire up resize listener
  useEffect(() => {
    if (!hasAligned.current) {
      alignToStart();
      hasAligned.current = true;
    }

    // helper to update isOverflowing flag
    const checkOverflow = () => {
      if (!trackRef.current) return;
      setIsOverflowing(trackRef.current.scrollWidth > trackRef.current.clientWidth + 2);
    };
    checkOverflow();

    // when window resizes, re-check overflow and re-align if user hasn't touched it
    const onResize = () => {
      checkOverflow();
      if (!hasInteracted.current) alignToStart();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Section id="projects" title="Projects">
      {/* container that defines layout variables and controls overflow */}
      <div
        className="relative overflow-visible px-4 sm:px-8 md:px-10"
        style={{
          "--gutter": "clamp(40px, 7vw, 96px)",
          "--arrowOffset": "clamp(32px, 6vw, 84px)",
          "--peek": "clamp(12px, 2vw, 28px)",
        }}
      >
        {/* ARROWS: only render when the track is overflowing */}
        {isOverflowing && (
          <>
            {/* Left arrow: visually offset to peek outside the track */}
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

            {/* Right arrow */}
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

        {/* TRACK: horizontally scrollable container for project cards */}
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
            {/* START spacer: gives the first card some left breathing room */}
            <div ref={startSpacerRef} className="shrink-0" style={{ width: "var(--gutter)" }} />

            {/* Render all projects as cards; ProjectCard handles its own layout */}
            {(projects ?? []).map((p) => (
              <ProjectCard
                key={p.title}
                {...p}
              />
            ))}

            {/* END spacer: symmetric right padding */}
            <div className="shrink-0" style={{ width: "var(--gutter)" }} />
          </div>
        </div>
      </div>
    </Section>
  );
}
