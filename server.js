// ============================================
// GAMIO — Server
// Express + Socket.IO multiplayer game server
// ============================================

require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const GameEngine = require('./game-engine');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(express.static(path.join(__dirname, 'public')));

// ─── Room Storage ───
const rooms = new Map();

// ─── Helpers ───
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function sanitize(str) {
  return String(str)
    .replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]))
    .trim()
    .slice(0, 24);
}

function getPlayersList(room) {
  return Array.from(room.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
    roundScore: p.roundScore || 0,
    isHost: p.isHost,
  }));
}

function getLeaderboard(room) {
  return getPlayersList(room).sort((a, b) => b.score - a.score);
}

// ─── Socket.IO ───
io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  // ── Create Room ──
  socket.on('create-room', ({ name, avatar }) => {
    if (!name || !avatar) return socket.emit('error-msg', { message: 'Name and avatar required.' });

    const code = generateRoomCode();
    const player = {
      id: socket.id,
      name: sanitize(name),
      avatar,
      score: 0,
      roundScore: 0,
      isHost: true,
    };

    const room = {
      code,
      players: new Map([[socket.id, player]]),
      hostId: socket.id,
      state: 'lobby',
      currentGame: null,
      currentGameData: null,
      currentQuestionIndex: 0,
      currentAnswers: new Map(),
      questionTimer: null,
      roundNumber: 0,
      gameEngine: new GameEngine(),
      roundHistory: [],
    };

    rooms.set(code, room);
    socket.join(code);
    socket.roomCode = code;

    socket.emit('room-created', { code, player, players: [player] });
    console.log(`[Room] ${code} created by "${player.name}"`);
  });

  // ── Join Room ──
  socket.on('join-room', ({ code, name, avatar }) => {
    if (!code || !name || !avatar) return socket.emit('error-msg', { message: 'All fields required.' });

    code = String(code).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const room = rooms.get(code);

    if (!room) return socket.emit('error-msg', { message: 'Room not found. Check the code!' });
    if (room.state !== 'lobby' && room.state !== 'results') return socket.emit('error-msg', { message: 'Game in progress! Wait for the round to end.' });
    if (room.players.size >= 16) return socket.emit('error-msg', { message: 'Room is full! (max 16 players)' });

    const player = {
      id: socket.id,
      name: sanitize(name),
      avatar,
      score: 0,
      roundScore: 0,
      isHost: false,
    };

    room.players.set(socket.id, player);
    socket.join(code);
    socket.roomCode = code;

    const players = getPlayersList(room);
    socket.emit('room-joined', { code, player, players });
    socket.to(code).emit('player-joined', { player, players });
    console.log(`[Room ${code}] "${player.name}" joined (${room.players.size} players)`);
  });

  // ── Start Round ──
  socket.on('start-round', ({ gameType }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.hostId !== socket.id) return;
    if (room.state === 'playing') return;

    room.roundNumber++;
    room.state = 'playing';
    room.currentGame = gameType;
    room.currentAnswers = new Map();
    room.currentQuestionIndex = 0;

    // Reset round scores
    room.players.forEach(p => { p.roundScore = 0; });

    try {
      room.currentGameData = room.gameEngine.startGame(gameType);
    } catch (err) {
      socket.emit('error-msg', { message: 'Failed to start game.' });
      room.state = 'lobby';
      return;
    }

    const firstQuestion = sanitizeQuestion(room.currentGameData.questions[0]);

    io.to(room.code).emit('round-start', {
      gameType,
      gameName: room.currentGameData.config.name,
      gameIcon: room.currentGameData.config.icon,
      roundNumber: room.roundNumber,
      question: firstQuestion,
      totalQuestions: room.currentGameData.questions.length,
      questionIndex: 0,
      timeLimit: firstQuestion.timeLimit,
    });

    startQuestionTimer(room);
    console.log(`[Room ${room.code}] Round ${room.roundNumber} started: ${gameType}`);
  });

  // ── Submit Answer ──
  socket.on('submit-answer', ({ answer, timeLeft }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.state !== 'playing') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const answerKey = `${socket.id}-${room.currentQuestionIndex}`;
    if (room.currentAnswers.has(answerKey)) return;

    const question = room.currentGameData.questions[room.currentQuestionIndex];
    const isCorrect = room.gameEngine.checkAnswer(room.currentGame, question, answer);
    const points = isCorrect ? room.gameEngine.calculatePoints(room.currentGame, Math.max(0, timeLeft)) : 0;

    room.currentAnswers.set(answerKey, { playerId: socket.id, answer, isCorrect, points, timeLeft });

    player.roundScore += points;
    player.score += points;

    socket.emit('answer-result', { isCorrect, points, totalScore: player.score, roundScore: player.roundScore });

    io.to(room.code).emit('leaderboard-update', { leaderboard: getLeaderboard(room) });

    // All players answered → advance
    const answered = [...room.currentAnswers.keys()].filter(k => k.endsWith(`-${room.currentQuestionIndex}`)).length;
    if (answered >= room.players.size) {
      clearTimeout(room.questionTimer);
      setTimeout(() => advanceQuestion(room), 500);
    }
  });

  // ── End Game (host) ──
  socket.on('end-game', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.hostId !== socket.id) return;
    endGame(room);
  });

  // ── Return to Lobby ──
  socket.on('return-to-lobby', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.hostId !== socket.id) return;

    room.state = 'lobby';
    io.to(room.code).emit('returned-to-lobby', { players: getPlayersList(room) });
  });

  // ── Play Again (reset scores) ──
  socket.on('play-again', () => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.hostId !== socket.id) return;

    room.state = 'lobby';
    room.roundNumber = 0;
    room.roundHistory = [];
    room.players.forEach(p => { p.score = 0; p.roundScore = 0; });

    io.to(room.code).emit('game-reset', { players: getPlayersList(room) });
  });

  // ── Disconnect ──
  socket.on('disconnect', () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    room.players.delete(socket.id);

    if (room.players.size === 0) {
      clearTimeout(room.questionTimer);
      rooms.delete(socket.roomCode);
      console.log(`[Room ${socket.roomCode}] Deleted (empty)`);
      return;
    }

    // Transfer host
    if (room.hostId === socket.id) {
      const newHost = room.players.values().next().value;
      newHost.isHost = true;
      room.hostId = newHost.id;
      io.to(newHost.id).emit('you-are-host');
    }

    const players = getPlayersList(room);
    io.to(room.code).emit('player-left', { player: player ? { name: player.name, avatar: player.avatar } : null, players });
    console.log(`[Room ${socket.roomCode}] "${player?.name}" disconnected (${room.players.size} left)`);
  });
});

// ─── Game Flow Helpers ───

function sanitizeQuestion(q) {
  // Strip correct answer info before sending to client
  const safe = { ...q };
  if (safe.type === 'trivia') {
    delete safe.correct;
  } else if (safe.type === 'emoji') {
    delete safe.answer;
  } else if (safe.type === 'human-or-ai') {
    delete safe.isHuman;
    delete safe.author;
  }
  return safe;
}

function startQuestionTimer(room) {
  const question = room.currentGameData.questions[room.currentQuestionIndex];
  const timeLimit = question.timeLimit || 15;

  room.questionTimer = setTimeout(() => {
    advanceQuestion(room);
  }, (timeLimit + 2) * 1000);
}

function advanceQuestion(room) {
  clearTimeout(room.questionTimer);
  const currentQ = room.currentGameData.questions[room.currentQuestionIndex];

  // Reveal correct answer
  const reveal = { questionIndex: room.currentQuestionIndex };
  if (currentQ.type === 'trivia') {
    reveal.correctIndex = currentQ.correct;
    reveal.correctAnswer = currentQ.options[currentQ.correct];
  } else if (currentQ.type === 'emoji') {
    reveal.correctAnswer = currentQ.answer;
  } else if (currentQ.type === 'human-or-ai') {
    reveal.correctAnswer = currentQ.isHuman ? 'human' : 'ai';
    reveal.author = currentQ.author;
  }

  io.to(room.code).emit('question-result', reveal);

  room.currentQuestionIndex++;

  if (room.currentQuestionIndex >= room.currentGameData.questions.length) {
    setTimeout(() => endRound(room), 3500);
    return;
  }

  // Next question after pause
  setTimeout(() => {
    if (room.state !== 'playing') return;
    const nextQ = sanitizeQuestion(room.currentGameData.questions[room.currentQuestionIndex]);
    io.to(room.code).emit('next-question', {
      question: nextQ,
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.currentGameData.questions.length,
      timeLimit: nextQ.timeLimit,
    });
    startQuestionTimer(room);
  }, 3500);
}

function endRound(room) {
  room.state = 'results';

  const roundScores = Array.from(room.players.values())
    .map(p => ({ name: p.name, avatar: p.avatar, roundScore: p.roundScore || 0, totalScore: p.score }))
    .sort((a, b) => b.totalScore - a.totalScore);

  room.roundHistory.push({
    roundNumber: room.roundNumber,
    gameType: room.currentGame,
    gameName: room.currentGameData.config.name,
    scores: roundScores,
  });

  room.players.forEach(p => { p.roundScore = 0; });

  io.to(room.code).emit('round-end', {
    roundNumber: room.roundNumber,
    scores: roundScores,
    roundHistory: room.roundHistory,
  });

  console.log(`[Room ${room.code}] Round ${room.roundNumber} ended`);
}

function endGame(room) {
  clearTimeout(room.questionTimer);
  room.state = 'final';

  const finalScores = Array.from(room.players.values())
    .map(p => ({ name: p.name, avatar: p.avatar, totalScore: p.score }))
    .sort((a, b) => b.totalScore - a.totalScore);

  io.to(room.code).emit('game-over', {
    finalScores,
    roundHistory: room.roundHistory,
    totalRounds: room.roundNumber,
  });

  console.log(`[Room ${room.code}] Game over after ${room.roundNumber} rounds`);
}

// ─── Cleanup stale rooms every 30 min ───
setInterval(() => {
  for (const [code, room] of rooms) {
    if (room.players.size === 0) rooms.delete(code);
  }
}, 30 * 60 * 1000);

// ─── Start Server ───
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🎮  G A M I O`);
  console.log(`   The Ultimate Party Game`);
  console.log(`   Running at http://localhost:${PORT}\n`);
});
