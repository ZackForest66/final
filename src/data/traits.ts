export const traitsByDimension: Record<string, Record<string, string[]>> = {
  perception: {
    N: ['灵感驱动', '想象丰富', '抽象思维', '前瞻视野'],
    S: ['细节敏锐', '写实精准', '具象表达', '洞察入微'],
  },
  motivation: {
    F: ['情感丰沛', '共情力强', '直觉引导', '真诚表达'],
    T: ['逻辑严密', '分析深刻', '概念先行', '策略清晰'],
  },
  expression: {
    A: ['突破常规', '实验精神', '先锋探索', '创新无畏'],
    C: ['技艺深厚', '传承有序', '经典致敬', '根基扎实'],
  },
  rhythm: {
    X: ['即兴创作', '自由流动', '灵感迸发', '随性自然'],
    R: ['计划周密', '纪律严谨', '系统构建', '条理分明'],
  },
};

export function getTraitsForPersonality(code: string): string[] {
  const type = code.split('') as [string, string, string, string];
  const dims = ['perception', 'motivation', 'expression', 'rhythm'];
  const selected: string[] = [];

  dims.forEach((dim, i) => {
    const dimKey = dim;
    const valKey = type[i];
    const traits = traitsByDimension[dimKey]?.[valKey];
    if (traits) {
      selected.push(traits[0]);
    }
  });

  return selected;
}
