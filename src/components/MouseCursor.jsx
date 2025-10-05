import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseFollower() {
  // do not render or attach pointer handlers on touch/coarse-pointer devices
  if (typeof window !== "undefined" && window.matchMedia) {
    const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return null;
  }

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // motion values for raw pointer position
  // faster but still smooth: higher stiffness, slightly higher damping, lower mass
  const springConfig = { stiffness: 520, damping: 40, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    // hide native cursor by toggling the `cursor-none` body class
    // (index.css already sets body.cursor-none * { cursor: none !important })
    document.body.classList.add("cursor-none");
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      // restore cursor and cleanup
      document.body.classList.remove("cursor-none");
      window.removeEventListener("pointermove", move);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-[999]"
      // will-change hint helps the browser optimize transforms
      style={{ translateX: springX, translateY: springY, willChange: "transform" }}
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
// custom cursor: small decorative follower using framer-motion springs
// hides native cursor while mounted, restores on unmount
// uses motion values + spring for smooth, snappy follow
