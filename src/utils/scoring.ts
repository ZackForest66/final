import type { PersonalityType } from '../data/personalityTypes';
import { getPersonalityType } from '../data/personalityTypes';

export interface Answer {
  questionId: number;
  optionIndex: number;
  scores: Record<string, number>;
}

export interface DimensionScores {
  N: number; // 直觉
  S: number; // 观察
  F: number; // 情感
  T: number; // 理性
  A: number; // 前卫
  C: number; // 传统
  X: number; // 流动
  R: number; // 结构
}

export function calculatePersonality(answers: Answer[]): {
  type: PersonalityType;
  scores: DimensionScores;
  percentages: Record<string, number>;
} {
  const scores: DimensionScores = {
    N: 0, S: 0, F: 0, T: 0, A: 0, C: 0, X: 0, R: 0,
  };

  answers.forEach((answer) => {
    Object.entries(answer.scores).forEach(([dim, score]) => {
      if (dim in scores) {
        scores[dim as keyof DimensionScores] += score;
      }
    });
  });

  const code = [
    scores.N >= scores.S ? 'N' : 'S',
    scores.F >= scores.T ? 'F' : 'T',
    scores.A >= scores.C ? 'A' : 'C',
    scores.X >= scores.R ? 'X' : 'S',
  ].join('');

  // Calculate percentages for radar chart
  const maxScore = 6; // Maximum possible score per dimension (3 questions × 2 points)
  const percentages = {
    N: Math.min(100, (scores.N / maxScore) * 100),
    S: Math.min(100, (scores.S / maxScore) * 100),
    F: Math.min(100, (scores.F / maxScore) * 100),
    T: Math.min(100, (scores.T / maxScore) * 100),
    A: Math.min(100, (scores.A / maxScore) * 100),
    C: Math.min(100, (scores.C / maxScore) * 100),
    X: Math.min(100, (scores.X / maxScore) * 100),
    R: Math.min(100, (scores.R / maxScore) * 100),
  };

  return {
    type: getPersonalityType(code),
    scores,
    percentages,
  };
}
