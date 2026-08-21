import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; r: number; vx: number; vy: number; a: number };

/**
 * Subtle drifting particle field. Purely decorative and hidden from
 * assistive tech; skipped entirely when reduced motion is requested.
 */
export function Particles({ density = 42 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let dots: Dot[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const count = Math.max(14, Math.round((density * w) / 1280));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.08 - Math.random() * 0.28,
        a: 0.18 + Math.random() * 0.45,
      }));
    };

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -8) d.y = h + 8;
        if (d.x < -8) d.x = w + 8;
        if (d.x > w + 8) d.x = -8;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.9 0.13 70 / ${d.a})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
