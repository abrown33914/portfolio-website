import { useEffect, useRef } from "react";

// StarCanvas: a lightweight animated starfield drawn to a <canvas>
// Frequent comments below explain the variables and steps so it's easy to
// understand when reading as a student or contributor.
export default function StarCanvas() {
  // reference to the <canvas> DOM node
  const canvasRef = useRef(null);

  useEffect(() => {
    // get the canvas and 2D context (alpha true so we can composite)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    // ----- TUNABLE SETTINGS -----
    // how many stars to render; reduce if you need better performance
    const STARS = 240; // density (lower = faster)
    // small motion per frame for each star
    const DRIFT = 0.05; // px/frame
    // base alpha for twinkle (dim base)
    const TW_BASE = 0.16;
    // twinkle amplitude multiplier
    const TW_AMP = 0.60;
    // cap overall brightness to avoid glare
    const MAX_ALPHA = 0.74;
    // maximum parallax offset in pixels when moving pointer
    const PARALLAX = 12;
    // device pixel ratio cap to avoid very large canvas sizes on high-DPR displays
    const DPR_CAP = 2;

    // ----- INTERNAL STATE -----
    let stars = []; // array of star objects
    let running = true; // flag used to stop the animation on unmount
    const size = { w: window.innerWidth, h: window.innerHeight }; // viewport size
    let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP); // pixel ratio used
    const target = { x: 0, y: 0 }; // desired parallax target
    const offset = { x: 0, y: 0 }; // eased parallax offset

    // configure canvas size and scale based on dpr
    const setCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.style.width = size.w + "px";
      canvas.style.height = size.h + "px";
      canvas.width = Math.floor(size.w * dpr);
      canvas.height = Math.floor(size.h * dpr);
      // setTransform scales drawing operations to account for DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // seed the stars: create objects with position, radius, motion and phase
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

    // initialize canvas and stars
    setCanvas();
    seed();

    // ----- HANDLERS -----
    // handle resize: rescale canvas and adjust star positions proportionally
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

    // pointer move: small parallax effect for fine pointers (mouse, trackpad)
    const fine = matchMedia && matchMedia("(pointer:fine)").matches;
    const onMove = (e) => {
      if (!fine) return; // ignore coarse pointers (touch)
      const cx = size.w / 2, cy = size.h / 2; // center of viewport
      // compute normalized target offset based on cursor position
      target.x = ((e.clientX - cx) / cx) * PARALLAX;
      target.y = ((e.clientY - cy) / cy) * PARALLAX;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ----- RENDER LOOP -----
    const tick = () => {
      if (!running) return; // stop if unmounted
      // ease offset toward target for smooth parallax
      offset.x += (target.x - offset.x) * 0.07;
      offset.y += (target.y - offset.y) * 0.07;

      const w = size.w, h = size.h;
      ctx.clearRect(0, 0, w, h);

      // draw subtle color auras to add depth (very faint)
      const g1 = ctx.createRadialGradient(w*0.15,h*0.15,0,w*0.15,h*0.15,Math.max(w,h)*0.6);
      g1.addColorStop(0,"rgba(210,111,162,0.14)"); g1.addColorStop(1,"transparent");
      ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);
      const g2 = ctx.createRadialGradient(w*0.85,h*0.18,0,w*0.85,h*0.18,Math.max(w,h)*0.5);
      g2.addColorStop(0,"rgba(140,122,230,0.10)"); g2.addColorStop(1,"transparent");
      ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);

      // draw each star: update phase, position, wrap and then draw
      ctx.fillStyle = "#fff";
      for (const s of stars) {
        // advance twinkle phase and position
        s.phase += 0.02 + s.tw * 0.01;
        s.x += s.dx; s.y += s.dy;

        // wrap stars to other side when they leave viewport
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;

        // compute alpha with twinkle and clamp
        let a = TW_BASE + Math.abs(Math.sin(s.phase)) * TW_AMP * s.tw;
        if (a > MAX_ALPHA) a = MAX_ALPHA;
        ctx.globalAlpha = a;

        // parallax offset scaled by depth
        const ox = offset.x * s.depth;
        const oy = offset.y * s.depth;

        // draw a small circle for the star
        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // reset alpha after drawing loop
      ctx.globalAlpha = 1;

      // schedule next frame
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // cleanup on unmount: stop animation and remove listeners
    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // canvas is fixed and behind all content; aria-hidden since it's decorative
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 select-none" aria-hidden />;
}
