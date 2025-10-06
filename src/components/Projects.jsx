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
  const [cardWidth, setCardWidth] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : true);

  // scroll nudge helper used by navigation arrows
  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // smart snap: find project cards and scroll so a full card is in view
    const cards = Array.from(el.querySelectorAll("article"));
    if (!cards.length) {
      // fallback to previous behavior
      el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
      return;
    }

    // compute the index of the card nearest the current center of the track
    const trackCenter = el.scrollLeft + el.clientWidth / 2;
    let current = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const cCenter = c.offsetLeft + c.clientWidth / 2;
      const d = Math.abs(cCenter - trackCenter);
      if (d < bestDist) { bestDist = d; current = i; }
    });

    const targetIndex = dir > 0 ? Math.min(cards.length - 1, current + 1) : Math.max(0, current - 1);
    const target = cards[targetIndex];
    if (!target) return;

    // center the target card in the visible track
    const desiredLeft = Math.max(0, target.offsetLeft + target.clientWidth / 2 - el.clientWidth / 2);
    el.scrollTo({ left: desiredLeft, behavior: "smooth" });
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
    // center the first card so the carousel starts with a full card visible
    const first = el.querySelector('article');
    if (first) {
      const left = Math.max(0, first.offsetLeft + first.clientWidth / 2 - el.clientWidth / 2);
      el.scrollLeft = left;
    } else {
      const pad = calcDesiredLeftPad(spacer.offsetWidth);
      el.scrollLeft = Math.max(0, spacer.offsetWidth - pad);
    }
  };

  // On mount: align track, check overflow, and wire up resize listener
  useEffect(() => {
    // compute a card width so a whole number of cards fit the visible area
    const computeCardWidth = () => {
      const el = trackRef.current;
      if (!el) return;
      const trackW = el.clientWidth;
  // decide how many cards to show at once based on breakpoints
  const w = window.innerWidth;
  // deterministic: 1 on small, 3 on desktop (no 2-card state)
  let visible = w >= 1024 ? 3 : 1;

      // measure gap between cards from the flex container
      const inner = el.querySelector(':scope > div');
      let gap = 16;
      if (inner) {
        const cs = getComputedStyle(inner);
        gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || gap;
      }

      // arrow offset from computed styles (fallback to 32px)
      const host = el.parentElement || el;
      const hostStyle = getComputedStyle(host);
      const arrowOffsetRaw = hostStyle.getPropertyValue('--arrowOffset') || '';
      let arrowOffset = 32;
      if (arrowOffsetRaw) {
        const m = arrowOffsetRaw.match(/(\d+(?:\.\d+)?)/);
        if (m) arrowOffset = parseFloat(m[1]);
      }

      const totalGaps = (visible - 1) * gap;
      // leave small breathing space (8px each side) so card isn't flush under arrows
      const sidePadding = 8;
      const available = Math.max(0, trackW - 2 * arrowOffset - totalGaps - 2 * sidePadding);
      const cw = Math.floor(available / visible);
      // set a minimum sensible width
      if (cw > 80) setCardWidth(cw);
    };

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
      computeCardWidth();
      setIsMobile(window.innerWidth < 768);
      if (!hasInteracted.current) alignToStart();
    };
    computeCardWidth();
    setIsMobile(window.innerWidth < 768);
    // center after compute
    setTimeout(() => alignToStart(), 60);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Section id="projects" title="Projects">
      {/* container that defines layout variables and controls overflow */}
      <div
        className="relative overflow-visible px-4 sm:px-8 md:px-10"
        style={{
          // side gutters (leave generous for breathing room)
          "--gutter": "clamp(56px, 8vw, 120px)",
          // arrow offset: smaller so buttons sit just outside the carousel
          "--arrowOffset": "clamp(20px, 4vw, 48px)",
          "--peek": "clamp(12px, 2vw, 28px)",
        }}
      >
        {/* ARROWS: only render when the track is overflowing */}
        {isOverflowing && (
          <>
            {/* Desktop arrows: absolute and hidden on small screens */}
            <button
              aria-label="Previous"
              onClick={() => nudge(-1)}
              className="hidden md:flex projects-arrow-left items-center justify-center absolute top-1/2 -translate-y-1/2 z-10
                         w-11 h-11 md:w-12 md:h-12 text-white/90 hover:text-white transition-transform hover:scale-105
                         outline-none focus:outline-none"
              style={{ left: "calc(-1 * var(--arrowOffset))" }}
            >
              <ChevronLeft size={34} strokeWidth={3} />
            </button>

            <button
              aria-label="Next"
              onClick={() => nudge(1)}
              className="hidden md:flex projects-arrow-right items-center justify-center absolute top-1/2 -translate-y-1/2 z-10
                         w-11 h-11 md:w-12 md:h-12 text-white/90 hover:text-white transition-transform hover:scale-105
                         outline-none focus:outline-none"
              style={{ right: "calc(-1 * var(--arrowOffset))" }}
            >
              <ChevronRight size={34} strokeWidth={3} />
            </button>
          </>
        )}

        {/* TRACK: horizontally scrollable container for project cards */}
        <div
          ref={trackRef}
          onScroll={() => (hasInteracted.current = true)}
          className="overflow-x-auto no-scrollbar snap-x projects-track"
          style={{
            scrollBehavior: "smooth",
            scrollPaddingLeft: "calc(var(--gutter) + var(--arrowOffset))",
            scrollPaddingRight: "calc(var(--gutter) + var(--peek) + var(--arrowOffset))",
            // use mandatory snapping so navigation lands whole cards in view
            scrollSnapType: "x mandatory",
          }}
        >
          <div className="flex gap-[var(--card-gap)] px-1 items-stretch">
            {/* START spacer: gives the first card some left breathing room */}
            <div ref={startSpacerRef} className="shrink-0" style={{ width: "var(--gutter)" }} />

            {/* Render all projects as cards; ProjectCard handles its own layout */}
            {(projects ?? []).map((p) => (
              <ProjectCard
                key={p.title}
                {...p}
                cardWidth={cardWidth}
              />
            ))}

            {/* END spacer: symmetric right padding */}
            <div className="shrink-0" style={{ width: "var(--gutter)" }} />
          </div>
        </div>
          {/* Mobile arrows placed directly under the track for clearer UX */}
          {isOverflowing && (
            <div className="md:hidden w-full flex items-center justify-center gap-6 mt-10 projects-mobile-arrows">
              <button
                aria-label="Previous"
                onClick={() => nudge(-1)}
                className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white transition-transform hover:scale-105 outline-none focus:outline-none"
              >
                <ChevronLeft size={28} strokeWidth={3} />
              </button>
              <button
                aria-label="Next"
                onClick={() => nudge(1)}
                className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white transition-transform hover:scale-105 outline-none focus:outline-none"
              >
                <ChevronRight size={28} strokeWidth={3} />
              </button>
            </div>
          )}
      </div>
    </Section>
  );
}
