// ============================================
// GAMIO — Question Bank
// Rich pre-loaded content for all game modes
// When OpenAI API key is added, questions can
// also be generated dynamically.
// ============================================

const triviaQuestions = [
  // ─── Science & Nature ───
  { question: 'What planet in our solar system has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 1, category: 'Science' },
  { question: 'What is the hardest natural substance on Earth?', options: ['Titanium', 'Diamond', 'Quartz', 'Obsidian'], correct: 1, category: 'Science' },
  { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '256'], correct: 1, category: 'Science' },
  { question: 'What is the closest star to Earth (besides the Sun)?', options: ['Alpha Centauri A', 'Proxima Centauri', 'Barnard\'s Star', 'Sirius'], correct: 1, category: 'Science' },
  { question: 'What element has the chemical symbol "Au"?', options: ['Silver', 'Aluminum', 'Gold', 'Argon'], correct: 2, category: 'Science' },
  { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], correct: 2, category: 'Science' },
  { question: 'What gas makes up about 78% of Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], correct: 2, category: 'Science' },
  { question: 'How many hearts does an octopus have?', options: ['1', '2', '3', '4'], correct: 2, category: 'Science' },

  // ─── Technology ───
  { question: 'What year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], correct: 2, category: 'Technology' },
  { question: 'What does "HTTP" stand for?', options: ['HyperText Transfer Protocol', 'High Tech Transfer Program', 'Home Tool Transfer Protocol', 'HyperText Transmission Package'], correct: 0, category: 'Technology' },
  { question: 'Who co-founded Microsoft with Bill Gates?', options: ['Steve Jobs', 'Paul Allen', 'Steve Wozniak', 'Larry Page'], correct: 1, category: 'Technology' },
  { question: 'What programming language has a coffee cup as its logo?', options: ['Python', 'C++', 'JavaScript', 'Java'], correct: 3, category: 'Technology' },
  { question: 'What does "URL" stand for?', options: ['Universal Resource Link', 'Uniform Resource Locator', 'United Resource Library', 'Universal Routing Language'], correct: 1, category: 'Technology' },
  { question: 'What year was YouTube founded?', options: ['2003', '2004', '2005', '2006'], correct: 2, category: 'Technology' },
  { question: 'What company\'s slogan was "Think Different"?', options: ['Google', 'Microsoft', 'Apple', 'IBM'], correct: 2, category: 'Technology' },
  { question: 'What does "AI" stand for in technology?', options: ['Auto Integration', 'Artificial Intelligence', 'Advanced Interface', 'Analog Input'], correct: 1, category: 'Technology' },

  // ─── History ───
  { question: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2, category: 'History' },
  { question: 'Who was the first person to walk on the Moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'John Glenn', 'Neil Armstrong'], correct: 3, category: 'History' },
  { question: 'What year did the Titanic sink?', options: ['1910', '1912', '1915', '1918'], correct: 1, category: 'History' },
  { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correct: 2, category: 'History' },
  { question: 'What year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correct: 2, category: 'History' },
  { question: 'What ancient civilization built the Great Pyramids of Giza?', options: ['Romans', 'Greeks', 'Mayans', 'Egyptians'], correct: 3, category: 'History' },
  { question: 'What was the ancient Roman language?', options: ['Greek', 'Latin', 'Aramaic', 'Sanskrit'], correct: 1, category: 'History' },
  { question: 'Who wrote the play "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1, category: 'History' },

  // ─── Pop Culture ───
  { question: 'What is the name of the wizard school in Harry Potter?', options: ['Hogwarts', 'Beauxbatons', 'Durmstrang', 'Ilvermorny'], correct: 0, category: 'Pop Culture' },
  { question: 'Who played Iron Man in the MCU?', options: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'], correct: 2, category: 'Pop Culture' },
  { question: 'What animated movie features a clownfish named Nemo?', options: ['Shark Tale', 'Finding Nemo', 'The Little Mermaid', 'Moana'], correct: 1, category: 'Pop Culture' },
  { question: 'What band performed "Bohemian Rhapsody"?', options: ['The Beatles', 'Led Zeppelin', 'Queen', 'Pink Floyd'], correct: 2, category: 'Pop Culture' },
  { question: 'What TV show features dragons and the Iron Throne?', options: ['The Witcher', 'Game of Thrones', 'Lord of the Rings', 'Vikings'], correct: 1, category: 'Pop Culture' },
  { question: 'Who is the voice of Woody in Toy Story?', options: ['Tim Allen', 'Tom Hanks', 'Robin Williams', 'Billy Crystal'], correct: 1, category: 'Pop Culture' },
  { question: 'What fictional city is Batman\'s home?', options: ['Metropolis', 'Star City', 'Gotham City', 'Central City'], correct: 2, category: 'Pop Culture' },
  { question: 'What is the highest-grossing film of all time (worldwide)?', options: ['Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars: The Force Awakens'], correct: 1, category: 'Pop Culture' },

  // ─── Geography ───
  { question: 'What is the capital of Japan?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Yokohama'], correct: 2, category: 'Geography' },
  { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1, category: 'Geography' },
  { question: 'Which continent has the most countries?', options: ['Asia', 'Europe', 'Africa', 'South America'], correct: 2, category: 'Geography' },
  { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, category: 'Geography' },
  { question: 'What is the tallest mountain in the world?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], correct: 2, category: 'Geography' },
  { question: 'In which country would you find the Great Barrier Reef?', options: ['New Zealand', 'Indonesia', 'Australia', 'Philippines'], correct: 2, category: 'Geography' },
  { question: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correct: 2, category: 'Geography' },
  { question: 'What is the longest river in Africa?', options: ['Congo', 'Niger', 'Zambezi', 'Nile'], correct: 3, category: 'Geography' },
];

const emojiPuzzles = [
  // ─── Movies ───
  { emojis: '🦁👑', answer: 'The Lion King', category: 'Movie', hint: 'Disney classic' },
  { emojis: '⭐⚔️', answer: 'Star Wars', category: 'Movie', hint: 'A galaxy far, far away' },
  { emojis: '🕷️🧑', answer: 'Spider Man', category: 'Movie', hint: 'Friendly neighborhood hero' },
  { emojis: '❄️👸🏰', answer: 'Frozen', category: 'Movie', hint: 'Let it go!' },
  { emojis: '👻🔫👨‍🔬', answer: 'Ghostbusters', category: 'Movie', hint: 'Who you gonna call?' },
  { emojis: '🏠🎈⬆️', answer: 'Up', category: 'Movie', hint: 'Pixar tearjerker' },
  { emojis: '🧙‍♂️💍🌋', answer: 'Lord of the Rings', category: 'Movie', hint: 'One ring to rule them all' },
  { emojis: '🦇🃏', answer: 'The Dark Knight', category: 'Movie', hint: 'Gotham\'s hero' },
  { emojis: '🏴‍☠️⚓🗺️', answer: 'Pirates of the Caribbean', category: 'Movie', hint: 'Captain Jack' },
  { emojis: '🧊🚢💔', answer: 'Titanic', category: 'Movie', hint: 'Unsinkable... or was it?' },
  { emojis: '🦖🏝️', answer: 'Jurassic Park', category: 'Movie', hint: 'Life finds a way' },
  { emojis: '🐒🍌👑', answer: 'King Kong', category: 'Movie', hint: 'Empire State sized' },
  { emojis: '🔴💊🔵💊', answer: 'The Matrix', category: 'Movie', hint: 'Choose wisely' },
  { emojis: '🦸‍♂️🔨⚡', answer: 'Thor', category: 'Movie', hint: 'God of Thunder' },
  { emojis: '🐉👩‍🦰⚔️', answer: 'Game of Thrones', category: 'TV Show', hint: 'Winter is coming' },

  // ─── Phrases & Concepts ───
  { emojis: '🌧️🐱🐶', answer: 'Raining Cats and Dogs', category: 'Phrase', hint: 'Heavy weather idiom' },
  { emojis: '🐘🏠', answer: 'Elephant in the Room', category: 'Phrase', hint: 'Awkward obvious thing' },
  { emojis: '⏰💣', answer: 'Time Bomb', category: 'Phrase', hint: 'Tick tock...' },
  { emojis: '🧠🌪️', answer: 'Brainstorm', category: 'Phrase', hint: 'Group thinking session' },
  { emojis: '🎯🐂👁️', answer: 'Bullseye', category: 'Phrase', hint: 'Perfect hit!' },
  { emojis: '🌍🔥🌡️', answer: 'Global Warming', category: 'Science', hint: 'Environmental crisis' },
  { emojis: '🎂🎈🎉', answer: 'Birthday Party', category: 'Phrase', hint: 'Annual celebration' },
  { emojis: '💡🔌', answer: 'Light Bulb', category: 'Object', hint: 'Bright idea!' },
  { emojis: '🌈🦄✨', answer: 'Fantasy', category: 'Concept', hint: 'Magical and unreal' },
  { emojis: '🏖️☀️🌊', answer: 'Beach Day', category: 'Phrase', hint: 'Sun, sand, and surf' },
];

const humanOrAiQuotes = [
  // ─── Real Human Quotes ───
  { text: 'The only thing we have to fear is fear itself.', author: 'Franklin D. Roosevelt', isHuman: true },
  { text: 'I think, therefore I am.', author: 'René Descartes', isHuman: true },
  { text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.', author: 'Albert Einstein', isHuman: true },
  { text: 'That\'s one small step for man, one giant leap for mankind.', author: 'Neil Armstrong', isHuman: true },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', isHuman: true },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', isHuman: true },
  { text: 'In three words I can sum up everything I\'ve learned about life: it goes on.', author: 'Robert Frost', isHuman: true },
  { text: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', author: 'Ralph Waldo Emerson', isHuman: true },
  { text: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.', author: 'James Baldwin', isHuman: true },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', isHuman: true },
  { text: 'It does not do to dwell on dreams and forget to live.', author: 'J.K. Rowling (Dumbledore)', isHuman: true },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant (on Aristotle)', isHuman: true },

  // ─── AI-Generated Quotes ───
  { text: 'In the vast tapestry of existence, every thread of consciousness weaves a pattern of infinite possibility and purpose.', author: 'AI Generated', isHuman: false },
  { text: 'The intersection of human creativity and algorithmic precision creates a new paradigm of understanding that transcends both.', author: 'AI Generated', isHuman: false },
  { text: 'True wisdom emerges not from the accumulation of data, but from the synthesis of diverse perspectives across the corridors of time.', author: 'AI Generated', isHuman: false },
  { text: 'Every data point in the universe tells a story, and together they compose a symphony of interconnected understanding.', author: 'AI Generated', isHuman: false },
  { text: 'Growth occurs at the luminous edge of comfort, where the known dissolves into the beautifully unexplored.', author: 'AI Generated', isHuman: false },
  { text: 'The measure of progress is not velocity, but the depth of meaning extracted from each moment of deliberate iteration.', author: 'AI Generated', isHuman: false },
  { text: 'Innovation is the natural consequence of connecting previously unrelated concepts across the boundaries of established domains.', author: 'AI Generated', isHuman: false },
  { text: 'The boundaries between imagination and reality are merely constructs awaiting the courage of redefinition.', author: 'AI Generated', isHuman: false },
  { text: 'Collaboration amplifies individual brilliance exponentially, creating emergent solutions that no single perspective could achieve.', author: 'AI Generated', isHuman: false },
  { text: 'The universe rewards those who approach complexity with curiosity rather than fear, finding elegant simplicity within chaos.', author: 'AI Generated', isHuman: false },
  { text: 'Every challenge is an invitation to evolve, an algorithmic prompt for the human spirit to iterate toward its highest potential.', author: 'AI Generated', isHuman: false },
  { text: 'Knowledge without empathy is computation. Empathy without knowledge is sentiment. Together, they form wisdom.', author: 'AI Generated', isHuman: false },
];

// Utility: shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N random items from array
function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

module.exports = {
  triviaQuestions,
  emojiPuzzles,
  humanOrAiQuotes,
  shuffle,
  pickRandom,
};
