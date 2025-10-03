import Section from "./Section";
import { motion } from "framer-motion";

export default function Experience() {
  const items = [
    {
      role: "Frontend Developer Intern",
      company: "BoomBox",
      period: "2025 — Present",
      details: [
        " ",
        " ",
        " ",
      ],
    },
    {
      role: "Hackathon Organizer",
      company: "CSSEC EagleHacks",
      period: "Spring 2024 - Present",
      details: [
        "-Directed planning for two EagleHacks events, FGCU’s only student run hackathon, engaging 100+ hackers.",
        "-Secured $23K+ in sponsorships and grants from 7 corporate partners including Arthrex, Hertz, and Kingland.",
        "-Oversaw logistics, registration, and judging while expanding impact with workshops and networking.",
      ],
    },
    {
      role: "Vice President",
      company: "FGCU Computer Science & Software Engineering Club (CSSEC)",
      period: "Spring 2024 - Present",
      details: [
        "-Advanced from Marketing Coordinator to Vice President, leading weekly meetings and officer led workshops.",
        "-Organized panels and career events with professionals from Microsoft, Hertz, and Arthrex.",
        "-Built a collaborative, growth-focused community through mentorship and projects.",
      ],
    },
    {
      role: "Hacker",
      company: "Hackabull 2025 (USF)",
      period: "Spring 2025",
      details: [
        "-Collaborated in a 24 hour hackathon sprint, designing a survival app with mapping, reporting, and AI features.",
        "-Gained hands on experience in rapid prototyping, teamwork, and pitching under tight deadlines."
      ],
    },
    {
      role: "Top 20th Hacker",
      company: "ShellHacks 2024 (FIU)",
      period: "Fall 2024",
      details: [
        "-Top 20 of 250+ projects for a mobile app using AI to improve financial literacy with personalized dashboards.",
        "-Collaborated in my first hackathon, gaining experience in ideation, prototyping, and presenting to judges."
      ],
    },
    {
      role: "Member",
      company: "Society of Women Engineers (SWE)",
      period: "Fall 2023 - Present",
      details: [
        "-Engaged in a professional community supporting women in engineering and technology."
      ],
    },
  ];

  return (
    <Section id="experience" title="Experience & Involvement">
      {/* mobile: cards then photos; desktop: photos left, cards right */}
      {/* on lg we use a two-column grid and stretch the photos column so
          the bottom photo lines up with the last card */}
      <div className="grid gap-8 items-start lg:items-stretch lg:grid-cols-[clamp(220px,28vw,360px)_1fr]">
        {/* Photos column (collage on mobile, stacked on desktop) */}
  <div className="order-2 lg:order-1 lg:max-w-[360px]">
          {/* mobile: compact collage (keeps images small, less scrolling) */}

          {/* mobile: compact collage grid (hidden on lg+) */}
          <div className="lg:hidden grid grid-cols-3 gap-2">
            <motion.div
              className="col-span-2 row-span-2 rounded-2xl overflow-hidden border border-white/12 bg-white/3"
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36 }}
            >
              <img
                src="/shellhacks.jpg"
                alt="ShellHacks project showcase"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden border border-white/12 bg-white/3"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: 0.04 }}
            >
              <img
                src="/presenting.jpg"
                alt="Me Presenting at CSSEC"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </motion.div>

            {/* small accent tile to add visual variety */}
            <motion.div
              className="rounded-2xl overflow-hidden border border-white/12 bg-white/3"
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.36, delay: 0.06 }}
            >
              <img
                src="/cssec.jpg"
                alt="CSSEC detail"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* desktop: stacked images, stretched so bottom photo aligns with cards */}
          <div className="hidden lg:flex lg:flex-col lg:justify-between lg:space-y-4">
            <div className="space-y-4">
              <motion.div
                className="rounded-2xl overflow-hidden border border-white/15 bg-white/5"
                initial={{ y: 14, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src="/cssec.jpg"
                  alt="CSSEC Tabling Event"
                  className="w-full aspect-video object-cover object-top"
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                className="rounded-2xl overflow-hidden border border-white/15 bg-white/5"
                initial={{ y: 14, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <img
                  src="/presenting.jpg"
                  alt="Me Presenting at CSSEC"
                  className="w-full object-cover aspect-[3/4]"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* bottom image sits at the end of this column */}
            <motion.div
              className="rounded-2xl overflow-hidden border border-white/15 bg-white/5"
              initial={{ y: 14, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              {/* use a wider aspect + max-height so this image doesn't dominate */}
              {/* nearer-square aspect; allow it to be a bit taller on lg */}
              <img
                src="/shellhacks.jpg"
                alt="ShellHacks 2024 (FIU)"
                className="w-full object-cover aspect-[4/5] lg:max-h-[380px]"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>

        {/* Cards column (first on mobile, second on desktop) */}
        <div className="order-1 lg:order-2 space-y-5 min-w-0">
          {items.map((it, i) => (
            <motion.div
              key={it.role}
              className="p-5 rounded-2xl border bg-white/10 backdrop-blur border-white/15"
              initial={{ y: 14, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-0.5">
                    {it.role}
                  </h4>
                  <span className="text-neutral-400 text-sm sm:text-base mb-0.5 block truncate">{it.company}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">{it.period}</span>
                </div>
              </div>

              <div className="mt-3 text-neutral-200/90 space-y-1.5 text-left">
                {it.details.map((line) => (
                  <div key={line} className="leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
