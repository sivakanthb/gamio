// ============================================
// GAMIO — Game Engine
// Handles game logic, scoring, answer checking
// ============================================

const { triviaQuestions, emojiPuzzles, humanOrAiQuotes, pickRandom } = require('./question-bank');

const GAME_CONFIG = {
  trivia: {
    name: 'Trivia Blitz',
    icon: '🧠',
    questionsPerRound: 8,
    timePerQuestion: 15,
    basePoints: 100,
    speedBonus: 50,
  },
  emoji: {
    name: 'Emoji Decode',
    icon: '🎯',
    questionsPerRound: 8,
    timePerQuestion: 20,
    basePoints: 150,
    speedBonus: 50,
  },
  'human-or-ai': {
    name: 'Who Said It?',
    icon: '🤖',
    questionsPerRound: 8,
    timePerQuestion: 12,
    basePoints: 100,
    speedBonus: 30,
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
    }));
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
