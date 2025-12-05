import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { projects } from "../data/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const trackRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [cardWidth, setCardWidth] = useState(null);

  // Navigate to next/previous card with smooth scrolling
  const nudge = (direction) => {
    if (!trackRef.current) return;
    const cards = Array.from(trackRef.current.querySelectorAll("article"));
    if (!cards.length) return;

    // Find the card nearest the center of the viewport
    const trackCenter = trackRef.current.scrollLeft + trackRef.current.clientWidth / 2;
    let currentIdx = 0;
    let minDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < minDist) {
        minDist = dist;
        currentIdx = idx;
      }
    });

    // Move to next/prev card
    const targetIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + direction));
    const targetCard = cards[targetIdx];

    trackRef.current.scrollTo({
      left: targetCard.offsetLeft - 16, // 16px for padding
      behavior: "smooth",
    });
  };

  // Check if track is overflowing and compute card width
  useEffect(() => {
    const checkOverflow = () => {
      if (!trackRef.current) return;
      const isOver = trackRef.current.scrollWidth > trackRef.current.clientWidth + 2;
      setIsOverflowing(isOver);
    };

    const computeCardWidth = () => {
      if (!trackRef.current) return;
      const trackW = trackRef.current.clientWidth;
      const w = window.innerWidth;
      const visibleCards = w >= 1024 ? 3 : 1;
      const gap = 16;
      const totalGaps = (visibleCards - 1) * gap;
      const sidePadding = 32; // left and right padding
      const available = Math.max(0, trackW - totalGaps - sidePadding);
      const cw = Math.floor(available / visibleCards);
      if (cw > 80) setCardWidth(cw);
    };

    checkOverflow();
    computeCardWidth();

    const onResize = () => {
      checkOverflow();
      computeCardWidth();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Section id="projects" title="Projects">
      <div className="relative">
        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-16"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <div className="flex gap-4">
            {(projects ?? []).map((p) => (
              <ProjectCard key={p.title} {...p} cardWidth={cardWidth} />
            ))}
          </div>
        </div>

        {/* Desktop arrows - positioned outside track with padding */}
        {isOverflowing && (
          <>
            <button
              aria-label="Previous"
              onClick={() => nudge(-1)}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 z-10 w-12 h-12 items-center justify-center text-white/90 hover:text-white transition-transform hover:scale-105"
            >
              <ChevronLeft size={32} strokeWidth={3} />
            </button>
            <button
              aria-label="Next"
              onClick={() => nudge(1)}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 z-10 w-12 h-12 items-center justify-center text-white/90 hover:text-white transition-transform hover:scale-105"
            >
              <ChevronRight size={32} strokeWidth={3} />
            </button>
          </>
        )}

        {/* Mobile arrows - underneath track */}
        {isOverflowing && (
          <div className="md:hidden flex items-center justify-center gap-6 mt-8">
            <button
              aria-label="Previous"
              onClick={() => nudge(-1)}
              className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white transition-transform hover:scale-105"
            >
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <button
              aria-label="Next"
              onClick={() => nudge(1)}
              className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white transition-transform hover:scale-105"
            >
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
