import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import { questions } from '../data/questions';
import type { Answer } from '../utils/scoring';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';

interface QuizProps {
  currentQuestion: number;
  onAnswer: (answer: Answer) => void;
  onBack: () => void;
  lang: Lang;
}

export default function Quiz({ currentQuestion, onAnswer, onBack, lang }: QuizProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / 12) * 100;
  const tx = (key: string) => t(lang, key);
  const displayQuestion = lang === 'en' ? question.textEn : question.text;
  const displayOptions = question.options.map((opt) => ({
    ...opt,
    displayText: lang === 'en' ? opt.textEn : opt.text,
  }));

  // Typewriter effect for question text
  useEffect(() => {
    setDisplayedText('');
    setShowCursor(true);
    setIsTyping(true);
    setSelectedIndex(null);

    const text = displayQuestion;
    let index = 0;

    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Hide cursor after 300ms
        setTimeout(() => setShowCursor(false), 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentQuestion, displayQuestion]);

  // Animate options in
  useEffect(() => {
    if (isTyping) return;

    const options = optionsRef.current?.querySelectorAll('.option-card');
    if (options) {
      gsap.fromTo(
        options,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    }
  }, [isTyping, currentQuestion]);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, [progress]);

  const handleOptionClick = useCallback((optionIndex: number) => {
    if (isTyping || selectedIndex !== null) return;
    setSelectedIndex(optionIndex);

    const option = question.options[optionIndex];
    const answer: Answer = {
      questionId: question.id,
      optionIndex,
      scores: option.scores,
    };

    // Brief delay for visual feedback before moving on
    setTimeout(() => {
      onAnswer(answer);
    }, 350);
  }, [isTyping, selectedIndex, question, onAnswer]);

  // Handle back button
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col px-6 py-6 relative"
      style={{
        backgroundColor: '#1A1A1A',
        maxWidth: '680px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* CSS gradient fallback for ambient glow */}
      <div className="fixed inset-0 gradient-quiz pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-[#8A7E72] text-sm font-medium font-body transition-colors duration-200 cursor-pointer hover:text-[#FF6B35]"
          >
            <ArrowLeft size={16} />
            <span>{tx('quizBack')}</span>
          </button>
          <span className="text-[#8A7E72] text-sm font-medium font-body tabular-nums">
            {lang === 'en' ? `Q${currentQuestion + 1} / 12` : `第 ${currentQuestion + 1} / 12 题`}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full mt-4 rounded-full overflow-hidden"
          style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div
            ref={progressRef}
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: '#FF6B35',
              boxShadow: '0 0 8px rgba(255, 107, 53, 0.3)',
            }}
          />
        </div>

        {/* Question area */}
        <div ref={questionRef} className="mt-10">
          {/* Question badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-[13px] font-bold font-body"
            style={{
              backgroundColor: 'rgba(255, 107, 53, 0.15)',
              color: '#FF6B35',
            }}
          >
            Q{question.id}
          </span>

          {/* Question text with typewriter effect */}
          <h2
            className="mt-4 font-body font-semibold text-[#FFFDF9] leading-[1.4]"
            style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}
          >
            {displayedText}
            {showCursor && (
              <span
                className="inline-block ml-0.5"
                style={{
                  color: '#FF6B35',
                  animation: 'cursorBlink 530ms linear infinite',
                }}
              >
                |
              </span>
            )}
          </h2>
        </div>

        {/* Options */}
        <div ref={optionsRef} className="mt-8 flex flex-col gap-3">
          {displayOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isTyping || selectedIndex !== null}
              className={`option-card flex items-center gap-3 px-6 py-5 rounded-2xl text-left font-body text-base transition-all duration-250 cursor-pointer w-full ${
                selectedIndex === index
                  ? 'border-[rgba(255,107,53,0.5)]'
                  : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,53,0.3)]'
              }`}
              style={{
                backgroundColor: selectedIndex === index
                  ? 'rgba(255, 107, 53, 0.12)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  selectedIndex === index
                    ? 'rgba(255, 107, 53, 0.5)'
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
                color: '#FFFDF9',
                opacity: isTyping ? 0.3 : 1,
                transform: selectedIndex === index ? 'translateX(4px)' : undefined,
                boxShadow: selectedIndex === index ? '0 0 16px rgba(255, 107, 53, 0.1)' : undefined,
              }}
              onMouseEnter={(e) => {
                if (!isTyping && selectedIndex === null) {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIndex === null) {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-250"
                style={{
                  backgroundColor: selectedIndex === index
                    ? '#FF6B35'
                    : selectedIndex !== null
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.2)',
                }}
              />
              <span className="leading-relaxed">{option.displayText}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
