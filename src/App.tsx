import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { useAppState } from './hooks/useAppState';
import { calculatePersonality } from './utils/scoring';
import { LangProvider } from './hooks/useLang';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import Loading from './components/Loading';
import Result from './components/Result';

function AppContent() {
  const {
    state,
    startQuiz,
    answerQuestion,
    goBack,
    showResult,
    restart,
  } = useAppState();

  const contentRef = useRef<HTMLDivElement>(null);
  const prevPhaseRef = useRef<string>('hero');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  useEffect(() => {
    if (contentRef.current && typeof gsap !== 'undefined' && prevPhaseRef.current !== state.phase) {
      gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      prevPhaseRef.current = state.phase;
    }
  }, [state.phase]);

  const handleLoadingComplete = useCallback(() => {
    if (state.answers.length > 0) {
      const result = calculatePersonality(state.answers);
      showResult(result.type, result.scores, result.percentages);
    }
  }, [state.answers, showResult]);

  const showWarmBackground = state.phase === 'hero' || state.phase === 'result';

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: showWarmBackground ? '#FAF6F1' : '#1A1A1A' }}>
      <div ref={contentRef} className="relative z-10">
        {state.phase === 'hero' && (
          <Hero onStart={startQuiz} lang={lang} setLang={setLang} />
        )}

        {state.phase === 'quiz' && (
          <Quiz
            currentQuestion={state.currentQuestion}
            onAnswer={answerQuestion}
            onBack={goBack}
            lang={lang}
          />
        )}

        {state.phase === 'loading' && (
          <Loading onComplete={handleLoadingComplete} lang={lang} />
        )}

        {state.phase === 'result' && state.personalityType && state.scores && state.percentages && (
          <Result
            personalityType={state.personalityType}
            scores={state.scores}
            percentages={state.percentages}
            onRestart={restart}
            lang={lang}
            setLang={setLang}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
