import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // motion values for raw pointer position
  // use smoother, realistic spring params so the follower doesn't overshoot
  // faster but still smooth: higher stiffness, slightly higher damping, lower mass
  const springConfig = { stiffness: 520, damping: 40, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    // hide native cursor and track pointer
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      // restore cursor and cleanup
      document.body.style.cursor = previousCursor || "";
      window.removeEventListener("pointermove", move);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-[999]"   // ⬅️ raise above nav & everything
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
