import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateLevel1Questions,
  generateLevel2Questions,
  generateLevel3Questions,
  generateAllQuestions,
  calculateStars,
  calculateScore,
  getQuestionOffset,
  LEVEL_QUESTION_COUNTS,
  TOTAL_QUESTIONS
} from './quizEngine';
import { AKSARA_NGLEGENA, KATA_LATIHAN } from '../data/aksaraData';

test('Aksara Nglegena has exactly 20 basic consonants', () => {
  assert.equal(AKSARA_NGLEGENA.length, 20);
  const latinList = AKSARA_NGLEGENA.map(a => a.latin);
  const expected = [
    'ha', 'na', 'ca', 'ra', 'ka',
    'da', 'ta', 'sa', 'wa', 'la',
    'pa', 'dha', 'ja', 'ya', 'nya',
    'ma', 'ga', 'ba', 'tha', 'nga'
  ];
  assert.deepEqual(latinList, expected);
});

test('Question composition is 20 basic aksara + 10 reading + 10 writing (total 40)', () => {
  assert.equal(LEVEL_QUESTION_COUNTS[1], 20);
  assert.equal(LEVEL_QUESTION_COUNTS[2], 10);
  assert.equal(LEVEL_QUESTION_COUNTS[3], 10);
  assert.equal(TOTAL_QUESTIONS, 40);
  assert.equal(getQuestionOffset(1), 0);
  assert.equal(getQuestionOffset(2), 20);
  assert.equal(getQuestionOffset(3), 30);
});

test('Level 1 has 20 questions covering all 20 basic aksara cards', () => {
  const questions = generateLevel1Questions(20);
  assert.equal(questions.length, 20);

  const correctAnswers = new Set(questions.map(q => q.correctAnswer));
  assert.equal(correctAnswers.size, 20);
  for (const item of AKSARA_NGLEGENA) {
    assert.ok(correctAnswers.has(item.latin), `Missing aksara ${item.latin}`);
  }

  for (const q of questions) {
    assert.equal(q.level, 1);
    assert.equal(q.options.length, 4, `Question ${q.id} should have 4 options`);
    assert.equal(new Set(q.options).size, 4, `Question ${q.id} options should be unique`);
    assert.ok(q.options.includes(q.correctAnswer), `Question ${q.id} should include correct answer`);
    assert.equal(q.displayAksara.length, 1, `Question ${q.id} should show one aksara glyph`);
  }
});

test('Level 2 has 10 Javanese-word reading questions with 4 unique Latin options', () => {
  const questions = generateLevel2Questions(10);
  assert.equal(questions.length, 10);

  const knownLatinReadings = new Set(KATA_LATIHAN.map(word => word.latin));
  for (const q of questions) {
    assert.equal(q.level, 2);
    assert.equal(q.options.length, 4, `Question ${q.id} should have 4 options`);
    assert.equal(new Set(q.options).size, 4, `Question ${q.id} options should be unique`);
    assert.ok(q.options.includes(q.correctAnswer), `Question ${q.id} should include correct answer`);
    assert.ok(knownLatinReadings.has(q.correctAnswer), `Question ${q.id} answer should be a known word reading`);
    assert.ok(q.displayAksara.length > 0);
  }
});

test('Level 3 has 10 Latin-word questions whose options are Javanese aksara', () => {
  const questions = generateLevel3Questions(10);
  assert.equal(questions.length, 10);

  const knownJavaneseForms = new Set(KATA_LATIHAN.map(word => word.jawa));
  for (const q of questions) {
    assert.equal(q.level, 3);
    assert.equal(q.options.length, 4, `Question ${q.id} should have 4 options`);
    assert.equal(new Set(q.options).size, 4, `Question ${q.id} options should be unique`);
    assert.ok(q.options.includes(q.correctAnswer), `Question ${q.id} should include correct answer`);
    assert.ok(knownJavaneseForms.has(q.correctAnswer), `Question ${q.id} answer should be a known Javanese form`);
    assert.ok(q.options.every(option => /[\uA980-\uA9DF]/.test(option)), `Question ${q.id} options should all be Javanese script`);
  }
});

test('Level 3 near-miss options keep the same base consonants so first/last letters are not enough', () => {
  const questions = generateLevel3Questions(20);
  assert.equal(questions.length, 20);

  const baseConsonants = (text: string) =>
    Array.from(text)
      .filter(char => {
        const code = char.codePointAt(0) ?? 0;
        return code >= 0xa98f && code <= 0xa9b2;
      })
      .join('');

  for (const q of questions) {
    const correctBase = baseConsonants(q.correctAnswer);
    assert.ok(correctBase.length > 0, `Question ${q.id} should contain base aksara`);
    for (const option of q.options) {
      assert.equal(
        baseConsonants(option),
        correctBase,
        `Question ${q.id} option ${option} should keep the same base consonants as ${q.correctAnswer}`
      );
    }
  }
});

test('generateAllQuestions covers 3 levels with 20/10/10 questions (total 40)', () => {
  const all = generateAllQuestions();
  assert.equal(all[1].length, 20);
  assert.equal(all[2].length, 10);
  assert.equal(all[3].length, 10);
  assert.equal(all[1].length + all[2].length + all[3].length, TOTAL_QUESTIONS);
});

test('calculateScore converts 40 correct answers to a 0-100 score without combo bonuses', () => {
  assert.equal(calculateScore(0), 0);
  assert.equal(calculateScore(20), 50);
  assert.equal(calculateScore(32), 80);
  assert.equal(calculateScore(40), 100);
  assert.equal(calculateScore(41), 100);
});

test('calculateStars awards 3, 2, or 1 stars based on 40 question performance', () => {
  assert.equal(calculateStars(34, 40), 3);
  assert.equal(calculateStars(33, 40), 2);
  assert.equal(calculateStars(22, 40), 2);
  assert.equal(calculateStars(10, 40), 1);
});
