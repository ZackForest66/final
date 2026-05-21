import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  phase: number;
  amplitude: number;
  frequency: number;
}

interface ParticleCanvasProps {
  variant: 'warm' | 'dark';
  className?: string;
}

export default function ParticleCanvas({ variant, className = '' }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = variant === 'dark';
    const count = isDark ? 25 : 35;
    const colors = isDark
      ? ['rgba(255, 107, 53, 0.12)', 'rgba(255, 253, 249, 0.08)']
      : ['rgba(255, 107, 53, 0.15)', 'rgba(250, 246, 241, 0.4)'];
    const speedRange = isDark ? [0.1, 0.3] : [0.2, 0.5];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    function createParticles() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      particlesRef.current = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const colorIndex = i < (isDark ? 10 : 15) ? 0 : 1;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: isDark ? 2 + Math.random() * 4 : 3 + Math.random() * 5,
          speedX: (Math.random() - 0.5) * (speedRange[1] - speedRange[0]) + (Math.random() > 0.5 ? speedRange[0] : -speedRange[0]),
          speedY: (Math.random() - 0.5) * (speedRange[1] - speedRange[0]) * 0.5,
          color: colors[colorIndex],
          phase: Math.random() * Math.PI * 2,
          amplitude: 10 + Math.random() * 15,
          frequency: 0.001 + Math.random() * 0.002,
        });
      }
    }

    function animate() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const repelRadius = 150;
      const repelStrength = isDark ? 0 : 0.3;

      particlesRef.current.forEach((p) => {
        // Base drift
        p.baseX += p.speedX;
        p.baseY += p.speedY;

        // Wrap around
        if (p.baseX < -20) p.baseX = w + 20;
        if (p.baseX > w + 20) p.baseX = -20;
        if (p.baseY < -20) p.baseY = h + 20;
        if (p.baseY > h + 20) p.baseY = -20;

        // Sine wave float
        const sineOffset = Math.sin(performance.now() * p.frequency + p.phase) * p.amplitude;

        // Mouse repel (warm mode only)
        let repelX = 0;
        let repelY = 0;
        if (!isDark) {
          const dx = p.baseX - mouse.x;
          const dy = p.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelRadius && dist > 0) {
            const force = (1 - dist / repelRadius) * repelStrength;
            repelX = (dx / dist) * force * 50;
            repelY = (dy / dist) * force * 50;
          }
        }

        // Spring back to base
        p.x += (p.baseX + sineOffset + repelX - p.x) * 0.05;
        p.y += (p.baseY + repelY - p.y) * 0.05;

        // Draw
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      createParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        animate();
      }
    };

    window.addEventListener('resize', handleResize);
    if (!isDark) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${variant === 'warm' ? 'pointer-events-auto' : ''} ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
