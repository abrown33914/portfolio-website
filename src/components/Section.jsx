import { motion } from "framer-motion";

// Section: small wrapper used for each major page section
// - id: optional DOM id to target for in-page links
// - title: optional string shown as the section heading
// - children: the section content (cards, text, etc.)
export default function Section({ id, title, children }) {
  return (
    // outer section element that controls vertical spacing for the section
    <section id={id} className="py-20">
      {/* center content and constrain width for readability */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* If a title was provided, render a subtle animated heading */}
        {title && (
          <motion.h2
            className="text-center text-3xl md:text-4xl font-semibold"
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              /*
               Small visual tweak: add a faint drop-shadow so the heading
               remains readable if a background image or gradient shows
               through. Adjust the rgba and blur if you want a stronger halo.
              */
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.18))"
            }}
          >
            {/* Gradient text for the section title to match brand colors */}
            <span className="bg-gradient-to-r from-[#D26FA2] via-[#8C7AE6] to-[#2EC4B6] bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h2>
        )}

        {/* spacing before the section content; only add top margin when title exists */}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}
