import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // slightly snappier feel; tweak if you want
  const springX = useSpring(x, { stiffness: 1000, damping: 50, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 1000, damping: 50, mass: 0.6 });

  useEffect(() => {
    document.body.classList.add("cursor-none");
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("pointermove", move);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-[999]"   // ⬅️ raise above nav & everything
      style={{ translateX: springX, translateY: springY }}
      aria-hidden
    >
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          background: "#fff",
          boxShadow: "0 0 14px rgba(255,255,255,0.85)",
          mixBlendMode: "difference",
        }}
      />
    </motion.div>
  );
}
