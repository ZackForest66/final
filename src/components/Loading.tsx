import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';

interface LoadingProps {
  onComplete: () => void;
  lang: Lang;
}

const getLoadingSteps = (lang: Lang) => [
  t(lang, 'step1'),
  t(lang, 'step2'),
  t(lang, 'step3'),
];

export default function Loading({ onComplete, lang }: LoadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const loadingSteps = getLoadingSteps(lang);
  const [step, setStep] = useState(0);
  const [text, setText] = useState(loadingSteps[0]);
  const [dots, setDots] = useState('...');

  // Geometry spinner rotation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rotate the three orbiting shapes
      const shapes = spinnerRef.current?.querySelectorAll('.orbit-shape');
      if (shapes) {
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: 'none',
            delay: i * 1,
          });
        });
      }

      // Breathing animation for the whole spinner
      gsap.to(spinnerRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Loading dots animation
  useEffect(() => {
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Step transitions
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step 0 → 1
    timers.push(setTimeout(() => {
      transitionToStep(1);
    }, 1000));

    // Step 1 → 2
    timers.push(setTimeout(() => {
      transitionToStep(2);
    }, 2000));

    // Step 2 → Complete
    timers.push(setTimeout(() => {
      onComplete();
    }, 3500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  function transitionToStep(newStep: number) {
    // Fade out old text
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setStep(newStep);
          setText(loadingSteps[newStep]);
          // Fade in new text
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
          );
        },
      });
    } else {
      setStep(newStep);
      setText(loadingSteps[newStep]);
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative px-6"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      {/* CSS gradient fallback */}
      <div className="fixed inset-0 gradient-quiz pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Brand */}
        <p
          className="font-display font-bold text-2xl tracking-[0.15em] uppercase"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          ARTYPE
        </p>

        {/* Loading title */}
        <p
          className="mt-6 font-body font-medium text-[#FFFDF9]"
          style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
        >
          {t(lang, 'loadingTitle')}{dots}
        </p>

        {/* Geometry spinner */}
        <svg
          ref={spinnerRef}
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="mt-10"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.2))' }}
        >
          {/* Center circle */}
          <circle
            cx="100"
            cy="100"
            r="20"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2"
          />

          {/* Orbit track (subtle) */}
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="rgba(255, 107, 53, 0.08)"
            strokeWidth="1"
          />

          {/* Three orbiting shapes */}
          <g className="orbit-shape" style={{ transformOrigin: '100px 100px' }}>
            {/* Triangle at top */}
            <polygon
              points="100,52 108,68 92,68"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="1.5"
              opacity="0.8"
            />
          </g>

          <g
            className="orbit-shape"
            style={{ transformOrigin: '100px 100px', transform: 'rotate(120deg)' }}
          >
            {/* Square */}
            <rect
              x="92"
              y="52"
              width="16"
              height="16"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>

          <g
            className="orbit-shape"
            style={{ transformOrigin: '100px 100px', transform: 'rotate(240deg)' }}
          >
            {/* Hexagon */}
            <polygon
              points="100,50 106,53 106,61 100,64 94,61 94,53"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="1.5"
              opacity="0.7"
            />
          </g>

          {/* Connecting lines between shapes */}
          <line
            x1="100"
            y1="60"
            x2="100"
            y2="60"
            stroke="rgba(255, 107, 53, 0.2)"
            strokeWidth="1"
          >
            <animate
              attributeName="x2"
              values="100;65;100"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="60;134;60"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="100"
            y1="60"
            x2="100"
            y2="60"
            stroke="rgba(255, 107, 53, 0.2)"
            strokeWidth="1"
          >
            <animate
              attributeName="x2"
              values="100;135;100"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="60;134;60"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
        </svg>

        {/* Step indicators */}
        <div className="flex gap-2 mt-10">
          {loadingSteps.map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i < step
                    ? '#FF6B35'
                    : i === step
                    ? '#FF6B35'
                    : 'rgba(255, 255, 255, 0.15)',
                transform: i === step ? 'scale(1.3)' : 'scale(1)',
                boxShadow:
                  i === step ? '0 0 8px rgba(255, 107, 53, 0.5)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Step text */}
        <p
          ref={textRef}
          className="mt-4 text-sm text-[#8A7E72] font-body text-center"
        >
          {text}
        </p>
      </div>
    </div>
  );
}
