import Section from "./Section";
import { motion } from "framer-motion";
import { Mail, Linkedin, Phone } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { theme } from "../theme";

// Contact section: simple center-aligned contact info with CTAs
// - decorative animated orbs sit behind the content
// - email and phone are plain links (mailto/tel)
// - LinkedIn CTA and a back-to-top button are included
export default function Contact() {
  // floating animation used for the decorative orbs in the background
  const float = {
    initial: { y: 0, opacity: 0.95 },
    animate: { y: [-10, 10, -10], opacity: [0.95, 1, 0.95] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <Section id="contact" title="Contact">
      {/* center container for the contact content */}
      <div className="relative grid place-items-center px-4 sm:px-0">
        {/* decorative orb in the top-left (faint, animated) */}
        <motion.div
          className="absolute -top-10 -left-14 w-28 h-28 sm:w-36 sm:h-36 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${theme.rose}33, transparent 70%)`,
            filter: "blur(24px)",
          }}
          initial={float.initial}
          animate={float.animate}
          transition={float.transition}
        />
        {/* decorative orb in the bottom-right */}
        <motion.div
          className="absolute -bottom-12 -right-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${theme.teal}33, transparent 70%)`,
            filter: "blur(26px)",
          }}
          initial={float.initial}
          animate={float.animate}
          transition={{ ...float.transition, duration: 7 }}
        />

        {/* main centered card area */}
        <motion.div
          className="w-full max-w-2xl mx-auto text-center"
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* short intro */}
          <p className="text-neutral-100 text-xl sm:text-2xl">
            Feel free to reach out, I'm happy to connect!
          </p>

          {/* email and phone links */}
          <div className="mt-6 space-y-4 text-[16px] sm:text-[18px] text-neutral-100">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <a
                href="mailto:abrown33914@gmail.com"
                className="group hover:underline transition-colors duration-200 hover:text-[--rose] break-all flex items-center gap-2"
                style={{ ["--rose"]: theme.rose }}
              >
                <Mail size={20} className="text-white/80 group-hover:text-[--rose] transition-colors" />
                abrown33914@gmail.com
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <a
                href="tel:+1-239-314-4799"
                className="group hover:underline transition-colors duration-200 hover:text-[--rose] flex items-center gap-2"
                style={{ ["--rose"]: theme.rose }}
              >
                <Phone size={20} className="text-white/80 group-hover:text-[--rose] transition-colors" />
                (239) 314-4799
              </a>
            </div>
          </div>

          {/* LinkedIn CTA */}
          <div className="mt-7">
            <a
              href="https://www.linkedin.com/in/allison-brown27/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
                border border-white/15 bg-black/35 backdrop-blur
                text-white/90 shadow-xl shadow-black/10
                transition-all duration-200
                hover:bg-[--rose] hover:text-black hover:border-[--rose]
                focus:outline-none focus:ring-2 focus:ring-[--rose]/50
              "
              style={{ ["--rose"]: theme.rose }}
            >
              <Linkedin size={18} /> Connect on LinkedIn
            </a>
          </div>

          {/* Back to top button and label */}
          <div className="mt-10 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  // prefer scrolling the documentElement for cross-browser consistency
                  const scroller = document.scrollingElement || document.documentElement || document.body;
                  scroller.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Back to Top"
                className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 text-white/90 transition-transform hover:scale-110 outline-none focus:outline-none bg-transparent border-none shadow-none"
                style={{ background: 'none', boxShadow: 'none', border: 'none' }}
              >
                <ChevronUp size={34} strokeWidth={3} />
              </button>
              <span className="text-xs sm:text-sm text-white/80 mt-1">Back to Top</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
