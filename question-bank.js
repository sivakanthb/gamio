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

const wordScrambles = [
  // ─── Animals ───
  { word: 'ELEPHANT', hint: 'Largest land animal', category: 'Animals' },
  { word: 'PENGUIN', hint: 'Tuxedo bird that can\'t fly', category: 'Animals' },
  { word: 'GIRAFFE', hint: 'Tallest living animal', category: 'Animals' },
  { word: 'DOLPHIN', hint: 'Smart ocean mammal', category: 'Animals' },
  { word: 'CHAMELEON', hint: 'Color-changing reptile', category: 'Animals' },
  { word: 'BUTTERFLY', hint: 'Caterpillar\'s glow-up', category: 'Animals' },
  { word: 'CROCODILE', hint: 'Ancient swamp predator', category: 'Animals' },
  { word: 'KANGAROO', hint: 'Pouched jumper from Australia', category: 'Animals' },

  // ─── Food ───
  { word: 'CHOCOLATE', hint: 'Sweet treat from cacao', category: 'Food' },
  { word: 'SPAGHETTI', hint: 'Long Italian noodle', category: 'Food' },
  { word: 'PINEAPPLE', hint: 'Tropical fruit with a crown', category: 'Food' },
  { word: 'MUSHROOM', hint: 'Fungi you can eat', category: 'Food' },
  { word: 'AVOCADO', hint: 'Green toast topping', category: 'Food' },
  { word: 'PANCAKE', hint: 'Flat breakfast treat', category: 'Food' },
  { word: 'BROCCOLI', hint: 'Tiny tree vegetable', category: 'Food' },
  { word: 'CINNAMON', hint: 'Warm baking spice', category: 'Food' },

  // ─── Technology ───
  { word: 'ALGORITHM', hint: 'Step-by-step instructions', category: 'Technology' },
  { word: 'BLUETOOTH', hint: 'Wireless connection named after a Viking', category: 'Technology' },
  { word: 'DATABASE', hint: 'Organized data storage', category: 'Technology' },
  { word: 'KEYBOARD', hint: 'You type on it', category: 'Technology' },
  { word: 'SOFTWARE', hint: 'Programs on your computer', category: 'Technology' },
  { word: 'INTERNET', hint: 'Global network of networks', category: 'Technology' },
  { word: 'SATELLITE', hint: 'Orbiting space transmitter', category: 'Technology' },
  { word: 'HOLOGRAM', hint: '3D light projection', category: 'Technology' },

  // ─── Places ───
  { word: 'AUSTRALIA', hint: 'Continent and country', category: 'Places' },
  { word: 'PYRAMIDS', hint: 'Ancient Egyptian wonders', category: 'Places' },
  { word: 'AMAZON', hint: 'Largest rainforest (or company)', category: 'Places' },
  { word: 'VOLCANO', hint: 'Mountain that erupts', category: 'Places' },
  { word: 'PARADISE', hint: 'A perfect place', category: 'Places' },
  { word: 'UNIVERSE', hint: 'Everything that exists', category: 'Places' },
];

const oddOneOut = [
  // ─── Categories ───
  { items: ['Mars', 'Venus', 'Pluto', 'Jupiter'], oddIndex: 2, explanation: 'Pluto is a dwarf planet, not a planet', category: 'Science' },
  { items: ['Python', 'Java', 'Cobra', 'JavaScript'], oddIndex: 2, explanation: 'Cobra is only a snake — the others are also programming languages', category: 'Technology' },
  { items: ['Titanic', 'Avatar', 'Mona Lisa', 'Inception'], oddIndex: 2, explanation: 'Mona Lisa is a painting, not a movie', category: 'Entertainment' },
  { items: ['Guitar', 'Piano', 'Violin', 'Paintbrush'], oddIndex: 3, explanation: 'Paintbrush is an art tool, not a musical instrument', category: 'Arts' },
  { items: ['Bitcoin', 'Ethereum', 'Dollar', 'Dogecoin'], oddIndex: 2, explanation: 'Dollar is fiat currency, not cryptocurrency', category: 'Finance' },
  { items: ['Oxygen', 'Helium', 'Water', 'Nitrogen'], oddIndex: 2, explanation: 'Water is a compound, not an element', category: 'Science' },
  { items: ['Einstein', 'Newton', 'Shakespeare', 'Hawking'], oddIndex: 2, explanation: 'Shakespeare was a playwright, not a scientist', category: 'People' },
  { items: ['Amazon', 'Nile', 'Sahara', 'Thames'], oddIndex: 2, explanation: 'Sahara is a desert, not a river', category: 'Geography' },
  { items: ['Heart', 'Club', 'Diamond', 'Crown'], oddIndex: 3, explanation: 'Crown is not a playing card suit', category: 'Games' },
  { items: ['Photoshop', 'Illustrator', 'Excel', 'InDesign'], oddIndex: 2, explanation: 'Excel is a spreadsheet app — the others are Adobe creative tools', category: 'Technology' },
  { items: ['Sushi', 'Ramen', 'Tacos', 'Tempura'], oddIndex: 2, explanation: 'Tacos are Mexican — the others are Japanese', category: 'Food' },
  { items: ['Mercury', 'Venus', 'Earth', 'Saturn'], oddIndex: 3, explanation: 'Saturn has rings — the others are inner/rocky planets', category: 'Science' },
  { items: ['WhatsApp', 'Telegram', 'Photoshop', 'Signal'], oddIndex: 2, explanation: 'Photoshop is design software — the others are messaging apps', category: 'Technology' },
  { items: ['Soccer', 'Basketball', 'Chess', 'Tennis'], oddIndex: 2, explanation: 'Chess is a board game, not a physical sport', category: 'Sports' },
  { items: ['Spotify', 'Netflix', 'YouTube', 'Wikipedia'], oddIndex: 3, explanation: 'Wikipedia is an encyclopedia — the others are streaming services', category: 'Technology' },
  { items: ['Rose', 'Tulip', 'Cactus', 'Daisy'], oddIndex: 2, explanation: 'Cactus is a succulent, not a flower', category: 'Nature' },
];

// ─── Guess the Year ───
const guessTheYear = [
  { event: 'The first email was sent', options: [1965, 1971, 1978, 1983], correct: 1, category: 'Technology' },
  { event: 'Netflix was founded', options: [1995, 1997, 2000, 2003], correct: 1, category: 'Technology' },
  { event: 'The Great Wall of China was completed', options: ['214 BC', '100 BC', 'AD 200', 'AD 600'], correct: 0, category: 'History' },
  { event: 'The first Olympics were held in ancient Greece', options: ['1200 BC', '776 BC', '500 BC', '200 BC'], correct: 1, category: 'History' },
  { event: 'Humans first landed on the Moon', options: [1965, 1967, 1969, 1972], correct: 2, category: 'Science' },
  { event: 'The Internet (ARPANET) was first used', options: [1962, 1969, 1975, 1981], correct: 1, category: 'Technology' },
  { event: 'The Eiffel Tower was completed', options: [1875, 1882, 1889, 1895], correct: 2, category: 'History' },
  { event: 'Penicillin was discovered', options: [1918, 1923, 1928, 1935], correct: 2, category: 'Science' },
  { event: 'Instagram was launched', options: [2008, 2010, 2012, 2014], correct: 1, category: 'Technology' },
  { event: 'The first Star Wars movie was released', options: [1975, 1977, 1979, 1981], correct: 1, category: 'Pop Culture' },
  { event: 'Amazon was founded by Jeff Bezos', options: [1992, 1994, 1996, 1998], correct: 1, category: 'Technology' },
  { event: 'The Mona Lisa was painted', options: ['1403', '1503', '1603', '1703'], correct: 1, category: 'History' },
  { event: 'DNA structure was first described', options: [1943, 1948, 1953, 1961], correct: 2, category: 'Science' },
  { event: 'The first Harry Potter book was published', options: [1995, 1997, 1999, 2001], correct: 1, category: 'Pop Culture' },
  { event: 'Tesla Motors was incorporated', options: [2001, 2003, 2005, 2007], correct: 1, category: 'Technology' },
  { event: 'The first Super Bowl was played', options: [1960, 1963, 1967, 1970], correct: 2, category: 'Sports' },
  { event: 'Wikipedia was launched', options: [1998, 2001, 2003, 2005], correct: 1, category: 'Technology' },
  { event: 'The first photograph was taken', options: [1796, 1826, 1856, 1880], correct: 1, category: 'Science' },
  { event: 'Michael Jackson released "Thriller"', options: [1980, 1982, 1984, 1986], correct: 1, category: 'Pop Culture' },
  { event: 'The Panama Canal was opened', options: [1904, 1910, 1914, 1920], correct: 2, category: 'History' },
  { event: 'Spotify was launched', options: [2006, 2008, 2010, 2012], correct: 1, category: 'Technology' },
  { event: 'The first World Cup (soccer) was held', options: [1926, 1930, 1934, 1938], correct: 1, category: 'Sports' },
  { event: 'The transistor was invented', options: [1937, 1942, 1947, 1953], correct: 2, category: 'Science' },
  { event: 'YouTube went live', options: [2003, 2005, 2007, 2009], correct: 1, category: 'Technology' },
];

// ─── True or False ───
const trueFalse = [
  { statement: 'Bananas are berries.', answer: true, explanation: 'Botanically, bananas qualify as berries.', category: 'Science' },
  { statement: 'The Great Wall of China is visible from space with the naked eye.', answer: false, explanation: 'It\'s too narrow to be seen from space without aid.', category: 'Geography' },
  { statement: 'Octopuses have three hearts.', answer: true, explanation: 'Two pump blood to the gills, one to the body.', category: 'Science' },
  { statement: 'Lightning never strikes the same place twice.', answer: false, explanation: 'Lightning frequently strikes the same spot — e.g., the Empire State Building gets hit ~25 times/year.', category: 'Science' },
  { statement: 'Honey never spoils.', answer: true, explanation: 'Archaeologists have found 3000-year-old honey still edible.', category: 'Science' },
  { statement: 'Venus is the hottest planet in our solar system.', answer: true, explanation: 'Despite Mercury being closer to the Sun, Venus\'s thick atmosphere traps more heat.', category: 'Science' },
  { statement: 'Goldfish have a 3-second memory.', answer: false, explanation: 'Goldfish can remember things for months.', category: 'Science' },
  { statement: 'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.', answer: true, explanation: 'Pyramids: ~2560 BC. Cleopatra: ~30 BC. Moon landing: 1969 AD.', category: 'History' },
  { statement: 'A group of flamingos is called a "flamboyance".', answer: true, explanation: 'A very fitting name for such colorful birds!', category: 'Science' },
  { statement: 'The human body has 4 lungs.', answer: false, explanation: 'Humans have 2 lungs.', category: 'Science' },
  { statement: 'Russia has 11 time zones.', answer: true, explanation: 'Russia spans the most time zones of any country.', category: 'Geography' },
  { statement: 'Sound travels faster in water than in air.', answer: true, explanation: 'Sound travels about 4x faster in water.', category: 'Science' },
  { statement: 'Thomas Edison invented the light bulb.', answer: false, explanation: 'Edison improved it, but Humphry Davy created the first electric light decades earlier.', category: 'History' },
  { statement: 'There are more stars in the universe than grains of sand on Earth.', answer: true, explanation: 'Estimated 70 sextillion stars vs ~7.5 sextillion sand grains.', category: 'Science' },
  { statement: 'Bats are blind.', answer: false, explanation: 'Most bats can see — some species even have excellent vision.', category: 'Science' },
  { statement: 'Your fingernails and toenails are made of the same protein as rhino horns.', answer: true, explanation: 'Both are made of keratin.', category: 'Science' },
  { statement: 'Mount Everest is the tallest mountain from base to peak.', answer: false, explanation: 'Mauna Kea in Hawaii is taller from base (ocean floor) to peak.', category: 'Geography' },
  { statement: 'Sharks are older than trees.', answer: true, explanation: 'Sharks: ~400 million years. Trees: ~350 million years.', category: 'Science' },
  { statement: 'The unicorn is the national animal of Scotland.', answer: true, explanation: 'Scotland\'s coat of arms features a unicorn.', category: 'Geography' },
  { statement: 'An ostrich\'s eye is bigger than its brain.', answer: true, explanation: 'Their eyes are about 2 inches across — larger than their brain.', category: 'Science' },
  { statement: 'The Sahara is the largest desert on Earth.', answer: false, explanation: 'Antarctica is technically the largest desert by definition.', category: 'Geography' },
  { statement: 'Peanuts are not technically nuts.', answer: true, explanation: 'Peanuts are legumes — they grow underground.', category: 'Science' },
  { statement: 'Napoleon was extremely short for his time.', answer: false, explanation: 'He was about 5\'7" — average for his era. The myth came from French vs English measurement differences.', category: 'History' },
  { statement: 'A day on Venus is longer than a year on Venus.', answer: true, explanation: 'Venus rotates very slowly — one rotation takes 243 Earth days, but orbits the Sun in 225 days.', category: 'Science' },
];

// ─── Missing Lyrics ───
const missingLyrics = [
  { lyric: "Is this the real life? Is this just _____?", answer: 'fantasy', song: 'Bohemian Rhapsody', artist: 'Queen', category: 'Rock' },
  { lyric: "We will, we will _____ you!", answer: 'rock', song: 'We Will Rock You', artist: 'Queen', category: 'Rock' },
  { lyric: "Hello from the other _____", answer: 'side', song: 'Hello', artist: 'Adele', category: 'Pop' },
  { lyric: "Just a small town girl, livin' in a _____ world", answer: 'lonely', song: "Don't Stop Believin'", artist: 'Journey', category: 'Rock' },
  { lyric: "I got my mind on my _____ and my _____ on my mind", answer: 'money', song: 'Gin and Juice', artist: 'Snoop Dogg', category: 'Hip Hop' },
  { lyric: "Let it go, let it go, can't _____ it back anymore", answer: 'hold', song: 'Let It Go', artist: 'Frozen', category: 'Soundtrack' },
  { lyric: "I will always _____ you", answer: 'love', song: 'I Will Always Love You', artist: 'Whitney Houston', category: 'Pop' },
  { lyric: "Cause baby, you're a _____", answer: 'firework', song: 'Firework', artist: 'Katy Perry', category: 'Pop' },
  { lyric: "We're no strangers to _____", answer: 'love', song: 'Never Gonna Give You Up', artist: 'Rick Astley', category: 'Pop' },
  { lyric: "Yesterday, all my troubles seemed so far _____", answer: 'away', song: 'Yesterday', artist: 'The Beatles', category: 'Rock' },
  { lyric: "I'm on the _____ of glory", answer: 'edge', song: 'The Edge of Glory', artist: 'Lady Gaga', category: 'Pop' },
  { lyric: "Every breath you take, every _____ you make", answer: 'move', song: 'Every Breath You Take', artist: 'The Police', category: 'Rock' },
  { lyric: "We found _____ in a hopeless place", answer: 'love', song: 'We Found Love', artist: 'Rihanna', category: 'Pop' },
  { lyric: "Somebody once told me the world is gonna _____ me", answer: 'roll', song: 'All Star', artist: 'Smash Mouth', category: 'Pop' },
  { lyric: "I came in like a wrecking _____", answer: 'ball', song: 'Wrecking Ball', artist: 'Miley Cyrus', category: 'Pop' },
  { lyric: "Don't stop me now, I'm having such a good _____", answer: 'time', song: "Don't Stop Me Now", artist: 'Queen', category: 'Rock' },
  { lyric: "You may say I'm a _____, but I'm not the only one", answer: 'dreamer', song: 'Imagine', artist: 'John Lennon', category: 'Rock' },
  { lyric: "I wanna dance with somebody, with somebody who _____ me", answer: 'loves', song: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', category: 'Pop' },
  { lyric: "Sweet _____, bah bah bah, good times never seemed so good", answer: 'Caroline', song: 'Sweet Caroline', artist: 'Neil Diamond', category: 'Pop' },
  { lyric: "All you need is _____", answer: 'love', song: 'All You Need Is Love', artist: 'The Beatles', category: 'Rock' },
];

// ─── Spot the Fake ───
const spotTheFake = [
  { facts: ['Cows have best friends', 'Butterflies taste with their feet', 'Dolphins sleep with one eye open', 'Elephants can jump 3 feet high'], fakeIndex: 3, explanation: 'Elephants are the only mammals that can\'t jump at all.', category: 'Animals' },
  { facts: ['Scotland\'s national animal is a unicorn', 'Oxford University is older than the Aztec Empire', 'A jiffy is an actual unit of time', 'The first computer was built in ancient Rome'], fakeIndex: 3, explanation: 'There were no computers in ancient Rome.', category: 'History' },
  { facts: ['Honey never expires', 'Bananas are radioactive', 'Carrots were originally purple', 'Eating chocolate was once punishable by death'], fakeIndex: 3, explanation: 'Chocolate was never punishable by death.', category: 'Food' },
  { facts: ['Venus spins backwards', 'You can hear the Big Bang\'s echo on old TVs', 'The Sun is a green star', 'Mars has blue sunsets'], fakeIndex: 2, explanation: 'The Sun is classified as a yellow dwarf, not green.', category: 'Space' },
  { facts: ['Octopuses have blue blood', 'Koalas have fingerprints like humans', 'Sloths can hold their breath longer than dolphins', 'Cats can rotate their ears 360 degrees'], fakeIndex: 3, explanation: 'Cats can rotate their ears ~180 degrees, not 360.', category: 'Animals' },
  { facts: ['The shortest war lasted 38 minutes', 'France was still executing people by guillotine when Star Wars came out', 'Cleopatra lived closer to the iPhone than the pyramids', 'The Roman Empire once used salt as currency'], fakeIndex: 2, explanation: 'Cleopatra was closer to the pyramids — but she was closer to the Moon landing than the pyramids\' construction!', category: 'History' },
  { facts: ['There are more trees on Earth than stars in the Milky Way', 'Hot water freezes faster than cold water', 'Glass is a slow-moving liquid', 'A teaspoon of a neutron star weighs about 6 billion tons'], fakeIndex: 2, explanation: 'Glass is an amorphous solid, not a liquid.', category: 'Science' },
  { facts: ['LEGO is the world\'s largest tire manufacturer', 'Nintendo was founded in 1889', 'The first website is still online', 'Google was originally called "Backflip"'], fakeIndex: 3, explanation: 'Google was originally called "Backrub", not "Backflip".', category: 'Technology' },
  { facts: ['Antarctica has an active volcano', 'Russia has a larger surface area than Pluto', 'There is a town called "Boring" in Oregon', 'Australia is wider than the Moon'], fakeIndex: 0, explanation: 'Wait — actually Antarctica DOES have an active volcano (Mount Erebus). All are true! Just kidding: all 4 are actually true facts. The fake was a trick — let me fix...', category: 'Geography' },
  { facts: ['Sharks existed before trees', 'A bolt of lightning is 5x hotter than the Sun\'s surface', 'Sound travels faster in cold air than warm air', 'Babies have about 100 more bones than adults'], fakeIndex: 2, explanation: 'Sound actually travels FASTER in warm air, not cold.', category: 'Science' },
  { facts: ['Alaska is the most eastern and western US state', 'More people live in Tokyo than in all of Canada', 'The longest place name in the world is in Wales', 'The Dead Sea is actually a lake'], fakeIndex: 1, explanation: 'Tokyo metro (~37M) is less than Canada\'s population (~40M).', category: 'Geography' },
  { facts: ['Humans share 60% DNA with bananas', 'Your nose can remember 50,000 scents', 'Your skeleton completely renews every 2 years', 'The human brain uses about 20% of body\'s energy'], fakeIndex: 2, explanation: 'Your skeleton renews roughly every 10 years, not 2.', category: 'Science' },
  { facts: ['A group of crows is called a "murder"', 'Flamingos are born white', 'Wombat poop is cube-shaped', 'Penguins can fly short distances during mating season'], fakeIndex: 3, explanation: 'Penguins cannot fly at all.', category: 'Animals' },
  { facts: ['PlayStation was originally a Nintendo product', 'The first mobile phone call was made in 1973', 'Wi-Fi stands for "Wireless Fidelity"', 'The spacebar is the most used key on a keyboard'], fakeIndex: 2, explanation: 'Wi-Fi doesn\'t stand for anything — it\'s a brand name.', category: 'Technology' },
  { facts: ['Oxford is older than the Aztec Empire', 'Ancient Egyptians used stone pillows', 'Vikings wore horned helmets in battle', 'Genghis Khan created the first postal system'], fakeIndex: 2, explanation: 'Viking helmets were hornless — the horned look was a 19th-century artistic invention.', category: 'History' },
  { facts: ['The Moon has moonquakes', 'Saturn could float in water', 'There are more volcanoes on Venus than Earth', 'Jupiter\'s Great Red Spot is shrinking'], fakeIndex: 1, explanation: 'While Saturn is less dense than water, it couldn\'t literally float — it would break apart. But the fact is usually stated as true! The actual fake here: all 4 are commonly cited as true.', category: 'Space' },
];

// Fix spotTheFake[8] — all were true
spotTheFake[8] = { facts: ['Sharks existed before Saturn had rings', 'Russia has a larger surface area than Pluto', 'There is a city called "Batman" in Turkey', 'Lake Superior contains enough water to flood all of South America'], fakeIndex: 3, explanation: 'Lake Superior is large but nowhere near enough to flood a continent.', category: 'Geography' };
// Fix spotTheFake[15] — ambiguous
spotTheFake[15] = { facts: ['A day on Venus is longer than its year', 'Neptune has the fastest winds in the solar system', 'The Sun makes up 99.86% of the solar system\'s mass', 'Mars has more moons than Earth has oceans'], fakeIndex: 3, explanation: 'Mars has 2 moons but Earth has 5 oceans — 2 is not more than 5.', category: 'Space' };

// ─── Speed Math (generated dynamically in game-engine) ───
// No static bank needed — engine generates arithmetic on the fly

// Pick N random items from array
function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

module.exports = {
  triviaQuestions,
  emojiPuzzles,
  humanOrAiQuotes,
  wordScrambles,
  oddOneOut,
  guessTheYear,
  trueFalse,
  missingLyrics,
  spotTheFake,
  shuffle,
  pickRandom,
};
