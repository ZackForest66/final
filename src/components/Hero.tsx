import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Eye, Heart, Palette, Clock } from 'lucide-react';
import { t } from '../data/translations';
import type { Lang } from '../data/translations';

interface HeroProps {
  onStart: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function Hero({ onStart, lang, setLang }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = containerRef.current?.querySelectorAll('.hero-line');
      if (lines) {
        gsap.set(lines, { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' });
        gsap.to(lines[0], { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', delay: 0.2 });
        gsap.to(lines[1], { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', delay: 0.4 });
        gsap.to(lines[2], { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', delay: 0.6 });
      }
      const sub = containerRef.current?.querySelector('.hero-sub');
      if (sub) { gsap.set(sub, { opacity: 0 }); gsap.to(sub, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 }); }
      const cta = containerRef.current?.querySelector('.hero-cta');
      if (cta) { gsap.set(cta, { opacity: 0, y: 20 }); gsap.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.0 }); }
      const badge = containerRef.current?.querySelector('.hero-badge');
      if (badge) { gsap.set(badge, { opacity: 0, y: 10 }); gsap.to(badge, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 1.2 }); }
      const cards = containerRef.current?.querySelectorAll('.dim-card');
      if (cards?.length) { gsap.set(cards, { opacity: 0, y: 30 }); gsap.to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 1.4 }); }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const dimCards = [
    { icon: Eye, label: t(lang, 'dimPerception'), sub: lang === 'zh' ? '直觉 · 观察' : 'Intuition · Observation' },
    { icon: Heart, label: t(lang, 'dimMotivation'), sub: lang === 'zh' ? '情感 · 理性' : 'Emotion · Reason' },
    { icon: Palette, label: t(lang, 'dimExpression'), sub: lang === 'zh' ? '前卫 · 传统' : 'Avant-garde · Tradition' },
    { icon: Clock, label: t(lang, 'dimRhythm'), sub: lang === 'zh' ? '流动 · 结构' : 'Flow · Structure' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center relative px-6 py-12" style={{ backgroundColor: '#FAF6F1' }}>
      <div className="absolute inset-0 animate-gradient-shift" style={{ background: 'linear-gradient(135deg, #FAF6F1 0%, #F0EBE3 50%, #FAF6F1 100%)', backgroundSize: '200% 200%' }} />

      {/* Language switcher */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <button onClick={() => setLang('zh')} className={`lang-btn ${lang === 'zh' ? 'active' : ''}`}>中文</button>
        <button onClick={() => setLang('en')} className={`lang-btn ${lang === 'en' ? 'active' : ''}`}>EN</button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
        <div className="overflow-hidden">
          <div className="hero-line font-display font-black text-[#1A1A1A] tracking-[-0.03em] leading-[1.1]" style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}>ARTYPE</div>
          <div className="hero-line font-display font-black text-[#1A1A1A] tracking-[-0.03em] leading-[1.1] mt-2" style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>{t(lang, 'title1')}</div>
          <div className="hero-line font-display font-black tracking-[-0.03em] leading-[1.1] mt-2" style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#FF6B35' }}>{t(lang, 'title2')}</div>
        </div>

        <p className="hero-sub mt-6 text-[#8A7E72] font-body text-center leading-relaxed max-w-md" style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 400 }}>{t(lang, 'subtitle')}</p>

        <button className="hero-cta mt-10 px-10 py-4 rounded-2xl font-body font-semibold text-lg text-[#FFFDF9] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]" style={{ backgroundColor: '#FF6B35', boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)' }} onClick={onStart}>
          {t(lang, 'start')}
        </button>

        <div className="hero-badge mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: 'rgba(255, 253, 249, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(232, 226, 219, 0.6)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-glow inline-block" style={{ backgroundColor: '#FF6B35' }} />
          <span className="text-[13px] text-[#8A7E72] font-medium font-body">{t(lang, 'countBadge')}</span>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {dimCards.map((dim, i) => {
            const Icon = dim.icon;
            return (
              <div key={i} className="dim-card flex flex-col items-center px-5 py-5 rounded-2xl w-[140px]" style={{ background: 'rgba(255, 253, 249, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(232, 226, 219, 0.6)' }}>
                <Icon size={24} style={{ color: '#FF6B35' }} />
                <span className="mt-3 text-sm font-semibold text-[#2D2D2D] font-body">{dim.label}</span>
                <span className="mt-1 text-[11px] text-[#8A7E72] font-body">{dim.sub}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-8 font-display text-[20px] font-semibold text-[#2D2D2D] tracking-[0.02em]">{t(lang, 'footerDim')}</p>
        <p className="mt-12 text-xs text-[#8A7E72] font-body text-center pb-6">{t(lang, 'footerCopy')}</p>
      </div>
    </div>
  );
}
