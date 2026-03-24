// ============================================
// GAMIO — Client
// Socket.IO + SPA game client
// ============================================

// ─── Avatars ───
const AVATARS = [
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '🐙', name: 'Octopus' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '🐲', name: 'Dragon' },
  { emoji: '🦉', name: 'Owl' },
  { emoji: '🤖', name: 'Robot' },
  { emoji: '🦈', name: 'Shark' },
  { emoji: '🦜', name: 'Parrot' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🦩', name: 'Flamingo' },
  { emoji: '🐺', name: 'Wolf' },
  { emoji: '🎃', name: 'Pumpkin' },
];

// ─── State ───
const state = {
  mode: null,          // 'create' | 'join'
  roomCode: null,
  player: null,
  players: [],
  isHost: false,
  // Game
  gameType: null,
  gameName: '',
  gameIcon: '',
  roundNumber: 0,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  hasAnswered: false,
  myScore: 0,
  myRoundScore: 0,
  selectedAvatar: null,
  selectedGame: null,
  // Timer
  timerInterval: null,
  timeLeft: 0,
  timeLimit: 15,
  // Results
  roundHistory: [],
};

// ─── Socket ───
const socket = io();

// ─── DOM Helpers ───
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Screen Management ───
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const screen = $(`#screen-${id}`);
  if (screen) screen.classList.add('active');
}

// ─── Toast ───
function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

// ─── Initialize ───
function init() {
  setupAvatarGrid();
  setupEventListeners();
  setupSocketHandlers();
  initHomeParticles();
}

// ─── Avatar Grid ───
function setupAvatarGrid() {
  const grid = $('#avatar-grid');
  grid.innerHTML = AVATARS.map((a, i) =>
    `<div class="avatar-option" data-index="${i}" title="${a.name}">${a.emoji}</div>`
  ).join('');

  grid.addEventListener('click', (e) => {
    const opt = e.target.closest('.avatar-option');
    if (!opt) return;
    $$('.avatar-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    state.selectedAvatar = AVATARS[Number(opt.dataset.index)];
  });
}

// ─── Event Listeners ───
function setupEventListeners() {
  // Home → Setup
  $('#btn-create').addEventListener('click', () => {
    state.mode = 'create';
    $('#join-code-group').classList.add('hidden');
    showScreen('setup');
    $('#input-name').focus();
  });

  $('#btn-join').addEventListener('click', () => {
    state.mode = 'join';
    $('#join-code-group').classList.remove('hidden');
    showScreen('setup');
    $('#input-code').focus();
  });

  // Setup → Back
  $('#btn-back').addEventListener('click', () => showScreen('home'));

  // Ready
  $('#btn-ready').addEventListener('click', () => {
    const name = $('#input-name').value.trim();
    if (!name) { showToast('Enter your name!', 'error'); $('#input-name').focus(); return; }
    if (!state.selectedAvatar) { showToast('Pick an avatar!', 'error'); return; }

    if (state.mode === 'create') {
      socket.emit('create-room', { name, avatar: state.selectedAvatar.emoji });
    } else {
      const code = $('#input-code').value.trim().toUpperCase();
      if (!code || code.length < 4) { showToast('Enter a 4-letter room code!', 'error'); $('#input-code').focus(); return; }
      socket.emit('join-room', { code, name, avatar: state.selectedAvatar.emoji });
    }
  });

  // Enter key on inputs
  $('#input-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (state.mode === 'join') { $('#input-code').focus(); }
      else { $('#btn-ready').click(); }
    }
  });
  $('#input-code').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btn-ready').click(); });

  // Copy room code
  $('#btn-copy').addEventListener('click', () => {
    const code = state.roomCode;
    if (code) {
      navigator.clipboard.writeText(code).then(() => showToast('Code copied!', 'success'));
    }
  });

  // Start round
  $('#btn-start-round').addEventListener('click', () => {
    if (!state.selectedGame) return;
    socket.emit('start-round', { gameType: state.selectedGame });
  });

  // Next round (from results)
  $('#btn-next-round').addEventListener('click', () => {
    if (!state.selectedGame) { showToast('Pick a game first!', 'error'); return; }
    socket.emit('start-round', { gameType: state.selectedGame });
  });

  // End game
  $('#btn-end-game').addEventListener('click', () => socket.emit('end-game'));

  // Play again
  $('#btn-play-again').addEventListener('click', () => socket.emit('play-again'));

  // Stop round mid-game (host)
  $('#btn-stop-game').addEventListener('click', () => {
    if (confirm('Stop the current round? Scores so far will be kept.')) {
      socket.emit('stop-round');
    }
  });

  // Leave game (any player)
  $('#btn-leave-game').addEventListener('click', () => {
    if (confirm('Leave the game? You can rejoin with a new code.')) {
      socket.emit('leave-game');
    }
  });

  // Emoji reactions
  $$('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      socket.emit('reaction', { emoji });
      showFloatingReaction(emoji, 'You');
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });
}

// ─── Game Selector (reusable) ───
function renderGameSelector(containerId) {
  const container = $(`#${containerId}`);
  const categories = [
    { name: 'Trivia & Knowledge', icon: '🧠', games: [
      { id: 'trivia', icon: '🧠', name: 'Trivia Blitz' },
      { id: 'guess-year', icon: '📅', name: 'Guess the Year' },
      { id: 'true-false', icon: '✅', name: 'True or False' },
      { id: 'human-or-ai', icon: '🤖', name: 'Who Said It?' },
    ]},
    { name: 'Decode & Guess', icon: '🎯', games: [
      { id: 'emoji', icon: '🎯', name: 'Emoji Decode' },
      { id: 'missing-lyrics', icon: '🎵', name: 'Missing Lyrics' },
      { id: 'spot-the-fake', icon: '🕵️', name: 'Spot the Fake' },
    ]},
    { name: 'Words & Speed', icon: '⚡', games: [
      { id: 'scramble', icon: '🔤', name: 'Word Scramble' },
      { id: 'odd-one-out', icon: '🔍', name: 'Odd One Out' },
      { id: 'speed-math', icon: '🔢', name: 'Speed Math' },
    ]},
  ];

  container.innerHTML = categories.map(cat => `
    <div class="game-category">
      <div class="game-category-header">
        <div class="game-category-header-left">
          <span class="game-category-header-icon">${cat.icon}</span>
          <span class="game-category-header-name">${cat.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.4rem">
          <span class="game-category-header-count">${cat.games.length}</span>
          <span class="game-category-chevron">▼</span>
        </div>
      </div>
      <div class="game-category-body">
        <div class="game-category-grid">
          ${cat.games.map(g => `
            <div class="game-card" data-game="${g.id}"><span class="game-icon">${g.icon}</span><span class="game-name">${g.name}</span></div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Accordion toggle for category headers
  container.querySelectorAll('.game-category-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (!card) return;
    // Deselect all in BOTH selectors
    $$('.game-card').forEach(c => c.classList.remove('selected'));
    // Select this one AND its mirror
    const game = card.dataset.game;
    $$(`[data-game="${game}"]`).forEach(c => c.classList.add('selected'));
    state.selectedGame = game;

    // Enable start buttons
    const startBtn = $('#btn-start-round');
    const nextBtn = $('#btn-next-round');
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = `Start ${card.querySelector('.game-name').textContent}`; }
    if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = `Start ${card.querySelector('.game-name').textContent}`; }
  });
}

// ─── Socket Handlers ───
function setupSocketHandlers() {
  // ── Room Created ──
  socket.on('room-created', ({ code, player, players }) => {
    state.roomCode = code;
    state.player = player;
    state.players = players;
    state.isHost = true;
    state.myScore = 0;

    $('#room-code').textContent = code;
    renderPlayers(players);
    showHostControls(true);
    renderGameSelector('game-selector');
    renderGameSelector('results-game-selector');
    showScreen('lobby');
    showToast('Room created!', 'success');
  });

  // ── Room Joined ──
  socket.on('room-joined', ({ code, player, players }) => {
    state.roomCode = code;
    state.player = player;
    state.players = players;
    state.isHost = false;
    state.myScore = 0;

    $('#room-code').textContent = code;
    renderPlayers(players);
    showHostControls(false);
    showScreen('lobby');
    showToast(`Joined room ${code}!`, 'success');
  });

  // ── Player Joined ──
  socket.on('player-joined', ({ player, players }) => {
    state.players = players;
    renderPlayers(players);
    showToast(`${player.name} joined!`, 'info');
    playSound('join');
  });

  // ── Player Left ──
  socket.on('player-left', ({ player, players }) => {
    state.players = players;
    renderPlayers(players);
    if (player) showToast(`${player.name} left`, 'info');
  });

  // ── You Are Host ──
  socket.on('you-are-host', () => {
    state.isHost = true;
    showHostControls(true);
    renderGameSelector('game-selector');
    renderGameSelector('results-game-selector');
    showToast('You are now the host! 👑', 'success');
  });

  // ── Round Start ──
  socket.on('round-start', (data) => {
    state.gameType = data.gameType;
    state.gameName = data.gameName;
    state.gameIcon = data.gameIcon;
    state.roundNumber = data.roundNumber;
    state.questionIndex = data.questionIndex;
    state.totalQuestions = data.totalQuestions;
    state.currentQuestion = data.question;
    state.hasAnswered = false;
    state.myRoundScore = 0;

    $('#game-type-badge').textContent = `${data.gameIcon} ${data.gameName}`;
    $('#round-badge').textContent = `Round ${data.roundNumber}`;
    $('#q-counter').textContent = `${data.questionIndex + 1}/${data.totalQuestions}`;
    $('#my-score').textContent = `${state.myScore} pts`;

    renderQuestion(data.question);
    startTimer(data.timeLimit);
    updateGameSidebarButtons();
    showScreen('game');
    playSound('roundstart');
  });

  // ── Next Question ──
  socket.on('next-question', (data) => {
    state.questionIndex = data.questionIndex;
    state.totalQuestions = data.totalQuestions;
    state.currentQuestion = data.question;
    state.hasAnswered = false;

    $('#q-counter').textContent = `${data.questionIndex + 1}/${data.totalQuestions}`;
    renderQuestion(data.question);
    startTimer(data.timeLimit);
  });

  // ── Answer Result ──
  socket.on('answer-result', ({ isCorrect, points, totalScore, roundScore }) => {
    state.myScore = totalScore;
    state.myRoundScore = roundScore;
    $('#my-score').textContent = `${totalScore} pts`;
    showAnswerFeedback(isCorrect, points);
    playSound(isCorrect ? 'correct' : 'wrong');
  });

  // ── Question Result (correct answer reveal) ──
  socket.on('question-result', (data) => {
    stopTimer();
    revealAnswer(data);
  });

  // ── Leaderboard Update ──
  socket.on('leaderboard-update', ({ leaderboard }) => {
    renderMiniLeaderboard(leaderboard);
  });

  // ── Round End ──
  socket.on('round-end', ({ roundNumber, scores, roundHistory }) => {
    state.roundHistory = roundHistory;
    stopTimer();
    renderRoundResults(scores, roundNumber);
    if (state.isHost) {
      $('#host-results-controls').classList.remove('hidden');
      $('#waiting-next').classList.add('hidden');
      renderGameSelector('results-game-selector');
      state.selectedGame = null;
      $('#btn-next-round').disabled = true;
      $('#btn-next-round').textContent = 'Select a game first';
    } else {
      $('#host-results-controls').classList.add('hidden');
      $('#waiting-next').classList.remove('hidden');
    }
    showScreen('results');
  });

  // ── Game Over ──
  socket.on('game-over', ({ finalScores, roundHistory, totalRounds }) => {
    stopTimer();
    renderFinalResults(finalScores, roundHistory, totalRounds);
    if (state.isHost) {
      $('#host-final-controls').classList.remove('hidden');
    } else {
      $('#host-final-controls').classList.add('hidden');
    }
    showScreen('final');
    launchConfetti();
    playSound('winner');
  });

  // ── Game Reset (Play Again) ──
  socket.on('game-reset', ({ players }) => {
    state.players = players;
    state.myScore = 0;
    state.myRoundScore = 0;
    state.roundNumber = 0;
    state.roundHistory = [];
    state.selectedGame = null;

    renderPlayers(players);
    showHostControls(state.isHost);
    if (state.isHost) {
      renderGameSelector('game-selector');
      $('#btn-start-round').disabled = true;
      $('#btn-start-round').textContent = 'Select a game to start';
    }
    showScreen('lobby');
    showToast('New game! Scores reset.', 'success');
  });

  // ── Returned to Lobby ──
  socket.on('returned-to-lobby', ({ players }) => {
    state.players = players;
    renderPlayers(players);
    showHostControls(state.isHost);
    if (state.isHost) {
      renderGameSelector('game-selector');
    }
    showScreen('lobby');
  });

  // ── Left Game ──
  socket.on('left-game', () => {
    stopTimer();
    state.roomCode = null;
    state.player = null;
    state.isHost = false;
    state.myScore = 0;
    showScreen('home');
    showToast('You left the game', 'info');
  });

  // ── Emoji Reaction ──
  socket.on('reaction', ({ name, avatar, emoji }) => {
    showFloatingReaction(emoji, name);
  });

  // ── Error ──
  socket.on('error-msg', ({ message }) => showToast(message, 'error'));

  // ── Connection Handling ──
  socket.on('disconnect', () => {
    $('#connection-overlay').classList.remove('hidden');
    $('#connection-msg').textContent = 'Connection lost. Reconnecting...';
  });

  socket.on('connect', () => {
    $('#connection-overlay').classList.add('hidden');
    if (state.roomCode) {
      showToast('Reconnected!', 'success');
    }
  });
}

// ─── Render Players Grid ───
function renderPlayers(players) {
  const grid = $('#players-grid');
  grid.innerHTML = players.map(p =>
    `<div class="player-card ${p.isHost ? 'is-host' : ''}">
      <span class="player-avatar">${p.avatar}</span>
      <span class="player-name">${p.name}</span>
    </div>`
  ).join('');
  $('#player-count').textContent = players.length;
}

function showHostControls(isHost) {
  if (isHost) {
    $('#host-controls').classList.remove('hidden');
    $('#waiting-msg').classList.add('hidden');
  } else {
    $('#host-controls').classList.add('hidden');
    $('#waiting-msg').classList.remove('hidden');
  }
}

// ─── Render Question (dispatches by type) ───
function renderQuestion(question) {
  const area = $('#question-area');
  area.innerHTML = '';
  state.hasAnswered = false;

  switch (question.type) {
    case 'trivia':
      renderTriviaQuestion(area, question);
      break;
    case 'emoji':
      renderEmojiQuestion(area, question);
      break;
    case 'human-or-ai':
      renderHumanOrAiQuestion(area, question);
      break;
    case 'scramble':
      renderScrambleQuestion(area, question);
      break;
    case 'odd-one-out':
      renderOddOneOutQuestion(area, question);
      break;
    case 'guess-year':
      renderGuessYearQuestion(area, question);
      break;
    case 'true-false':
      renderTrueFalseQuestion(area, question);
      break;
    case 'missing-lyrics':
      renderMissingLyricsQuestion(area, question);
      break;
    case 'spot-the-fake':
      renderSpotTheFakeQuestion(area, question);
      break;
    case 'speed-math':
      renderSpeedMathQuestion(area, question);
      break;
  }
}

// ── Trivia ──
function renderTriviaQuestion(area, q) {
  const letters = ['A', 'B', 'C', 'D'];
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <p class="question-text">${q.question}</p>
    <div class="options-grid">
      ${q.options.map((opt, i) => `
        <button class="option-btn" data-index="${i}">
          <span class="option-letter">${letters[i]}</span>
          <span>${opt}</span>
        </button>
      `).join('')}
    </div>
  `;
  area.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      area.querySelectorAll('.option-btn').forEach(b => { b.disabled = true; });
      btn.classList.add('selected');
      socket.emit('submit-answer', { answer: Number(btn.dataset.index), timeLeft: state.timeLeft });
    });
  });
}

// ── Emoji Decode ──
function renderEmojiQuestion(area, q) {
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <div class="emoji-display">${q.emojis}</div>
    <p class="emoji-hint">Hint: ${q.hint || '???'}</p>
    <div class="emoji-input-wrapper">
      <input type="text" class="emoji-input" id="emoji-answer" placeholder="Your answer..." autocomplete="off" spellcheck="false">
      <button class="emoji-submit" id="emoji-submit-btn">Go!</button>
    </div>
  `;
  const input = area.querySelector('#emoji-answer');
  const btn = area.querySelector('#emoji-submit-btn');

  function submit() {
    if (state.hasAnswered) return;
    const answer = input.value.trim();
    if (!answer) return;
    state.hasAnswered = true;
    input.disabled = true;
    btn.disabled = true;
    socket.emit('submit-answer', { answer, timeLeft: state.timeLeft });
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  setTimeout(() => input.focus(), 100);
}

// ── Human or AI ──
function renderHumanOrAiQuestion(area, q) {
  area.innerHTML = `
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">Who said this?</p>
    <div class="quote-text">${q.text}</div>
    <div class="choice-buttons">
      <button class="choice-btn" data-choice="human">
        <span class="choice-icon">🧑</span>
        <span class="choice-label">Human</span>
      </button>
      <button class="choice-btn" data-choice="ai">
        <span class="choice-icon">🤖</span>
        <span class="choice-label">AI</span>
      </button>
    </div>
  `;
  area.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      area.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; });
      btn.classList.add('selected');
      socket.emit('submit-answer', { answer: btn.dataset.choice, timeLeft: state.timeLeft });
    });
  });
}

// ── Word Scramble ──
function renderScrambleQuestion(area, q) {
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">Unscramble the word!</p>
    <div class="scramble-letters">${q.scrambled.split('').map(l =>
      `<span class="scramble-letter">${l}</span>`
    ).join('')}</div>
    <p class="emoji-hint">Hint: ${q.hint || '???'}</p>
    <div class="emoji-input-wrapper">
      <input type="text" class="emoji-input" id="scramble-answer" placeholder="Your answer..." autocomplete="off" spellcheck="false">
      <button class="emoji-submit" id="scramble-submit-btn">Go!</button>
    </div>
  `;
  const input = area.querySelector('#scramble-answer');
  const btn = area.querySelector('#scramble-submit-btn');

  function submit() {
    if (state.hasAnswered) return;
    const answer = input.value.trim();
    if (!answer) return;
    state.hasAnswered = true;
    input.disabled = true;
    btn.disabled = true;
    socket.emit('submit-answer', { answer, timeLeft: state.timeLeft });
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  setTimeout(() => input.focus(), 100);
}

// ── Odd One Out ──
function renderOddOneOutQuestion(area, q) {
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <p class="question-text">Which one doesn't belong?</p>
    <div class="options-grid">
      ${q.items.map((item, i) => `
        <button class="option-btn odd-btn" data-index="${i}">
          <span>${item}</span>
        </button>
      `).join('')}
    </div>
  `;
  area.querySelectorAll('.odd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      area.querySelectorAll('.odd-btn').forEach(b => { b.disabled = true; });
      btn.classList.add('selected');
      socket.emit('submit-answer', { answer: Number(btn.dataset.index), timeLeft: state.timeLeft });
    });
  });
}

// ── Guess the Year ──
function renderGuessYearQuestion(area, q) {
  const letters = ['A', 'B', 'C', 'D'];
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">When did this happen?</p>
    <p class="question-text" style="font-size:1.15rem">${q.event}</p>
    <div class="options-grid">
      ${q.options.map((opt, i) => `
        <button class="option-btn" data-index="${i}">
          <span class="option-letter">${letters[i]}</span>
          <span>${opt}</span>
        </button>
      `).join('')}
    </div>
  `;
  area.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      area.querySelectorAll('.option-btn').forEach(b => { b.disabled = true; });
      btn.classList.add('selected');
      socket.emit('submit-answer', { answer: Number(btn.dataset.index), timeLeft: state.timeLeft });
    });
  });
}

// ── True or False ──
function renderTrueFalseQuestion(area, q) {
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">True or False?</p>
    <div class="quote-text" style="font-size:1.15rem">${q.statement}</div>
    <div class="choice-buttons">
      <button class="choice-btn" data-choice="true" style="--btn-color: var(--green)">
        <span class="choice-icon">✅</span>
        <span class="choice-label">True</span>
      </button>
      <button class="choice-btn" data-choice="false" style="--btn-color: var(--coral)">
        <span class="choice-icon">❌</span>
        <span class="choice-label">False</span>
      </button>
    </div>
  `;
  area.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      area.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; });
      btn.classList.add('selected');
      socket.emit('submit-answer', { answer: btn.dataset.choice === 'true', timeLeft: state.timeLeft });
    });
  });
}

// ── Missing Lyrics ──
function renderMissingLyricsQuestion(area, q) {
  area.innerHTML = `
    <span class="question-category">🎵 ${q.category || ''}</span>
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">Fill in the missing word!</p>
    <div class="quote-text" style="font-size:1.2rem;font-style:italic">"${q.lyric}"</div>
    <div class="emoji-input-wrapper">
      <input type="text" class="emoji-input" id="lyrics-answer" placeholder="Missing word..." autocomplete="off" spellcheck="false">
      <button class="emoji-submit" id="lyrics-submit-btn">Go!</button>
    </div>
  `;
  const input = area.querySelector('#lyrics-answer');
  const btn = area.querySelector('#lyrics-submit-btn');

  function submit() {
    if (state.hasAnswered) return;
    const answer = input.value.trim();
    if (!answer) return;
    state.hasAnswered = true;
    input.disabled = true;
    btn.disabled = true;
    socket.emit('submit-answer', { answer, timeLeft: state.timeLeft });
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  setTimeout(() => input.focus(), 100);
}

// ── Spot the Fake ──
function renderSpotTheFakeQuestion(area, q) {
  area.innerHTML = `
    <span class="question-category">${q.category || ''}</span>
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">Which "fact" is FAKE?</p>
    <div class="options-grid" style="grid-template-columns: 1fr">
      ${q.facts.map((fact, i) => `
        <button class="option-btn odd-btn" data-index="${i}" style="text-align:left;padding:0.9rem 1.2rem">
          <span style="opacity:0.5;margin-right:0.5rem">${i + 1}.</span>
          <span>${fact}</span>
        </button>
      `).join('')}
    </div>
  `;
  area.querySelectorAll('.odd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnswered) return;
      state.hasAnswered = true;
      area.querySelectorAll('.odd-btn').forEach(b => { b.disabled = true; });
      btn.classList.add('selected');
      socket.emit('submit-answer', { answer: Number(btn.dataset.index), timeLeft: state.timeLeft });
    });
  });
}

// ── Speed Math ──
function renderSpeedMathQuestion(area, q) {
  area.innerHTML = `
    <p class="question-text" style="font-size:1rem;color:var(--text-secondary);font-weight:600">Solve it fast!</p>
    <div class="emoji-display" style="font-size:3rem;letter-spacing:0.1em">${q.expression}</div>
    <div class="emoji-input-wrapper">
      <input type="number" class="emoji-input" id="math-answer" placeholder="= ?" autocomplete="off" inputmode="numeric">
      <button class="emoji-submit" id="math-submit-btn">Go!</button>
    </div>
  `;
  const input = area.querySelector('#math-answer');
  const btn = area.querySelector('#math-submit-btn');

  function submit() {
    if (state.hasAnswered) return;
    const val = input.value.trim();
    if (val === '') return;
    state.hasAnswered = true;
    input.disabled = true;
    btn.disabled = true;
    socket.emit('submit-answer', { answer: Number(val), timeLeft: state.timeLeft });
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  setTimeout(() => input.focus(), 100);
}

// ─── Timer ───
function startTimer(seconds) {
  stopTimer();
  state.timeLeft = seconds;
  state.timeLimit = seconds;

  const circle = $('#timer-circle');
  const text = $('#timer-text');
  const circumference = 2 * Math.PI * 45; // r=45

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = '0';
  circle.classList.remove('warning', 'danger');
  text.textContent = seconds;

  state.timerInterval = setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft < 0) state.timeLeft = 0;

    text.textContent = state.timeLeft;
    const progress = 1 - (state.timeLeft / state.timeLimit);
    circle.style.strokeDashoffset = circumference * progress;

    // Color changes
    circle.classList.remove('warning', 'danger');
    if (state.timeLeft <= 3) { circle.classList.add('danger'); playSound('countdown'); }
    else if (state.timeLeft <= 5) { circle.classList.add('warning'); playSound('tick'); }

    if (state.timeLeft <= 0) {
      stopTimer();
      // Auto-submit empty if not answered
      if (!state.hasAnswered) {
        state.hasAnswered = true;
        socket.emit('submit-answer', { answer: null, timeLeft: 0 });
      }
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

// ─── Answer Feedback ───
function showAnswerFeedback(isCorrect, points) {
  const fb = $('#answer-feedback');
  fb.classList.remove('hidden');
  fb.innerHTML = `
    <div class="${isCorrect ? 'fb-correct' : 'fb-wrong'}" style="text-align:center">
      <div style="font-size:3.5rem">${isCorrect ? '✅' : '❌'}</div>
      <div class="fb-points" style="color: ${isCorrect ? 'var(--green)' : 'var(--coral)'}; font-size:1.3rem; font-weight:800; margin-top:0.25rem">
        ${isCorrect ? `+${points} pts` : 'Wrong!'}
      </div>
    </div>
  `;
  setTimeout(() => fb.classList.add('hidden'), 1800);
}

// ─── Reveal Answer ───
function revealAnswer(data) {
  const area = $('#question-area');

  if (state.gameType === 'trivia' && data.correctIndex !== undefined) {
    const btns = area.querySelectorAll('.option-btn');
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === data.correctIndex) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('wrong');
    });
  } else if (state.gameType === 'emoji') {
    const wrapper = area.querySelector('.emoji-input-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('afterend',
        `<div style="margin-top:0.75rem;font-size:1.1rem;font-weight:700;color:var(--green)">Answer: ${data.correctAnswer}</div>`
      );
    }
  } else if (state.gameType === 'human-or-ai') {
    const btns = area.querySelectorAll('.choice-btn');
    btns.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.choice === data.correctAnswer) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('wrong');
    });
    // Show author
    if (data.author) {
      area.insertAdjacentHTML('beforeend',
        `<div style="margin-top:0.75rem;font-size:0.95rem;color:var(--teal);font-weight:600">— ${data.author}</div>`
      );
    }
  } else if (state.gameType === 'scramble') {
    const wrapper = area.querySelector('.emoji-input-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('afterend',
        `<div style="margin-top:0.75rem;font-size:1.1rem;font-weight:700;color:var(--green)">Answer: ${data.correctAnswer}</div>`
      );
    }
  } else if (state.gameType === 'odd-one-out') {
    const btns = area.querySelectorAll('.odd-btn');
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === data.correctIndex) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('wrong');
    });
    if (data.explanation) {
      area.insertAdjacentHTML('beforeend',
        `<div style="margin-top:0.75rem;font-size:0.9rem;color:var(--teal);font-weight:600">${data.explanation}</div>`
      );
    }
  } else if (state.gameType === 'guess-year') {
    const btns = area.querySelectorAll('.option-btn');
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === data.correctIndex) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('wrong');
    });
  } else if (state.gameType === 'true-false') {
    const btns = area.querySelectorAll('.choice-btn');
    const correctStr = String(data.correctAnswer);
    btns.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.choice === correctStr) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('wrong');
    });
    if (data.explanation) {
      area.insertAdjacentHTML('beforeend',
        `<div style="margin-top:0.75rem;font-size:0.9rem;color:var(--teal);font-weight:600">${data.explanation}</div>`
      );
    }
  } else if (state.gameType === 'missing-lyrics') {
    const wrapper = area.querySelector('.emoji-input-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('afterend',
        `<div style="margin-top:0.75rem;font-size:1.1rem;font-weight:700;color:var(--green)">Answer: ${data.correctAnswer}</div>
         <div style="margin-top:0.3rem;font-size:0.9rem;color:var(--teal)">🎵 ${data.song} — ${data.artist}</div>`
      );
    }
  } else if (state.gameType === 'spot-the-fake') {
    const btns = area.querySelectorAll('.odd-btn');
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === data.correctIndex) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('wrong');
    });
    if (data.explanation) {
      area.insertAdjacentHTML('beforeend',
        `<div style="margin-top:0.75rem;font-size:0.9rem;color:var(--teal);font-weight:600">${data.explanation}</div>`
      );
    }
  } else if (state.gameType === 'speed-math') {
    const wrapper = area.querySelector('.emoji-input-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('afterend',
        `<div style="margin-top:0.75rem;font-size:1.1rem;font-weight:700;color:var(--green)">Answer: ${data.correctAnswer}</div>`
      );
    }
  }
}

// ─── Mini Leaderboard ───
function renderMiniLeaderboard(leaderboard) {
  const container = $('#mini-leaderboard');
  container.innerHTML = leaderboard.map((p, i) => {
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
    return `
      <div class="lb-entry">
        <span class="lb-rank ${rankClass}">${medal}</span>
        <span class="lb-avatar">${p.avatar}</span>
        <span class="lb-name">${p.name}</span>
        <span class="lb-score">${p.score}</span>
      </div>
    `;
  }).join('');
}

// ─── Round Results ───
function renderRoundResults(scores, roundNumber) {
  $('#results-title').textContent = `Round ${roundNumber} Complete!`;

  // Podium (top 3)
  const podium = $('#podium');
  const top3 = scores.slice(0, 3);
  const order = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3; // 2nd, 1st, 3rd
  const classes = top3.length >= 3 ? ['second', 'first', 'third'] : top3.map((_, i) => ['first', 'second', 'third'][i]);
  const medals = { first: '🥇', second: '🥈', third: '🥉' };

  podium.innerHTML = order.map((p, i) => `
    <div class="podium-place">
      <span class="podium-avatar">${p.avatar}</span>
      <span class="podium-name">${p.name}</span>
      <span class="podium-score">${p.totalScore} pts</span>
      <div class="podium-bar ${classes[i]}"><span class="medal">${medals[classes[i]]}</span></div>
    </div>
  `).join('');

  // Full leaderboard
  const lb = $('#results-leaderboard');
  lb.innerHTML = scores.map((p, i) => `
    <div class="lb-entry">
      <span class="lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
      <span class="lb-avatar">${p.avatar}</span>
      <span class="lb-name">${p.name}</span>
      <span class="lb-score" style="margin-left:auto">${p.totalScore} pts</span>
      <span style="font-size:0.75rem;color:var(--green);margin-left:0.5rem">${p.roundScore > 0 ? `+${p.roundScore}` : ''}</span>
    </div>
  `).join('');
}

// ─── Final Results ───
function renderFinalResults(finalScores, roundHistory, totalRounds) {
  // Winner
  const winner = finalScores[0];
  if (winner) {
    const wd = $('#winner-display');
    wd.innerHTML = `
      <span class="winner-avatar">${winner.avatar}</span>
      <div class="winner-name">${winner.name}</div>
      <div class="winner-score">${winner.totalScore} points</div>
    `;
  }

  // Leaderboard
  const lb = $('#final-leaderboard');
  lb.innerHTML = finalScores.map((p, i) => `
    <div class="lb-entry">
      <span class="lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
      <span class="lb-avatar">${p.avatar}</span>
      <span class="lb-name">${p.name}</span>
      <span class="lb-score" style="margin-left:auto">${p.totalScore} pts</span>
    </div>
  `).join('');

  // Round history
  const rh = $('#round-history');
  if (roundHistory && roundHistory.length > 0) {
    rh.innerHTML = `
      <h4>Round History</h4>
      ${roundHistory.map(r => `
        <div class="rh-entry">
          <span class="rh-round">#${r.roundNumber}</span>
          <span class="rh-game">${r.gameName}</span>
          <span class="rh-winner">${r.scores[0]?.avatar} ${r.scores[0]?.name}</span>
        </div>
      `).join('')}
    `;
  }
}

// ─── Confetti ───
function launchConfetti() {
  const canvas = $('#confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#ff7675', '#00b894', '#e17055', '#a29bfe'];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      if (p.y > canvas.height + 50) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (alive && frame < 300) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  animate();
}

// ─── Floating Reactions ───
function showFloatingReaction(emoji, name) {
  const container = $('#floating-reactions');
  const el = document.createElement('div');
  el.className = 'floating-reaction';
  el.innerHTML = `<span class="fr-emoji">${emoji}</span><span class="fr-name">${name}</span>`;
  el.style.left = `${20 + Math.random() * 60}%`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ─── Show/Hide Game Sidebar Buttons ───
function updateGameSidebarButtons() {
  const stopBtn = $('#btn-stop-game');
  const leaveBtn = $('#btn-leave-game');
  if (state.isHost) {
    stopBtn.classList.remove('hidden');
    leaveBtn.classList.add('hidden');
  } else {
    stopBtn.classList.add('hidden');
    leaveBtn.classList.remove('hidden');
  }
}

// ─── Sound Effects (Web Audio API — no files needed) ───
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;

    const now = ctx.currentTime;

    switch (type) {
      case 'correct':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'wrong':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'tick':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.value = 0.08;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'countdown':
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'winner':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.15);
        osc.frequency.setValueAtTime(784, now + 0.3);
        osc.frequency.setValueAtTime(1047, now + 0.45);
        gain.gain.value = 0.2;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;

      case 'join':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1);
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'roundstart':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.setValueAtTime(523, now + 0.12);
        osc.frequency.setValueAtTime(659, now + 0.24);
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
    }
  } catch (e) { /* audio not supported */ }
}

// ─── Home Particle Canvas ───
function initHomeParticles() {
  const canvas = $('#home-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((w * h) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        color: ['#6c5ce7', '#00cec9', '#fdcb6e', '#ff7675', '#a29bfe'][Math.floor(Math.random() * 5)],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,92,231,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ─── Start ───
init();
