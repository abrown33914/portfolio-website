import Section from "./Section";
import { motion } from "framer-motion";

export default function Experience() {
  const items = [
    {
      role: "Frontend Developer",
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
      company: "EagleHacks",
      period: "2024 - Present",
      details: [
        "-Expanded CSSEC's annual hackathon into a public event, coordinating 60+ students and technical workshops",
        "-Secured $15K+ in funding from local businesses and alumni employers to support prizes, resources, and event growth",
        "-Engaged industry professionals as mentors, judges, and networking partners to connect students with real world expertise",
      ],
    },
    {
      role: "Vice President",
      company: "FGCU Computer Science & Software Engineering Club (CSSEC)",
      period: "2024 - Present",
      details: [
        "-Progressed from Marketing Coordinator to Vice President, helping guide officer operations and club strategy",
        "-Helped lead weekly meetings with 50+ active members, facilitating technical workshops, alumni/career panels, and professional development",
        "-Forged partnerships with faculty, employers, and peer organizations, elevating CSSEC’s presence and opportunities on campus",
      ],
    },
    {
      role: "Hacker",
      company: "Hackabull 2025",
      period: "2025",
      details: [
        "-Developed a creative solution to a real-world challenge during a 24-hour hackathon at USF",
        "-Worked closely with teammates to brainstorm, design, and present our project to judges",
        "-Expanded my skills in teamwork, time management, and technical problem solving"
      ],
    },
    {
      role: "Top 20th Hacker",
      company: "ShellHacks 2024",
      period: "2024",
      details: [
        "-Attended my first hackathon, learning the fundamentals of project ideation and rapid development",
        "-Collaborated with new peers to build a working prototype and present to judges",
        "-Connected with mentors and gained exposure to the hackathon community"
      ],
    },
  ];

  return (
    <Section id="experience" title="Experience & Involvement">
      {/* Mobile: one column (cards first, photos second)
          Desktop: two columns (photos left, cards right) */}
      <div className="grid gap-8 items-start lg:grid-cols-[clamp(220px,28vw,360px)_1fr]">
        {/* Photos column (second on mobile, first on desktop) */}
        <div className="order-2 lg:order-1 space-y-4 lg:max-w-[360px]">
          {/* Landscape */}
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

          {/* Portrait */}
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
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div className="flex flex-col items-start">
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-0.5">
                    {it.role}
                  </h4>
                  <span className="text-neutral-400 text-sm sm:text-base mb-0.5">{it.company}</span>
                </div>
                <span className="text-xs sm:text-sm text-neutral-400 mt-1 sm:mt-0">{it.period}</span>
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
