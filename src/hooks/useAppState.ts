import { useReducer, useCallback } from 'react';
import type { Answer } from '../utils/scoring';
import type { PersonalityType } from '../data/personalityTypes';
import type { DimensionScores } from '../utils/scoring';

export type AppPhase = 'hero' | 'quiz' | 'loading' | 'result';

export interface AppState {
  phase: AppPhase;
  currentQuestion: number;
  answers: Answer[];
  loadingStep: number;
  personalityType: PersonalityType | null;
  scores: DimensionScores | null;
  percentages: Record<string, number> | null;
}

type AppAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; answer: Answer }
  | { type: 'GO_BACK' }
  | { type: 'SET_LOADING_STEP'; step: number }
  | { type: 'SHOW_RESULT'; personalityType: PersonalityType; scores: DimensionScores; percentages: Record<string, number> }
  | { type: 'RESTART' };

const initialState: AppState = {
  phase: 'hero',
  currentQuestion: 0,
  answers: [],
  loadingStep: 0,
  personalityType: null,
  scores: null,
  percentages: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        phase: 'quiz',
        currentQuestion: 0,
        answers: [],
      };
    case 'ANSWER_QUESTION': {
      const newAnswers = [...state.answers, action.answer];
      const nextQuestion = state.currentQuestion + 1;
      if (nextQuestion >= 12) {
        return {
          ...state,
          phase: 'loading',
          answers: newAnswers,
          loadingStep: 0,
        };
      }
      return {
        ...state,
        currentQuestion: nextQuestion,
        answers: newAnswers,
      };
    }
    case 'GO_BACK': {
      if (state.currentQuestion === 0) {
        return { ...state, phase: 'hero' };
      }
      const newAnswers = state.answers.slice(0, -1);
      return {
        ...state,
        currentQuestion: state.currentQuestion - 1,
        answers: newAnswers,
      };
    }
    case 'SET_LOADING_STEP':
      return { ...state, loadingStep: action.step };
    case 'SHOW_RESULT':
      return {
        ...state,
        phase: 'result',
        personalityType: action.personalityType,
        scores: action.scores,
        percentages: action.percentages,
      };
    case 'RESTART':
      return initialState;
    default:
      return state;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const startQuiz = useCallback(() => {
    dispatch({ type: 'START_QUIZ' });
  }, []);

  const answerQuestion = useCallback((answer: Answer) => {
    dispatch({ type: 'ANSWER_QUESTION', answer });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const setLoadingStep = useCallback((step: number) => {
    dispatch({ type: 'SET_LOADING_STEP', step });
  }, []);

  const showResult = useCallback((personalityType: PersonalityType, scores: DimensionScores, percentages: Record<string, number>) => {
    dispatch({ type: 'SHOW_RESULT', personalityType, scores, percentages });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  return {
    state,
    startQuiz,
    answerQuestion,
    goBack,
    setLoadingStep,
    showResult,
    restart,
  };
}
