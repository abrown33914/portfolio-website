import { motion } from "framer-motion";
import Section from "./Section";

/** Simple, wide paragraph + small tech marquee */
export default function About() {
  const techs = ['React','TypeScript','Tailwind','Framer Motion','Node','Python','C++','Front End','ArduPilot','MongoDB','Data Structures','UI/UX'];

  return (
    <Section id="about" title="About">
      <div className="mx-auto text-center px-4 max-w-[56rem] md:max-w-[64rem]">
        <motion.p
          className="text-neutral-200 text-lg md:text-[20px] leading-relaxed tracking-[0.01em]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          Hi, I’m Allison Brown! I’m a junior Software Engineering student at FGCU with a background in front-end and a growing
          interest in cybersecurity and digital forensics. I help run our Computer Science & Software Engineering Club,
          organizing technical workshops, career events, and hackathons. Off-screen, I’m into photography and playing pool. 
          I’m open to internships and meaningful work where I can contribute and keep learning!
        </motion.p>
      </div>

      {/* Tech marquee (basic, smooth; remove if you want ultra minimal) */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-8">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6 whitespace-nowrap py-4 px-4 text-neutral-200/90"
            animate={{ x: [0, -600] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {techs.concat(techs).map((t, i) => (
              <span key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">{t}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
