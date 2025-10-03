// src/components/ProjectCard.jsx
import React from "react";

export default function ProjectCard({
  title,
  tagline,
  desc,
  repo,
  cover,            // image URL
  onCoverClick,     // optional: (project) => void
}) {
  const handleActivate = () => {
    if (typeof onCoverClick === "function") {
      onCoverClick({ title, tagline, desc, repo, cover });
    }
  };

  return (
    <article
      className={`
        group snap-start
        min-w-[88%] sm:min-w-[64%] md:min-w-[50%] lg:min-w-[44%] xl:min-w-[40%] 2xl:min-w-[38%]
        p-5 rounded-2xl border bg-white/10 backdrop-blur border-white/15
        focus-within:ring-2 focus-within:ring-[#2EC4B6]/60
      `}
    >
      {/* Cover (hover zoom + clickable) */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open cover for ${title}`}
        onClick={handleActivate}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleActivate()}
        className="rounded-xl overflow-hidden aspect-[16/9] bg-white/5 border border-white/10 cursor-pointer outline-none"
      >
        {cover ? (
          <img
            src={cover}
            alt={`${title} cover`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </div>

      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-neutral-400">{tagline}</p>
      <p className="mt-2 text-neutral-200/90">{desc}</p>

      {/* Primary action (GitHub) */}
      <div className="mt-3">
        <a
          href={repo || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border
                     border-[#2EC4B6] text-white/85 transition-colors duration-200
                     hover:bg-[#2EC4B6] hover:text-[#0B0B10] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/60"
        >
          {/* GitHub icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.27 1.86 1.27 1.08 1.86 2.83 1.32 3.52 1.01.11-.8.42-1.32.76-1.62-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.64.25 2.86.12 3.16.77.84 1.24 1.9 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.09.81 2.2v3.26c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
          </svg>
          GitHub
        </a>
      </div>
    </article>
  );
}
