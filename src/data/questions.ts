export interface Question {
  id: number;
  dimension: string;
  text: string;
  textEn: string;
  options: {
    text: string;
    textEn: string;
    scores: Record<string, number>;
  }[];
}

export const questions: Question[] = [
  // 维度一：感知方式 (Perception)
  {
    id: 1,
    dimension: 'perception',
    text: '当你走进一个陌生的城市，你首先注意到的是——',
    textEn: 'When you walk into an unfamiliar city, what catches your attention first?',
    options: [
      { text: '街道的整体氛围和空气中弥漫的情绪', textEn: 'The overall atmosphere and emotions in the air', scores: { N: 2 } },
      { text: '建筑细节、墙面纹理和光影变化', textEn: 'Architectural details, wall textures, and light-play', scores: { S: 2 } },
      { text: '人群互动中的微妙故事线索', textEn: 'Subtle storytelling in how people interact', scores: { N: 1, S: 1 } },
    ],
  },
  {
    id: 2,
    dimension: 'perception',
    text: '在美术馆里，你更容易被哪种作品吸引？',
    textEn: 'In an art museum, which type of work draws you in?',
    options: [
      { text: '抽象表达情感和情绪的画作', textEn: 'Abstract works expressing raw emotion', scores: { N: 2 } },
      { text: '精细写实的静物或肖像', textEn: 'Meticulously realistic still life or portraits', scores: { S: 2 } },
      { text: '结合了现实细节与梦幻元素的作品', textEn: 'Works blending real detail with dreamlike elements', scores: { N: 1, S: 1 } },
    ],
  },
  {
    id: 3,
    dimension: 'perception',
    text: '你更可能被以下哪种情景触动？',
    textEn: 'Which scenario is more likely to move you?',
    options: [
      { text: '一场雨后的城市街景，光影在地面上交错', textEn: 'City streets after rain, light and shadow intertwining', scores: { S: 2 } },
      { text: '一段旋律中突然转调带来的情感冲击', textEn: 'The emotional impact of a sudden key change in music', scores: { N: 2 } },
      { text: '一个陌生人微笑时眼角的皱纹', textEn: 'The crow\'s feet when a stranger smiles', scores: { S: 1, N: 1 } },
    ],
  },
  // 维度二：创作动机 (Motivation)
  {
    id: 4,
    dimension: 'motivation',
    text: '你创作的主要驱动力是——',
    textEn: 'Your main creative drive comes from —',
    options: [
      { text: '表达内心无法言说的情感和体验', textEn: 'Expressing unspeakable inner emotions and experiences', scores: { F: 2 } },
      { text: '解决一个具体的视觉或概念问题', textEn: 'Solving a specific visual or conceptual problem', scores: { T: 2 } },
      { text: '与世界分享你独特的美学和观点', textEn: 'Sharing your unique aesthetics and perspective with the world', scores: { F: 1, T: 1 } },
    ],
  },
  {
    id: 5,
    dimension: 'motivation',
    text: '当你完成一件作品时，你最在意的是——',
    textEn: 'When you finish a piece, you care most about —',
    options: [
      { text: '它是否真实传达了我的感受', textEn: 'Whether it truly conveys what I feel', scores: { F: 2 } },
      { text: '它是否在技术和概念上经得起推敲', textEn: 'Whether it holds up technically and conceptually', scores: { T: 2 } },
      { text: '它是否引发了观者的思考和共鸣', textEn: 'Whether it sparks thought and resonance in viewers', scores: { F: 1, T: 1 } },
    ],
  },
  {
    id: 6,
    dimension: 'motivation',
    text: '面对创作瓶颈时，你会——',
    textEn: 'When facing creative block, you —',
    options: [
      { text: '沉浸在音乐、自然或回忆中寻找情感灵感', textEn: 'Immerse in music, nature, or memories to find emotional inspiration', scores: { F: 2 } },
      { text: '分析瓶颈原因，系统地尝试不同解决方案', textEn: 'Analyze the cause and systematically try solutions', scores: { T: 2 } },
      { text: '暂时放下，让潜意识在放松中自然酝酿', textEn: 'Step away and let the subconscious brew naturally', scores: { F: 1, T: 1 } },
    ],
  },
  // 维度三：表达偏好 (Expression)
  {
    id: 7,
    dimension: 'expression',
    text: '你更倾向于哪种创作风格？',
    textEn: 'Which creative style do you lean toward?',
    options: [
      { text: '打破规则，探索未知领域的实验性创作', textEn: 'Breaking rules, experimental exploration of the unknown', scores: { A: 2 } },
      { text: '在经典框架内精益求精的传统技法', textEn: 'Mastering traditional techniques within classical frameworks', scores: { C: 2 } },
      { text: '将传统元素以当代视角重新诠释', textEn: 'Reinterpreting traditional elements through a contemporary lens', scores: { A: 1, C: 1 } },
    ],
  },
  {
    id: 8,
    dimension: 'expression',
    text: '对于「艺术创新」，你的看法是——',
    textEn: 'Your view on "artistic innovation" is —',
    options: [
      { text: '艺术必须不断突破边界，否则就会死亡', textEn: 'Art must keep pushing boundaries, or it dies', scores: { A: 2 } },
      { text: '真正的美存在于千年不变的规律中', textEn: 'True beauty lies in timeless, unchanging principles', scores: { C: 2 } },
      { text: '创新需要根植于传统的土壤', textEn: 'Innovation must be rooted in tradition', scores: { A: 1, C: 1 } },
    ],
  },
  {
    id: 9,
    dimension: 'expression',
    text: '你更欣赏哪位艺术家的理念？',
    textEn: 'Which artist\'s philosophy resonates more with you?',
    options: [
      { text: '毕加索：「我总是在做我不会做的事，这样我才能学会如何去做」', textEn: 'Picasso: "I am always doing what I cannot do yet, to learn how to do it."', scores: { A: 2 } },
      { text: '达芬奇：「细节成就完美，完美不是细节」', textEn: 'Da Vinci: "Details make perfection, and perfection is not a detail."', scores: { C: 2 } },
      { text: '东山魁夷：「在变化中寻找不变，在不变中拥抱变化」', textEn: 'Kaii Higashiyama: "Find the unchanging within change, embrace change within the unchanging."', scores: { A: 1, C: 1 } },
    ],
  },
  // 维度四：创作节奏 (Rhythm)
  {
    id: 10,
    dimension: 'rhythm',
    text: '你的创作状态更像——',
    textEn: 'Your creative rhythm is more like —',
    options: [
      { text: '灵感来临时彻夜不眠的爆发式创作', textEn: 'Bursts of all-night creation when inspiration strikes', scores: { X: 2 } },
      { text: '每天固定时间雷打不动的工作室作息', textEn: 'A rigid studio routine at fixed hours every day', scores: { R: 2 } },
      { text: '有大致计划但允许灵感随时调整的弹性节奏', textEn: 'A flexible rhythm with rough plans that adapt to inspiration', scores: { X: 1, R: 1 } },
    ],
  },
  {
    id: 11,
    dimension: 'rhythm',
    text: '你的工作室或创作空间通常是——',
    textEn: 'Your studio or creative space is usually —',
    options: [
      { text: '随性的、材料散落各处但你知道每样东西在哪', textEn: 'Casual — materials scattered, but you know where everything is', scores: { X: 2 } },
      { text: '井井有条，每样工具和材料都有固定位置', textEn: 'Neat and organized, every tool has its place', scores: { R: 2 } },
      { text: '有分类系统但保持了一定自由度的半有序状态', textEn: 'Semi-organized with a system but room for freedom', scores: { X: 1, R: 1 } },
    ],
  },
  {
    id: 12,
    dimension: 'rhythm',
    text: '对于创作计划，你的态度是——',
    textEn: 'Your attitude toward creative planning is —',
    options: [
      { text: '计划会扼杀灵感，我更喜欢跟随直觉流动', textEn: 'Planning kills inspiration — I prefer to follow intuition', scores: { X: 2 } },
      { text: '好的作品来自严谨的计划和执行', textEn: 'Good work comes from rigorous planning and execution', scores: { R: 2 } },
      { text: '先有计划框架，再在其中自由发挥', textEn: 'Start with a plan, then freely create within it', scores: { X: 1, R: 1 } },
    ],
  },
];
