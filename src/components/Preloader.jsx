import { useEffect, useRef } from "react";

/**
 * Single <canvas> starfield:
 * - Modest number of stars for mobile performance.
 * - Gentle drift + twinkle.
 * - Tiny mouse parallax (hardware-accelerated).
 * - Resizes correctly and stays behind content (pointer-events: none).
 */
export default function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    // Tunable settings
    const STARS = 240;           // density (lower = faster)
    const DRIFT = 0.05;          // px/frame
    const TW_BASE = 0.16;        // base alpha (dim base)
    const TW_AMP = 0.60;         // twinkle amplitude
    const MAX_ALPHA = 0.74;      // cap overall brightness
    const PARALLAX = 12;         // px max parallax
    const DPR_CAP = 2;

    // Internal state
    let stars = [];
    let running = true;
    const size = { w: window.innerWidth, h: window.innerHeight };
    let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const target = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };

    const setCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.style.width = size.w + "px";
      canvas.style.height = size.h + "px";
      canvas.width = Math.floor(size.w * dpr);
      canvas.height = Math.floor(size.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      stars = Array.from({ length: STARS }, () => {
        const near = Math.random() < 0.15;
        return {
          x: Math.random() * size.w,
          y: Math.random() * size.h,
          r: near ? 1.6 : 1.0,
          dx: (Math.random() - 0.5) * DRIFT,
          dy: (Math.random() - 0.5) * DRIFT,
          phase: Math.random() * Math.PI * 2,
          tw: Math.random() * 0.9 + 0.5,
          depth: near ? 1.15 + Math.random() * 0.1 : 0.55 + Math.random() * 0.25,
        };
      });
    };

    setCanvas();
    seed();

    // Scale star positions on resize so field fills new size
    let rAF = 0;
    const onResize = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        const oldW = size.w, oldH = size.h;
        size.w = window.innerWidth; size.h = window.innerHeight;
        setCanvas();
        const sx = oldW ? size.w / oldW : 1;
        const sy = oldH ? size.h / oldH : 1;
        for (const s of stars) { s.x *= sx; s.y *= sy; }
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Small parallax on fine pointers
    const fine = matchMedia && matchMedia("(pointer:fine)").matches;
    const onMove = (e) => {
      if (!fine) return;
      const cx = size.w / 2, cy = size.h / 2;
      target.x = ((e.clientX - cx) / cx) * PARALLAX;
      target.y = ((e.clientY - cy) / cy) * PARALLAX;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Render loop
    const tick = () => {
      if (!running) return;
      // ease toward target
      offset.x += (target.x - offset.x) * 0.07;
      offset.y += (target.y - offset.y) * 0.07;

      const w = size.w, h = size.h;
      ctx.clearRect(0, 0, w, h);

      // Subtle color auras for depth; very light to keep it clean
      const g1 = ctx.createRadialGradient(w*0.15,h*0.15,0,w*0.15,h*0.15,Math.max(w,h)*0.6);
      g1.addColorStop(0,"rgba(210,111,162,0.14)"); g1.addColorStop(1,"transparent");
      ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);
      const g2 = ctx.createRadialGradient(w*0.85,h*0.18,0,w*0.85,h*0.18,Math.max(w,h)*0.5);
      g2.addColorStop(0,"rgba(140,122,230,0.10)"); g2.addColorStop(1,"transparent");
      ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);

      // Stars
      ctx.fillStyle = "#fff";
      for (const s of stars) {
        s.phase += 0.02 + s.tw * 0.01;
        s.x += s.dx; s.y += s.dy;

        // wrap
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;

        let a = TW_BASE + Math.abs(Math.sin(s.phase)) * TW_AMP * s.tw;
        if (a > MAX_ALPHA) a = MAX_ALPHA;
        ctx.globalAlpha = a;

        // parallax by depth
        const ox = offset.x * s.depth;
        const oy = offset.y * s.depth;

        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 select-none" aria-hidden />;
}
