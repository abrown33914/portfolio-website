import { motion } from "framer-motion";

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {title && (
          <motion.h2
            className="text-center text-3xl md:text-4xl font-semibold"
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              // soft, faint halo for readability on busy backgrounds
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.18))"
            }}
          >
            <span className="bg-gradient-to-r from-[#D26FA2] via-[#8C7AE6] to-[#2EC4B6] bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h2>
        )}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}
