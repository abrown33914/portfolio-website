import { motion } from "framer-motion";
import Section from "./Section";

/** Simple, wide paragraph + small tech marquee */
export default function About() {
  const techs = [
    'React', 'Figma',
    'JavaScript', 'HTML', 'CSS',
    'Data Structures', 'React Native', 'Canva', 'Graphic Design',
    'OOP', 'UI/UX' , 'Git', 'Python', 'C++'
  ];
  return (
    <Section id="about" title="About">
  <div className="mx-auto text-center px-4 max-w-[72rem] md:max-w-[80rem]">
        <motion.div
          className="text-neutral-200 text-lg md:text-[20px] leading-relaxed tracking-[0.01em]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <p>
            Hi, I’m Allison! I’m a junior Software Engineering student at FGCU passionate about front-end development, UI/UX, and building projects that blend technical impact with great design. I’ve created cross platform apps, interactive simulations, and polished projects that showcase both functionality and user experience.
          </p>

          <p className="mt-4">
            As Vice President of the Computer Science & Software Engineering Club, I help lead technical workshops, career events, and FGCU’s only student-run hackathon, working with companies like Microsoft, Hertz, and Arthrex.
          </p>

          <p className="mt-4">
            Outside of coding, I’m into photography and playing pool. I’m excited to bring my creativity, technical skills, and leadership experience into work where I can contribute to impactful projects and keep learning!
          </p>
        </motion.div>
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
