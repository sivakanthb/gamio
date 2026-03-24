// ============================================
// GAMIO — Game Engine
// Handles game logic, scoring, answer checking
// ============================================

const { triviaQuestions, emojiPuzzles, humanOrAiQuotes, wordScrambles, oddOneOut, guessTheYear, trueFalse, missingLyrics, spotTheFake, pickRandom, shuffle } = require('./question-bank');

// ─── Categories ───
const GAME_CATEGORIES = {
  'trivia-knowledge': { name: 'Trivia & Knowledge', icon: '🧠', games: ['trivia', 'guess-year', 'true-false', 'human-or-ai'] },
  'decode-guess':     { name: 'Decode & Guess',     icon: '🎯', games: ['emoji', 'missing-lyrics', 'spot-the-fake'] },
  'words-speed':      { name: 'Words & Speed',      icon: '⚡', games: ['scramble', 'odd-one-out', 'speed-math'] },
};

const GAME_CONFIG = {
  trivia: {
    name: 'Trivia Blitz',
    icon: '🧠',
    questionsPerRound: 8,
    timePerQuestion: 15,
    basePoints: 100,
    speedBonus: 50,
    category: 'trivia-knowledge',
  },
  emoji: {
    name: 'Emoji Decode',
    icon: '🎯',
    questionsPerRound: 8,
    timePerQuestion: 20,
    basePoints: 150,
    speedBonus: 50,
    category: 'decode-guess',
  },
  'human-or-ai': {
    name: 'Who Said It?',
    icon: '🤖',
    questionsPerRound: 8,
    timePerQuestion: 12,
    basePoints: 100,
    speedBonus: 30,
    category: 'trivia-knowledge',
  },
  scramble: {
    name: 'Word Scramble',
    icon: '🔤',
    questionsPerRound: 8,
    timePerQuestion: 20,
    basePoints: 120,
    speedBonus: 60,
    category: 'words-speed',
  },
  'odd-one-out': {
    name: 'Odd One Out',
    icon: '🔍',
    questionsPerRound: 8,
    timePerQuestion: 12,
    basePoints: 100,
    speedBonus: 40,
    category: 'words-speed',
  },
  'guess-year': {
    name: 'Guess the Year',
    icon: '📅',
    questionsPerRound: 8,
    timePerQuestion: 15,
    basePoints: 100,
    speedBonus: 50,
    category: 'trivia-knowledge',
  },
  'true-false': {
    name: 'True or False',
    icon: '✅',
    questionsPerRound: 10,
    timePerQuestion: 10,
    basePoints: 80,
    speedBonus: 40,
    category: 'trivia-knowledge',
  },
  'missing-lyrics': {
    name: 'Missing Lyrics',
    icon: '🎵',
    questionsPerRound: 8,
    timePerQuestion: 15,
    basePoints: 120,
    speedBonus: 50,
    category: 'decode-guess',
  },
  'spot-the-fake': {
    name: 'Spot the Fake',
    icon: '🕵️',
    questionsPerRound: 8,
    timePerQuestion: 18,
    basePoints: 130,
    speedBonus: 50,
    category: 'decode-guess',
  },
  'speed-math': {
    name: 'Speed Math',
    icon: '🔢',
    questionsPerRound: 10,
    timePerQuestion: 10,
    basePoints: 80,
    speedBonus: 60,
    category: 'words-speed',
  },
};

class GameEngine {
  startGame(gameType) {
    const config = GAME_CONFIG[gameType];
    if (!config) throw new Error(`Unknown game type: ${gameType}`);

    let questions;
    switch (gameType) {
      case 'trivia':
        questions = this._prepareTriviaQuestions(config.questionsPerRound);
        break;
      case 'emoji':
        questions = this._prepareEmojiQuestions(config.questionsPerRound);
        break;
      case 'human-or-ai':
        questions = this._prepareHumanOrAiQuestions(config.questionsPerRound);
        break;
      case 'scramble':
        questions = this._prepareScrambleQuestions(config.questionsPerRound);
        break;
      case 'odd-one-out':
        questions = this._prepareOddOneOutQuestions(config.questionsPerRound);
        break;
      case 'guess-year':
        questions = this._prepareGuessYearQuestions(config.questionsPerRound);
        break;
      case 'true-false':
        questions = this._prepareTrueFalseQuestions(config.questionsPerRound);
        break;
      case 'missing-lyrics':
        questions = this._prepareMissingLyricsQuestions(config.questionsPerRound);
        break;
      case 'spot-the-fake':
        questions = this._prepareSpotTheFakeQuestions(config.questionsPerRound);
        break;
      case 'speed-math':
        questions = this._prepareSpeedMathQuestions(config.questionsPerRound);
        break;
    }

    return { gameType, config, questions };
  }

  checkAnswer(gameType, question, answer) {
    switch (gameType) {
      case 'trivia':
        return Number(answer) === question.correct;
      case 'emoji':
        return this._fuzzyMatch(String(answer), question.answer);
      case 'human-or-ai':
        return answer === (question.isHuman ? 'human' : 'ai');
      case 'scramble':
        return this._fuzzyMatch(String(answer), question.word);
      case 'odd-one-out':
        return Number(answer) === question.oddIndex;
      case 'guess-year':
        return Number(answer) === question.correct;
      case 'true-false':
        return answer === question.answer;
      case 'missing-lyrics':
        return this._fuzzyMatch(String(answer), question.answer);
      case 'spot-the-fake':
        return Number(answer) === question.fakeIndex;
      case 'speed-math':
        return Number(answer) === question.answer;
      default:
        return false;
    }
  }

  calculatePoints(gameType, timeLeft) {
    const config = GAME_CONFIG[gameType];
    if (!config) return 0;
    const timeRatio = Math.max(0, timeLeft) / config.timePerQuestion;
    return Math.round(config.basePoints + config.speedBonus * timeRatio);
  }

  getConfig(gameType) {
    return GAME_CONFIG[gameType] || null;
  }

  getAllGameTypes() {
    return Object.entries(GAME_CONFIG).map(([key, val]) => ({
      id: key,
      name: val.name,
      icon: val.icon,
      category: val.category,
    }));
  }

  getCategories() {
    return GAME_CATEGORIES;
  }

  // ─── Private Methods ───

  _prepareTriviaQuestions(count) {
    const selected = pickRandom(triviaQuestions, count);
    return selected.map(q => ({
      type: 'trivia',
      question: q.question,
      options: q.options,
      correct: q.correct,
      category: q.category,
      timeLimit: GAME_CONFIG.trivia.timePerQuestion,
    }));
  }

  _prepareEmojiQuestions(count) {
    const selected = pickRandom(emojiPuzzles, count);
    return selected.map(q => ({
      type: 'emoji',
      emojis: q.emojis,
      answer: q.answer,
      category: q.category,
      hint: q.hint,
      timeLimit: GAME_CONFIG.emoji.timePerQuestion,
    }));
  }

  _prepareHumanOrAiQuestions(count) {
    const selected = pickRandom(humanOrAiQuotes, count);
    return selected.map(q => ({
      type: 'human-or-ai',
      text: q.text,
      author: q.author,
      isHuman: q.isHuman,
      timeLimit: GAME_CONFIG['human-or-ai'].timePerQuestion,
    }));
  }

  _prepareScrambleQuestions(count) {
    const selected = pickRandom(wordScrambles, count);
    return selected.map(q => {
      const letters = shuffle(q.word.split('')).join('');
      return {
        type: 'scramble',
        scrambled: letters,
        word: q.word,
        hint: q.hint,
        category: q.category,
        timeLimit: GAME_CONFIG.scramble.timePerQuestion,
      };
    });
  }

  _prepareOddOneOutQuestions(count) {
    const selected = pickRandom(oddOneOut, count);
    return selected.map(q => ({
      type: 'odd-one-out',
      items: q.items,
      oddIndex: q.oddIndex,
      explanation: q.explanation,
      category: q.category,
      timeLimit: GAME_CONFIG['odd-one-out'].timePerQuestion,
    }));
  }

  _prepareGuessYearQuestions(count) {
    const selected = pickRandom(guessTheYear, count);
    return selected.map(q => ({
      type: 'guess-year',
      event: q.event,
      options: q.options.map(String),
      correct: q.correct,
      category: q.category,
      timeLimit: GAME_CONFIG['guess-year'].timePerQuestion,
    }));
  }

  _prepareTrueFalseQuestions(count) {
    const selected = pickRandom(trueFalse, count);
    return selected.map(q => ({
      type: 'true-false',
      statement: q.statement,
      answer: q.answer,
      explanation: q.explanation,
      category: q.category,
      timeLimit: GAME_CONFIG['true-false'].timePerQuestion,
    }));
  }

  _prepareMissingLyricsQuestions(count) {
    const selected = pickRandom(missingLyrics, count);
    return selected.map(q => ({
      type: 'missing-lyrics',
      lyric: q.lyric,
      answer: q.answer,
      song: q.song,
      artist: q.artist,
      category: q.category,
      timeLimit: GAME_CONFIG['missing-lyrics'].timePerQuestion,
    }));
  }

  _prepareSpotTheFakeQuestions(count) {
    const selected = pickRandom(spotTheFake, count);
    return selected.map(q => ({
      type: 'spot-the-fake',
      facts: q.facts,
      fakeIndex: q.fakeIndex,
      explanation: q.explanation,
      category: q.category,
      timeLimit: GAME_CONFIG['spot-the-fake'].timePerQuestion,
    }));
  }

  _prepareSpeedMathQuestions(count) {
    const questions = [];
    const ops = ['+', '-', '×'];
    for (let i = 0; i < count; i++) {
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b, answer;
      if (op === '+') {
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 90) + 10;
        answer = a + b;
      } else if (op === '-') {
        a = Math.floor(Math.random() * 90) + 20;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        answer = a - b;
      } else {
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 12) + 2;
        answer = a * b;
      }
      questions.push({
        type: 'speed-math',
        expression: `${a} ${op} ${b}`,
        answer,
        timeLimit: GAME_CONFIG['speed-math'].timePerQuestion,
      });
    }
    return questions;
  }

  _fuzzyMatch(userAnswer, correctAnswer) {
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
    const user = normalize(userAnswer);
    const correct = normalize(correctAnswer);

    if (!user) return false;
    if (user === correct) return true;

    // Remove common articles for comparison
    const stripArticles = s => s.replace(/^(the|a|an)\s+/, '');
    if (stripArticles(user) === stripArticles(correct)) return true;

    // Check if one contains the other (for partial matches)
    if (correct.includes(user) && user.length >= correct.length * 0.6) return true;
    if (user.includes(correct)) return true;

    return false;
  }
}

module.exports = GameEngine;
