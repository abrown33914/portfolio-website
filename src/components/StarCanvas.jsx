import { useEffect, useRef } from "react";

// lightweight starfield drawn to a <canvas>
// concise developer comments; tunables below
export default function StarCanvas() {
  // canvas DOM ref
  const canvasRef = useRef(null);

  useEffect(() => {
    // get canvas and 2D context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

  // tunables
  const STARS = 180; // star count (lower = faster)
  const DRIFT = 0.035; // base drift px/frame (slightly lower for less jitter)
  const TW_BASE = 0.16; // twinkle base alpha
  const TW_AMP = 0.6; // twinkle amplitude
  const MAX_ALPHA = 0.74; // brightness cap
  const PARALLAX = 22; // max parallax px (stronger mouse effect)
  const DPR_CAP = 2; // cap devicePixelRatio

  // internal state
  let stars = [];
  let running = true; // stop flag for cleanup
  const size = { w: window.innerWidth, h: window.innerHeight };
  let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  const target = { x: 0, y: 0 };
  const offset = { x: 0, y: 0 }; // eased offset for smooth parallax
  // velocity used by spring smoothing
  const offsetVel = { x: 0, y: 0 };
  // cached gradients to avoid recreating them each frame
  let g1 = null, g2 = null;
  // raw pointer position set from events; tick will compute target from this
  const rawPointer = { x: size.w / 2, y: size.h / 2 };

    // set canvas size & scale for DPR
    const setCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.style.width = size.w + "px";
      canvas.style.height = size.h + "px";
      canvas.width = Math.floor(size.w * dpr);
      canvas.height = Math.floor(size.h * dpr);
      // setTransform scales drawing operations to account for DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // update gradients whenever canvas size changes
      const maxDim = Math.max(size.w, size.h);
      g1 = ctx.createRadialGradient(size.w * 0.15, size.h * 0.15, 0, size.w * 0.15, size.h * 0.15, maxDim * 0.6);
      g1.addColorStop(0, "rgba(210,111,162,0.14)");
      g1.addColorStop(1, "transparent");
      g2 = ctx.createRadialGradient(size.w * 0.85, size.h * 0.18, 0, size.w * 0.85, size.h * 0.18, maxDim * 0.5);
      g2.addColorStop(0, "rgba(140,122,230,0.10)");
      g2.addColorStop(1, "transparent");
    };

  // seed stars with position, velocity, twinkle phase and depth
    const seed = () => {
      stars = Array.from({ length: STARS }, () => {
        const near = Math.random() < 0.15; // some stars are 'nearer' (brighter, larger)
        return {
          x: Math.random() * size.w, // x position in px
          y: Math.random() * size.h, // y position in px
          r: near ? 1.6 : 1.0, // radius in px
          dx: (Math.random() - 0.5) * DRIFT, // x velocity
          dy: (Math.random() - 0.5) * DRIFT, // y velocity
          phase: Math.random() * Math.PI * 2, // phase for twinkling
          tw: Math.random() * 0.9 + 0.5, // twinkle speed multiplier
          depth: near ? 1.15 + Math.random() * 0.1 : 0.55 + Math.random() * 0.25, // depth for parallax
        };
      });
    };

  // init canvas and stars
    setCanvas();
    seed();

  // handlers
  // resize: rescale canvas and adjust star positions
    let rAF = 0; // store animation frame id used by resize handler
    const onResize = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        const oldW = size.w, oldH = size.h;
        size.w = window.innerWidth; size.h = window.innerHeight;
        setCanvas();
        // scale star positions so the field stretches nicely
        const sx = oldW ? size.w / oldW : 1;
        const sy = oldH ? size.h / oldH : 1;
        for (const s of stars) { s.x *= sx; s.y *= sy; }
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

  // pointer move: record raw pointer; tick computes eased target
    const fine = matchMedia && matchMedia("(pointer:fine)").matches;
    const onMove = (e) => {
      if (!fine) return;
      rawPointer.x = e.clientX;
      rawPointer.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

  // render loop with spring smoothing
    const tick = () => {
      if (!running) return;
      // compute target from the raw pointer each frame
      const cx = size.w / 2, cy = size.h / 2;
      target.x = ((rawPointer.x - cx) / cx) * PARALLAX;
      target.y = ((rawPointer.y - cy) / cy) * PARALLAX;

  // spring params
  const k = 0.18; // stiffness
  const damping = 0.82; // damping

  // update spring velocity -> offset
      offsetVel.x += (target.x - offset.x) * k;
      offsetVel.y += (target.y - offset.y) * k;
      offsetVel.x *= damping;
      offsetVel.y *= damping;
      offset.x += offsetVel.x;
      offset.y += offsetVel.y;

      const w = size.w, h = size.h;
      ctx.clearRect(0, 0, w, h);

  // faint color auras (use cached gradients)
  if (g1) { ctx.fillStyle = g1; ctx.fillRect(0,0,w,h); }
  if (g2) { ctx.fillStyle = g2; ctx.fillRect(0,0,w,h); }

  // draw stars
      ctx.fillStyle = "#fff";
      for (const s of stars) {
  s.phase += 0.02 + s.tw * 0.01; // twinkle
        s.x += s.dx; s.y += s.dy;

        // wrap when out of view
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;

        // alpha with twinkle
        let a = TW_BASE + Math.abs(Math.sin(s.phase)) * TW_AMP * s.tw;
        if (a > MAX_ALPHA) a = MAX_ALPHA;
        ctx.globalAlpha = a;

  // parallax offset scaled by depth
  const ox = offset.x * s.depth * 1.1;
  const oy = offset.y * s.depth * 1.1;

        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // cleanup on unmount
    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  // decorative canvas behind page content
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 select-none" aria-hidden />;
}
