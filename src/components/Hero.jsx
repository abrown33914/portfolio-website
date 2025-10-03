import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // subtle parallax on the photo
  const secRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section
      id="home"
      ref={secRef}
      className="relative z-20 min-h-[100svh] pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-12 flex items-center"
    >
      <div
        className="
          mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8
          grid md:grid-cols-[1.1fr,0.9fr] gap-8 sm:gap-12 md:gap-16 items-center
        "
      >
        {/* Text */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center md:text-left"
        >
          <h1 className="text-[2rem] xs:text-[2.25rem] sm:text-5xl md:text-[5.25rem] leading-[1.06] font-semibold font-serif tracking-tight">
            Allison Brown
          </h1>
          <p className="mt-2 sm:mt-3 text-neutral-300 text-[0.95rem] xs:text-base md:text-[1.25rem]">
            Junior Software Engineering student at Florida Gulf Coast University
          </p>

          <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4 justify-center md:justify-start">
            {/* Gradient button → hollow on hover */}
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); scrollToId("about"); }}
              className="
                inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl shadow
                bg-gradient-to-r from-[#D26FA2] to-[#8C7AE6] text-white border border-transparent
                text-[0.9rem] sm:text-base
                transition-all duration-200
                hover:bg-transparent hover:text-white hover:border-white
              "
            >
              <span>See my work</span>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="sm:w-[18px] sm:h-[18px]">
                <path fill="currentColor" d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
              </svg>
            </a>

            {/* Glass outline → teal fill on hover */}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
              className="
                inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl
                border border-white/15 bg-black/35 backdrop-blur
                text-white/90 shadow-xl shadow-black/10
                text-[0.9rem] sm:text-base
                transition-all duration-200
                hover:bg-[#2EC4B6] hover:text-[#0B0B10] hover:border-[#2EC4B6]
                focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/50
              "
            >
              Let’s Talk
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="sm:w-[18px] sm:h-[18px]">
                <path fill="currentColor" d="M12 3C7.03 3 3 6.58 3 11c0 2.02.93 3.85 2.47 5.26-.1.84-.45 2.26-1.48 3.74 1.9-.46 3.33-1.34 4.08-1.92C9.14 18.69 10.54 19 12 19c4.97 0 9-3.58 9-8s-4.03-8-9-8z"/>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Photo with rings (kept on xs, just tighter) */}
        <motion.div
          className="relative justify-self-center md:justify-self-end mt-8 sm:mt-12 md:mt-0 md:ml-3"
          style={{ y: photoY }}
        >
          {/* Dashed ring (xs uses -inset-5; larger screens grow) */}
          <motion.div
            className="absolute -inset-5 xs:-inset-6 sm:-inset-8 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 56, ease: "linear" }}
            style={{
              border: "5px dashed rgba(255, 255, 255, 0.56)",
              maskImage:
                "radial-gradient(circle at 50% 50%, transparent 58%, black 58%, black 70%, transparent 70%)",
            }}
          />
          {/* Gradient ring */}
          <motion.div
            className="absolute -inset-8 xs:-inset-9 sm:-inset-12 rounded-full pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 72, ease: "linear" }}
            style={{
              border: "3px solid transparent",
              background: "conic-gradient(#D26FA2,#8C7AE6,#2EC4B6,#D26FA2)",
              WebkitMask:
                "radial-gradient(circle at 50% 50%, transparent 66%, black 66%, black 68%, transparent 68%)",
              mask:
                "radial-gradient(circle at 50% 50%, transparent 66%, black 66%, black 68%, transparent 68%)",
              filter: "blur(0.3px)",
            }}
          />
          <div
            className="
              relative rounded-full overflow-hidden border border-white/10
              w-[11.5rem] h-[11.5rem] xs:w-[13rem] xs:h-[13rem] sm:w-[20rem] sm:h-[20rem]
            "
          >
            <img src="/me.jpg" alt="Allison" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
