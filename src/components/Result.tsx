import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Camera, Link, Share2, RotateCcw, Compass, Lightbulb, Palette, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PersonalityType } from '../data/personalityTypes';
import type { DimensionScores } from '../utils/scoring';
import { t } from '../data/translations';
import type { Lang } from '../data/translations';
import { getAvatar } from '../data/avatarMap';
import { copyToClipboard, getShareUrl } from '../utils/share';
import html2canvas from 'html2canvas';
import '../utils/qrinit';

interface ResultProps {
  personalityType: PersonalityType;
  scores: DimensionScores;
  percentages: Record<string, number>;
  onRestart: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const dimLabelMap: Record<string, Record<string, string>> = {
  zh: { N: '直觉', S: '观察', F: '情感', T: '理性', A: '前卫', C: '传统', X: '流动', R: '结构' },
  en: { N: 'Intuition', S: 'Observation', F: 'Emotion', T: 'Reason', A: 'Avant-garde', C: 'Tradition', X: 'Flow', R: 'Structure' },
};

const glowColors: Record<string, string> = {
  N: 'rgba(255, 107, 53, 0.08)', S: 'rgba(138, 126, 114, 0.08)',
  F: 'rgba(255, 140, 100, 0.08)', T: 'rgba(100, 150, 200, 0.06)',
  A: 'rgba(200, 80, 180, 0.06)', C: 'rgba(180, 160, 120, 0.08)',
  X: 'rgba(100, 200, 180, 0.06)', R: 'rgba(150, 150, 170, 0.06)',
};

const styleImageMap: Record<string, string> = {
  nf: './images/style-nf.jpg', nt: './images/style-nt.jpg',
  sf: './images/style-sf.jpg', st: './images/style-st.jpg',
};

const expressionFilter: Record<string, string> = {
  A: 'saturate(1.15) contrast(1.05)', C: 'saturate(0.9) sepia(0.08)',
};

function RadarChart({ percentages, code, lang }: { percentages: Record<string, number>; code: string; lang: Lang }) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const polygon = svgRef.current?.querySelector('.radar-polygon');
    if (polygon) {
      gsap.fromTo(polygon, { scale: 0, transformOrigin: '100 100' }, { scale: 1, duration: 0.8, ease: 'power3.out', delay: 1.4 });
    }
  }, []);

  const dims = code.split('') as string[];
  const activeDims = [dims[0] === 'N' ? 'N' : 'S', dims[1] === 'F' ? 'F' : 'T', dims[2] === 'A' ? 'A' : 'C', dims[3] === 'X' ? 'X' : 'R'];
  const size = 200, center = size / 2, radius = 70, angleStep = (Math.PI * 2) / 4;
  const levels = [0.25, 0.5, 0.75, 1];

  const points = activeDims.map((dim, i) => {
    const pct = percentages[dim] || 50;
    const r = (pct / 100) * radius;
    const angle = i * angleStep - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), label: dimLabelMap[lang][dim] || dim };
  });

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto" style={{ aspectRatio: '1/1' }}>
      {levels.map((level) => {
        const lp = Array.from({ length: 4 }, (_, i) => {
          const a = i * angleStep - Math.PI / 2;
          const r = level * radius;
          return `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`;
        }).join(' ');
        return <polygon key={level} points={lp} fill="none" stroke="#E8E2DB" strokeWidth="1" />;
      })}
      {Array.from({ length: 4 }, (_, i) => {
        const a = i * angleStep - Math.PI / 2;
        return <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(a)} y2={center + radius * Math.sin(a)} stroke="#E8E2DB" strokeWidth="1" />;
      })}
      <polygon className="radar-polygon" points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(255, 107, 53, 0.15)" stroke="#FF6B35" strokeWidth="2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#FF6B35" />
          <text x={center + (radius + 18) * Math.cos(i * angleStep - Math.PI / 2)} y={center + (radius + 18) * Math.sin(i * angleStep - Math.PI / 2)} textAnchor="middle" dominantBaseline="central" fill="#8A7E72" fontSize="11" fontFamily="Inter, sans-serif">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Result({ personalityType, percentages, onRestart, lang, setLang }: ResultProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);

  const tx = (key: string) => t(lang, key);
  const glowColor = glowColors[personalityType.code[0]] || 'rgba(255, 107, 53, 0.08)';
  const avatar = getAvatar(personalityType.code);
  const styleImg = styleImageMap[personalityType.styleImageKey] || './images/style-nf.jpg';
  const imgFilter = expressionFilter[personalityType.code[2]] || '';

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(cardRef.current, { rotateY: 90, scale: 0.85, opacity: 0 }, { rotateY: 0, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)', delay: 0.4 });
      }
      const contents = cardRef.current?.querySelectorAll('.card-content');
      if (contents) {
        gsap.fromTo(contents, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out', delay: 0.8 });
      }
      const revealEls = containerRef.current?.querySelectorAll('.reveal-item');
      if (revealEls) {
        gsap.fromTo(revealEls, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 1.2 });
      }
      const traitEls = containerRef.current?.querySelectorAll('.trait-item');
      if (traitEls) {
        gsap.fromTo(traitEls, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 1.6 });
      }
      const buttons = containerRef.current?.querySelectorAll('.action-button');
      if (buttons) {
        gsap.fromTo(buttons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 2.0 });
      }
    }, containerRef);

    // Generate QR code on result card
    if (typeof (window as any).QRCode !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('qr-result');
        if (el) {
          el.innerHTML = '';
          new (window as any).QRCode(el, { text: window.location.href, width: 56, height: 56, colorDark: '#1A1A1A', colorLight: '#FFFDF9', correctLevel: (window as any).QRCode.CorrectLevel.M });
        }
      }, 500);
    }

    return () => ctx.revert();
  }, []);

  // Generate QR for WeChat modal
  useEffect(() => {
    if (showQR && typeof (window as any).QRCode !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('qr-wechat');
        if (el) {
          el.innerHTML = '';
          new (window as any).QRCode(el, { text: window.location.href, width: 180, height: 180, colorDark: '#1A1A1A', colorLight: '#FFFDF9', correctLevel: (window as any).QRCode.CorrectLevel.M });
        }
      }, 50);
    }
  }, [showQR]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setCardTilt({
      rotateX: Math.max(-5, Math.min(5, (e.clientY - cy) * 0.01)),
      rotateY: Math.max(-5, Math.min(5, (e.clientX - cx) * -0.01)),
    });
  }, []);

  const handleSaveImage = useCallback(async () => {
    if (!resultCardRef.current) return;
    try {
      const canvas = await html2canvas(resultCardRef.current, { backgroundColor: null, scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `ARTYPE-${personalityType.code}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('Failed to save image:', err); }
  }, [personalityType.code]);

  return (
    <div ref={containerRef} className="min-h-screen relative px-6 py-6" style={{ backgroundColor: '#FAF6F1' }}>
      <div className="fixed inset-0 animate-gradient-shift pointer-events-none" style={{ background: 'linear-gradient(135deg, #FAF6F1 0%, #F0EBE3 50%, #FAF6F1 100%)', backgroundSize: '200% 200%', zIndex: 0 }} />

      <div className="relative z-10 max-w-[960px] mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button onClick={onRestart} className="font-display font-bold text-lg tracking-[0.1em] text-[#8A7E72] hover:text-[#FF6B35] transition-colors duration-200 cursor-pointer bg-transparent border-none">ARTYPE</button>
          <div className="flex gap-2">
            <button onClick={() => setLang('zh')} className={`lang-btn ${lang === 'zh' ? 'active' : ''}`}>中文</button>
            <button onClick={() => setLang('en')} className={`lang-btn ${lang === 'en' ? 'active' : ''}`}>EN</button>
          </div>
        </div>

        <p className="mt-8 text-center font-body font-medium text-base text-[#8A7E72] tracking-[0.05em]">{tx('resultTitle')}</p>

        {/* CARTOON AVATAR */}
        <div className="reveal-item flex justify-center mt-6">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden animate-float" style={{ border: '3px solid #FF6B35', boxShadow: '0 8px 32px rgba(255, 107, 53, 0.25)', background: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)' }}>
            <img src={avatar} alt={personalityType.chineseName} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 3D Result Card */}
        <div className="card-3d-container mt-5 mx-auto" style={{ maxWidth: '560px', width: '100%', perspective: '1200px' }} onMouseMove={handleMouseMove} onMouseLeave={() => setCardTilt({ rotateX: 0, rotateY: 0 })}>
          <div ref={cardRef} className="card-3d relative rounded-[20px] overflow-hidden" style={{ aspectRatio: '4/5', background: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 50%, #2D2D2D 100%)', border: '1px solid rgba(255, 107, 53, 0.2)', boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15)', transform: `perspective(1200px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`, transition: 'transform 0.15s ease-out' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 30%, ${glowColor} 0%, transparent 60%)` }} />
            <div ref={resultCardRef} className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-10" style={{ background: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 50%, #2D2D2D 100%)' }}>
              <span className="card-content font-body font-bold text-sm tracking-[0.2em]" style={{ color: '#FF6B35' }}>{personalityType.code}</span>
              <div className="card-content flex gap-2 mt-2">
                {personalityType.code.split('').map((ch, i) => (
                  <span key={i} className="text-[11px] text-[#8A7E72] font-body">{dimLabelMap[lang][ch] || ch}</span>
                ))}
              </div>
              <div className="card-content mt-6" style={{ width: '40px', height: '2px', backgroundColor: '#FF6B35', opacity: 0.5 }} />
              <h2 className="card-content font-display font-black text-[#FFFDF9] text-center mt-6 leading-[1.1]" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>{personalityType.englishName}</h2>
              <h3 className="card-content font-body font-bold text-center mt-2" style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#FF6B35' }}>{personalityType.chineseName}</h3>
              <div className="card-content mt-6" style={{ width: '40px', height: '2px', backgroundColor: '#FF6B35', opacity: 0.5 }} />
              <p className="card-content font-display italic text-center mt-6 max-w-[80%] leading-relaxed" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255, 253, 249, 0.7)' }}>&ldquo;{personalityType.quote}&rdquo;</p>
              {/* QR code on card — small, bottom right */}
              <div className="card-content absolute bottom-4 right-4" style={{ zIndex: 20 }}>
                <div id="qr-result" className="rounded-lg overflow-hidden" style={{ background: '#FFFDF9', padding: '4px', width: '64px', height: '64px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="reveal-item mt-8 text-center font-body text-base text-[#2D2D2D] leading-[1.7] max-w-[560px] mx-auto">{personalityType.description[lang]}</p>

        {/* Art Style */}
        <div className="reveal-item mt-12 max-w-[720px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} style={{ color: '#FF6B35' }} />
            <h3 className="text-lg font-semibold text-[#2D2D2D] font-body">{tx('artStyle')}</h3>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
            <img src={styleImg} alt={personalityType.artStyle} className="w-full h-auto object-cover" style={{ filter: imgFilter, aspectRatio: '3/2' }} loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.2) 50%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-body font-bold text-[#FFFDF9] text-lg">{personalityType.artStyle}</p>
              <p className="font-body text-sm text-[rgba(255,253,249,0.7)] mt-1">{personalityType.artStyleEn}</p>
            </div>
          </div>
        </div>

        {/* Artist Gallery */}
        <div className="reveal-item mt-12 max-w-[720px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} style={{ color: '#FF6B35' }} />
            <h3 className="text-lg font-semibold text-[#2D2D2D] font-body">{tx('artists')}</h3>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFDF9', border: '1px solid #E8E2DB', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <img src={personalityType.matchedArtists[galleryIndex].image || styleImg} alt={personalityType.matchedArtists[galleryIndex].name} className="w-full h-full object-cover transition-all duration-500" style={{ filter: imgFilter }} loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(26,26,26,0.75) 100%)' }} />
              <button onClick={() => setGalleryIndex((p) => (p - 1 + personalityType.matchedArtists.length) % personalityType.matchedArtists.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}><ChevronLeft size={20} color="#FFFDF9" /></button>
              <button onClick={() => setGalleryIndex((p) => (p + 1) % personalityType.matchedArtists.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}><ChevronRight size={20} color="#FFFDF9" /></button>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-body text-xs text-[rgba(255,253,249,0.7)] mb-1">{tx('masterpiece')}</p>
                    <p className="font-body text-sm font-medium text-[#FFFDF9]">{personalityType.matchedArtists[galleryIndex].masterpiece}</p>
                  </div>
                  <span className="text-xs text-[rgba(255,253,249,0.5)] font-body tabular-nums">{galleryIndex + 1} / {personalityType.matchedArtists.length}</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display font-bold text-xl text-[#2D2D2D]">{personalityType.matchedArtists[galleryIndex].name}</h4>
                    <span className="text-xs text-[#8A7E72] font-body">{personalityType.matchedArtists[galleryIndex].nameEn}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-body font-medium" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', color: '#FF6B35' }}>{personalityType.matchedArtists[galleryIndex].field}</span>
                    <span className="text-xs text-[#8A7E72] font-body">{personalityType.matchedArtists[galleryIndex].era}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E8E2DB' }}>
                <p className="text-sm text-[#2D2D2D] leading-relaxed font-body">{personalityType.matchedArtists[galleryIndex].whyMatch}</p>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {personalityType.matchedArtists.map((_, i) => (
                  <button key={i} onClick={() => setGalleryIndex(i)} className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer" style={{ backgroundColor: i === galleryIndex ? '#FF6B35' : '#E8E2DB', transform: i === galleryIndex ? 'scale(1.3)' : 'scale(1)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dimension + Traits */}
        <div className="reveal-item mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
          <div>
            <h3 className="text-lg font-semibold text-[#2D2D2D] font-body mb-4">{tx('dimension')}</h3>
            <RadarChart percentages={percentages} code={personalityType.code} lang={lang} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2D2D2D] font-body mb-4">{tx('traits')}</h3>
            <div className="flex flex-col gap-3">
              {personalityType.traits.map((trait, i) => (
                <div key={i} className="trait-item flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 253, 249, 0.8)', border: '1px solid #E8E2DB' }}>
                  <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: '#FF6B35' }} />
                  <span className="text-sm font-medium text-[#2D2D2D] font-body">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exploration Tips */}
        <div className="reveal-item mt-12 max-w-[720px] mx-auto">
          <div className="flex items-center gap-2 mb-4"><Compass size={18} style={{ color: '#FF6B35' }} /><h3 className="text-lg font-semibold text-[#2D2D2D] font-body">{tx('explore')}</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personalityType.explorationTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#FFFDF9', border: '1px solid #E8E2DB' }}>
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-body" style={{ backgroundColor: 'rgba(255, 107, 53, 0.12)', color: '#FF6B35' }}>{i + 1}</span>
                <p className="text-sm text-[#2D2D2D] leading-relaxed font-body">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Creation Suggestions */}
        <div className="reveal-item mt-8 max-w-[720px] mx-auto">
          <div className="flex items-center gap-2 mb-4"><Lightbulb size={18} style={{ color: '#FF6B35' }} /><h3 className="text-lg font-semibold text-[#2D2D2D] font-body">{tx('create')}</h3></div>
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFDF9', border: '1px solid #E8E2DB' }}>
            <div className="flex flex-col gap-4">
              {personalityType.creationSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold font-body" style={{ backgroundColor: '#FF6B35', color: '#FFFDF9' }}>{i + 1}</span>
                  <p className="text-sm text-[#2D2D2D] leading-relaxed font-body pt-1">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <button onClick={handleSaveImage} className="action-button inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-body font-semibold text-[#FFFDF9] transition-all duration-300 cursor-pointer hover:-translate-y-0.5" style={{ backgroundColor: '#FF6B35', boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)' }}>
            <Camera size={18} />{tx('saveImage')}
          </button>
          <button onClick={async () => { const ok = await copyToClipboard(getShareUrl()); if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); } }} className="action-button inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-body font-semibold text-[#2D2D2D] transition-all duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(255, 253, 249, 0.8)', border: '1px solid #E8E2DB' }}>
            <Link size={18} />{copied ? tx('copied') : tx('copyLink')}
          </button>
          <button onClick={() => setShowQR(true)} className="action-button inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-body font-semibold text-[#2D2D2D] transition-all duration-300 cursor-pointer" style={{ backgroundColor: 'rgba(255, 253, 249, 0.8)', border: '1px solid #E8E2DB' }}>
            <Share2 size={18} />{tx('shareWechat')}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button onClick={onRestart} className="action-button inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-body font-medium text-sm text-[#8A7E72] transition-all duration-300 cursor-pointer bg-transparent hover:text-[#FF6B35] hover:border-[#FF6B35]" style={{ border: '1px solid #E8E2DB' }}>
            <RotateCcw size={16} />{tx('restart')}
          </button>
        </div>

        {/* WeChat QR Modal */}
        {showQR && (
          <div className="qr-modal" onClick={() => setShowQR(false)}>
            <div className="rounded-3xl p-8 max-w-sm mx-4 text-center" style={{ backgroundColor: '#FFFDF9', boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2)' }} onClick={(e) => e.stopPropagation()}>
              <p className="font-body font-semibold text-lg text-[#2D2D2D] mb-2">{tx('shareWechat')}</p>
              <p className="font-body text-sm text-[#8A7E72] mb-4">{tx('wechatTip')}</p>
              <div id="qr-wechat" className="mx-auto rounded-2xl overflow-hidden" style={{ width: 200, height: 200, background: '#FFFDF9' }} />
              <p className="font-body text-xs text-[#8A7E72] mt-4">{tx('scanQR')}</p>
              <button onClick={() => setShowQR(false)} className="mt-4 px-6 py-2 rounded-2xl font-body font-medium text-sm text-[#8A7E72] cursor-pointer bg-transparent hover:text-[#FF6B35] hover:border-[#FF6B35]" style={{ border: '1px solid #E8E2DB' }}>{tx('close')}</button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="reveal-item mt-16 max-w-[560px] mx-auto text-center px-6 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,253,249,0.6) 100%)', border: '1px solid rgba(255,107,53,0.15)' }}>
          <p className="font-display italic text-xl md:text-2xl text-[#2D2D2D] leading-relaxed">&ldquo;{tx('cta1')}<br /><span style={{ color: '#FF6B35' }}>{tx('cta2')}</span>&rdquo;</p>
          <p className="mt-4 text-sm text-[#8A7E72] font-body">{tx('ctaSub')}</p>
        </div>

        <p className="mt-12 text-xs text-[#8A7E72] font-body text-center pb-6">{tx('footerCopy')}</p>
      </div>
    </div>
  );
}
