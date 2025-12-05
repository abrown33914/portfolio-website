import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { navItems, theme } from "../theme";

// Nav component
// - desktop: centered pill nav with utilities on the right
// - mobile: fixed header with a hamburger that opens a compact overlay
export default function Nav() {
  // id of the currently visible section (used to highlight desktop nav)
  const [active, setActive] = useState("home");
  // whether the mobile menu is open
  const [open, setOpen] = useState(false);
  // keep the menu DOM mounted briefly after close so the close animation
  // can finish before we unmount (avoids abrupt snapping)
  const [mounted, setMounted] = useState(false);

  // observe sections and update `active` as the user scrolls
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // helper: smooth-scroll to a section
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // reusable hamburger svg so header and (previously) panel match exactly
  const Hamburger = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
    </svg>
  );

  // close mobile menu on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock body scroll while mobile menu is open
  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [open]);

  // keep menu mounted briefly so close animation can run
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    // fixed container at top of the page
    <div className="fixed top-4 inset-x-0 z-[140] px-3 sm:px-4">
      {/* mobile header: hamburger on left, utilities on right */}
      <div className="md:hidden mx-auto max-w-screen-xl">
        <div className="flex items-center justify-between">
          {/* header hamburger toggles the mobile panel */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center w-10 h-10 text-white/90 hover:text-white transition-transform duration-150 hover:scale-110 bg-transparent border-none shadow-none"
            style={{ zIndex: 160 }}
          >
            <Hamburger size={28} />
          </button>

          {/* utilities (LinkedIn, Resume) */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/allison-brown27/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full
                         bg-gradient-to-r from-[#8C7AE6] to-[#2EC4B6]
                         transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
              title="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5V16.4c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.91 1.97-2.91 4.01V24h-5V8z"/>
              </svg>
            </a>
            <a
              href={import.meta.env.BASE_URL + 'AllisonBrown.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full
                         border border-white/15 bg-black/35 backdrop-blur
                         text-white/90 shadow-xl shadow-black/10
                         transition-all duration-200
                         hover:bg-[#2EC4B6] hover:text-[#0B0B10] hover:border-[#2EC4B6]
                         focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/50"
              title="Resume"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="-ml-0.5">
                <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1 7H9V7h6zM9 12h6v2H9zm0 4h6v2H9zM14 2v6h6" />
              </svg>
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* desktop header: centered pill nav */}
      <div className="hidden md:block mx-auto max-w-screen-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center relative h-12 sm:h-14">
          <div aria-hidden /> {/* left spacer */}

          {/* centered pill nav */}
          <nav
            className="
              justify-self-center
              flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3
              rounded-full shadow-xl border border-white/15 bg-black/35 backdrop-blur
              overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              max-w-[min(720px,calc(100vw-16rem))]
            "
          >
            {navItems.map((n) => {
              const isActive = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="relative px-3 md:px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
                  style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.85)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.rose)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? "#fff" : "rgba(255,255,255,0.85)")
                  }
                >
                  {n.label}
                  {isActive && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -bottom-[2px] h-[2px] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${theme.rose}, ${theme.violet}, ${theme.teal})`,
                        width: 'fit-content',
                        maxWidth: '100%'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* right-side utilities */}
          <div className="flex items-center justify-self-end gap-2 pr-1">
            <a
              href="https://www.linkedin.com/in/allison-brown27/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full
                         bg-gradient-to-r from-[#8C7AE6] to-[#2EC4B6]
                         transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
              title="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5V16.4c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.91 1.97-2.91 4.01V24h-5V8z"/>
              </svg>
            </a>
            <a
              href={import.meta.env.BASE_URL + 'AllisonBrown.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-3 py-2 rounded-full
                border border-white/15 bg-black/35 backdrop-blur
                text-white/90 shadow-xl shadow-black/10
                transition-all duration-200
                hover:bg-[#2EC4B6] hover:text-[#0B0B10] hover:border-[#2EC4B6]
                focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/50
              "
              title="Resume"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="-ml-0.5">
                <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1 7H9V7h6zM9 12h6v2H9zm0 4h6v2H9zM14 2v6h6" />
              </svg>
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* mobile overlay menu (mounted briefly to animate close) */}
      {mounted && (
        // overlay fades; pointer-events disabled while hidden
        <div
          className={
            `md:hidden fixed inset-0 z-[120] transition-opacity duration-200 ease-out ` +
            (open ? "opacity-100 backdrop-blur-sm" : "opacity-0 pointer-events-none")
          }
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* compact glassy panel in the top-left; animates translate+fade */}
          <div
            className={
              `absolute top-4 left-4 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-lg shadow-xl flex flex-col items-start gap-0 pt-12 pb-3 px-2 transition-all duration-300 ease-out ` +
              (open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none")
            }
            style={{ height: "auto", width: "fit-content" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* menu items start below the fixed header hamburger */}

            {/* menu links (stacked with staggered animation) */}
            <nav className="grid gap-0">
              {navItems.map((n, idx) => (
                <button
                  key={n.id}
                  onClick={() => { setOpen(false); setTimeout(() => scrollTo(n.id), 0); }}
                  className="text-left px-3 py-2.5 rounded-md text-[15px] text-white/90 transition-all relative hover:text-white whitespace-nowrap"
                  style={{
                    color: active === n.id ? '#fff' : 'rgba(255,255,255,0.85)',
                    transform: open ? 'translateY(0)' : `translateY(-10px)`,
                    opacity: open ? 1 : 0,
                    transition: open
                      ? `all 300ms cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 45}ms`
                      : `all 200ms ease-in ${(navItems.length - idx - 1) * 30}ms`
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = theme.rose)}
                  onMouseLeave={e => (e.currentTarget.style.color = active === n.id ? '#fff' : 'rgba(255,255,255,0.85)')}
                >
                  <span className="relative z-10">{n.label}</span>
                  {active === n.id && (
                    <motion.span
                      layoutId="mobile-underline"
                      className="absolute bottom-2 left-3 h-[2px] rounded-full"
                      style={{
                        width: 'calc(100% - 1.5rem)',
                        background: `linear-gradient(90deg, ${theme.rose}, ${theme.violet}, ${theme.teal})`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* footer actions omitted */}
          </div>
        </div>
      )}
    </div>
  );
}
