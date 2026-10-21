import { AKSARA_NGLEGENA, KATA_LATIHAN } from '../data/aksaraData';

export type GameLevel = 1 | 2 | 3;

export interface QuizQuestion {
  id: string;
  level: GameLevel;
  promptText: string;
  displayAksara: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GameState {
  currentLevel: GameLevel;
  questionIndex: number;
  totalQuestionsInLevel: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  isCompleted: boolean;
}

// 20 aksara dasar + 10 reading words + 10 writing words = 40 questions.
export const LEVEL_QUESTION_COUNTS: Record<GameLevel, number> = {
  1: 20,
  2: 10,
  3: 10
};

export const TOTAL_QUESTIONS =
  LEVEL_QUESTION_COUNTS[1] + LEVEL_QUESTION_COUNTS[2] + LEVEL_QUESTION_COUNTS[3];

export function getQuestionOffset(level: GameLevel): number {
  if (level === 1) return 0;
  if (level === 2) return LEVEL_QUESTION_COUNTS[1];
  return LEVEL_QUESTION_COUNTS[1] + LEVEL_QUESTION_COUNTS[2];
}

// Deterministic or pseudorandom shuffle helper
export function shuffleArray<T>(array: T[], seedRandom?: () => number): T[] {
  const result = [...array];
  const rand = seedRandom || Math.random;
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Level 1: 20 soal menebak aksara dasar (semua aksara Nglegena di Kartu Belajar).
export function generateLevel1Questions(
  count = LEVEL_QUESTION_COUNTS[1],
  rand = Math.random
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const selectedAksara = shuffleArray(AKSARA_NGLEGENA, rand).slice(
    0,
    Math.min(count, AKSARA_NGLEGENA.length)
  );

  selectedAksara.forEach((item, idx) => {
    const distractors = shuffleArray(
      AKSARA_NGLEGENA.filter(a => a.id !== item.id),
      rand
    )
      .slice(0, 3)
      .map(d => d.latin);

    const options = shuffleArray([item.latin, ...distractors], rand);

    questions.push({
      id: `l1_aksara_${idx + 1}_${item.id}`,
      level: 1,
      promptText: 'Aksara Jawa ing ngisor iki unine apa?',
      displayAksara: item.char,
      options,
      correctAnswer: item.latin,
      explanation: `${item.char} yaiku ${item.name} (${item.latin}). ${item.pronunciation}.`
    });
  });

  return questions;
}

// Level 2: 10 soal membaca kata yang ditulis dengan aksara Jawa.
export function generateLevel2Questions(
  count = LEVEL_QUESTION_COUNTS[2],
  rand = Math.random
): QuizQuestion[] {
  const selectedWords = shuffleArray(KATA_LATIHAN, rand).slice(
    0,
    Math.min(count, KATA_LATIHAN.length)
  );

  return selectedWords.map((word, idx) => {
    const distractors = shuffleArray(
      KATA_LATIHAN.filter(w => w.latin !== word.latin),
      rand
    )
      .slice(0, 3)
      .map(w => w.latin);

    const options = shuffleArray([word.latin, ...distractors], rand);

    return {
      id: `l2_read_${idx + 1}_${word.latin}`,
      level: 2,
      promptText: 'Wacanen tembung aksara Jawa iki. Unine apa?',
      displayAksara: word.jawa,
      options,
      correctAnswer: word.latin,
      explanation: `${word.jawa} diwaca "${word.latin}", tegese ${word.arti}.`
    };
  });
}

// Near-miss options for writing questions. Every variant keeps the same base
// consonants as the correct word, so matching only the first or last aksara is
// not enough: students must read the vowel signs (sandhangan) and the whole word.
const WRITING_DISTRACTOR_VARIANTS: Record<string, string[]> = {
  bata: ['ꦧꦶꦠ', 'ꦧꦸꦠ', 'ꦧꦺꦠ'],
  sapa: ['ꦱꦶꦥ', 'ꦱꦸꦥ', 'ꦱꦺꦥ'],
  raja: ['ꦫꦶꦗ', 'ꦫꦸꦗ', 'ꦫꦺꦗ'],
  mata: ['ꦩꦶꦠ', 'ꦩꦸꦠ', 'ꦩꦺꦠ'],
  siti: ['ꦱꦸꦠꦶ', 'ꦱꦺꦠꦶ', 'ꦱꦼꦠꦶ'],
  buku: ['ꦧꦶꦏꦸ', 'ꦧꦺꦏꦸ', 'ꦧꦼꦏꦸ'],
  tuku: ['ꦠꦶꦏꦸ', 'ꦠꦺꦏꦸ', 'ꦠꦼꦏꦸ'],
  sega: ['ꦱꦶꦒ', 'ꦱꦸꦒ', 'ꦱꦺꦒ'],
  saté: ['ꦱꦠꦶ', 'ꦱꦠꦸ', 'ꦱꦠꦼ'],
  toko: ['ꦠꦺꦴꦏꦶ', 'ꦠꦺꦴꦏꦸ', 'ꦠꦺꦴꦏꦼ'],
  kacang: ['ꦏꦶꦕꦁ', 'ꦏꦸꦕꦁ', 'ꦏꦺꦕꦁ'],
  pasar: ['ꦥꦶꦱꦂ', 'ꦥꦸꦱꦂ', 'ꦥꦺꦱꦂ'],
  gajah: ['ꦒꦶꦗꦃ', 'ꦒꦸꦗꦃ', 'ꦒꦺꦗꦃ'],
  bapak: ['ꦧꦶꦥꦏ꧀', 'ꦧꦸꦥꦏ꧀', 'ꦧꦺꦥꦏ꧀'],
  mawar: ['ꦩꦶꦮꦂ', 'ꦩꦸꦮꦂ', 'ꦩꦺꦮꦂ'],
  wayang: ['ꦮꦶꦪꦁ', 'ꦮꦸꦪꦁ', 'ꦮꦺꦪꦁ'],
  sawah: ['ꦱꦶꦮꦃ', 'ꦱꦸꦮꦃ', 'ꦱꦺꦮꦃ'],
  lara: ['ꦭꦶꦫ', 'ꦭꦸꦫ', 'ꦭꦺꦫ'],
  tata: ['ꦠꦶꦠ', 'ꦠꦸꦠ', 'ꦠꦺꦠ'],
  kala: ['ꦏꦶꦭ', 'ꦏꦸꦭ', 'ꦏꦺꦭ']
};

// Level 3: 10 soal membaca kata Latin, lalu memilih tulisan aksara Jawanya.
export function generateLevel3Questions(
  count = LEVEL_QUESTION_COUNTS[3],
  rand = Math.random
): QuizQuestion[] {
  const selectedWords = shuffleArray(KATA_LATIHAN, rand).slice(
    0,
    Math.min(count, KATA_LATIHAN.length)
  );

  return selectedWords.map((word, idx) => {
    const fallbackDistractors = shuffleArray(
      KATA_LATIHAN.filter(w => w.jawa !== word.jawa),
      rand
    ).map(w => w.jawa);

    const nearMissDistractors = WRITING_DISTRACTOR_VARIANTS[word.latin] || [];
    const allDistractors = Array.from(
      new Set([...nearMissDistractors, ...fallbackDistractors])
    ).filter(option => option !== word.jawa);

    const distractors = allDistractors.slice(0, 3);
    const options = shuffleArray([word.jawa, ...distractors], rand);

    return {
      id: `l3_write_${idx + 1}_${word.latin}`,
      level: 3,
      promptText: `Endi tulisan aksara Jawa kanggo tembung "${word.latin}"?`,
      displayAksara: word.latin,
      options,
      correctAnswer: word.jawa,
      explanation: `Tembung "${word.latin}" (${word.arti}) ditulis ${word.jawa}. Gatekna sandhangan lan aksara saben wanda.`
    };
  });
}


export function generateAllQuestions(rand = Math.random): Record<GameLevel, QuizQuestion[]> {
  return {
    1: generateLevel1Questions(LEVEL_QUESTION_COUNTS[1], rand),
    2: generateLevel2Questions(LEVEL_QUESTION_COUNTS[2], rand),
    3: generateLevel3Questions(LEVEL_QUESTION_COUNTS[3], rand)
  };
}

export function calculateStars(correctCount: number, totalQuestions = TOTAL_QUESTIONS): number {
  const percentage = (correctCount / totalQuestions) * 100;
  if (percentage >= 85) {
    return 3;
  }
  if (percentage >= 55) {
    return 2;
  }
  return 1;
}

// Score is a percentage of correct answers, capped at 100.
export function calculateScore(correctCount: number, totalQuestions = TOTAL_QUESTIONS): number {
  if (totalQuestions <= 0) return 0;
  const percentage = Math.round((Math.max(0, correctCount) / totalQuestions) * 100);
  return Math.min(100, Math.max(0, percentage));
}

export function getGradeTitle(stars: number): string {
  if (stars === 3) return 'Siswa Utama (Pinunjul Banget ⭐⭐⭐)';
  if (stars === 2) return 'Siswa Madya (Pinter Sanget ⭐⭐)';
  return 'Siswa Pratama (Kudu sregep sinau ⭐)';
}
