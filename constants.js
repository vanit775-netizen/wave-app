// ═══════════════════════════════════════════════════════════
// WAVE — Renderer-side constants
// Loaded via <script src="constants.js"></script> BEFORE the
// main inline <script> in wave-music-app.html.
// ═══════════════════════════════════════════════════════════

window.WAVE_CONFIG = {

  // ── Server ──
  WAVE_SERVER: 'https://wave-server-ezxc.onrender.com',
  WAVE_WS_URL: 'wss://wave-server-ezxc.onrender.com',

  // ── JioSaavn API ──
  JIOSAAVN_API_BASE: 'https://www.jiosaavn.com/api.php',
  JIOSAAVN_FORMAT: '_format=json&_marker=0',
  JIOSAAVN_API_VERSION: '4',
  JIOSAAVN_CTX: 'web6dot0',
  JIOSAAVN_DEFAULT_PAGE_SIZE: 20,

  // ── Spotify (renderer-side URLs) ──
  SPOTIFY_EMBED_BASE: 'https://open.spotify.com/embed/playlist/',

  // ── IndexedDB ──
  INDEXEDDB_PREFIX: 'WaveApp_',
  INDEXEDDB_FALLBACK: 'WaveApp5',

  // ── Defaults ──
  DEFAULT_VOLUME: 0.8,
  SAVE_DEBOUNCE_MS: 600,
  TOAST_DURATION_MS: 2500,
  KEYBOARD_SEEK_STEP: 5,

  // ── UI Data ──
  EMOJIS: ['🎵', '🎶', '🎸', '🎹', '🥁', '🎺', '🎷', '🪗', '🎻', '🪘'],
  SUPPORT_EMAIL: 'wavemusicappsupport@gmail.com',

  // ── Classification: Artist Lists ──
  HINDI_ARTISTS: [
    'arijit singh', 'shreya ghoshal', 'kishore kumar', 'lata mangeshkar',
    'mohammed rafi', 'kumar sanu', 'udit narayan', 'sonu nigam', 'neha kakkar',
    'atif aslam', 'jubin nautiyal', 'darshan raval', 'b praak', 'vishal mishra',
    'sachin-jigar', 'pritam', 'a.r. rahman', 'ar rahman', 'amit trivedi',
    'shankar mahadevan', 'armaan malik', 'badshah', 'yo yo honey singh',
    'honey singh', 'raftaar', 'divine', 'mc stan', 'king', 'anuv jain',
    'talwiinder', 'ap dhillon', 'diljit dosanjh', 'guru randhawa',
    'harrdy sandhu', 'jasleen royal', 'mohit chauhan', 'kk', 'mika singh',
    'sunidhi chauhan', 'alka yagnik', 'asha bhosle', 'rahat fateh ali khan',
    'stebin ben', 'sachet tandon', 'tulsi kumar', 'palak muchhal',
    'monali thakur', 'ash king', 'ankit tiwari', 'shaan', 'javed ali', 'papon',
    'sukhwinder singh', 'abhijeet', 'hemant kumar', 'mukesh', 'talat mahmood',
    'manna dey', 'geeta dutt', 'shamshad begum', 'nusrat fateh ali khan',
    'ghulam ali'
  ],

  ENGLISH_ARTISTS: [
    'taylor swift', 'ed sheeran', 'drake', 'the weeknd', 'billie eilish',
    'dua lipa', 'ariana grande', 'post malone', 'justin bieber', 'harry styles',
    'olivia rodrigo', 'bad bunny', 'beyonce', 'adele', 'rihanna', 'bruno mars',
    'eminem', 'kanye west', 'lady gaga', 'katy perry', 'maroon 5',
    'imagine dragons', 'coldplay', 'bts', 'blackpink', 'travis scott',
    'kendrick lamar', 'sza', 'doja cat', 'lil nas x', 'charlie puth',
    'shawn mendes', 'sam smith', 'lizzo', 'miley cyrus', 'selena gomez',
    'halsey', 'lana del rey', 'the chainsmokers', 'marshmello', 'alan walker',
    'avicii', 'martin garrix', 'david guetta', 'calvin harris', 'sia',
    'ellie goulding', 'cardi b', 'megan thee stallion', '21 savage', 'j cole',
    'tyler the creator', 'frank ocean', 'arctic monkeys', 'radiohead', 'nirvana',
    'queen', 'michael jackson', 'elvis presley', 'the beatles', 'pink floyd',
    'led zeppelin', 'bob marley', 'whitney houston', 'mariah carey',
    'celine dion', 'elton john', 'freddie mercury', 'sabrina carpenter',
    'gracie abrams', 'tyla', 'chappell roan', 'benson boone', 'teddy swims',
    'hozier', 'tate mcrae', 'jack harlow'
  ],

  PUNJABI_ARTISTS: [
    'ap dhillon', 'diljit dosanjh', 'guru randhawa', 'harrdy sandhu',
    'sidhu moose wala', 'karan aujla', 'ammy virk', 'jassie gill',
    'parmish verma', 'garry sandhu', 'jazzy b', 'gurdas maan', 'babbu maan',
    'b praak', 'jaani', 'mankirt aulakh', 'jass manak', 'r nait', 'amrit maan',
    'sharry mann', 'ranjit bawa', 'ninja', 'singga', 'bohemia'
  ],

  CLASSIC_ERA_ARTISTS: [
    'kishore kumar', 'lata mangeshkar', 'mohammed rafi', 'asha bhosle',
    'mukesh', 'hemant kumar', 'talat mahmood', 'manna dey', 'geeta dutt',
    'shamshad begum', 'nusrat fateh ali khan', 'ghulam ali', 'elvis presley',
    'the beatles', 'pink floyd', 'led zeppelin', 'bob marley', 'queen',
    'freddie mercury', 'michael jackson'
  ],

  OLD_ERA_ARTISTS: [
    'kumar sanu', 'udit narayan', 'alka yagnik', 'sonu nigam', 'kk', 'shaan',
    'abhijeet', 'lucky ali', 'shankar mahadevan', 'a.r. rahman', 'ar rahman',
    'jagjit singh', 'whitney houston', 'mariah carey', 'celine dion',
    'elton john', 'nirvana', 'radiohead', 'backstreet boys', 'spice girls'
  ],

  MODERN_ERA_ARTISTS: [
    'arijit singh', 'shreya ghoshal', 'neha kakkar', 'atif aslam',
    'mohit chauhan', 'pritam', 'amit trivedi', 'badshah', 'yo yo honey singh',
    'honey singh', 'mika singh', 'sunidhi chauhan', 'taylor swift', 'ed sheeran',
    'adele', 'rihanna', 'bruno mars', 'eminem', 'kanye west', 'lady gaga',
    'katy perry', 'coldplay', 'imagine dragons', 'maroon 5', 'justin bieber',
    'ariana grande', 'dua lipa', 'sam smith', 'shawn mendes', 'charlie puth',
    'sia', 'ellie goulding', 'the chainsmokers', 'avicii', 'david guetta',
    'calvin harris', 'alan walker', 'marshmello', 'drake', 'post malone'
  ],

  LATEST_ERA_ARTISTS: [
    'jubin nautiyal', 'darshan raval', 'b praak', 'vishal mishra',
    'sachin-jigar', 'king', 'anuv jain', 'talwiinder', 'ap dhillon', 'mc stan',
    'divine', 'raftaar', 'stebin ben', 'sachet tandon', 'jasleen royal',
    'the weeknd', 'billie eilish', 'olivia rodrigo', 'doja cat', 'sza',
    'lil nas x', 'harry styles', 'bad bunny', 'bts', 'blackpink',
    'travis scott', 'kendrick lamar', 'jack harlow', 'sabrina carpenter',
    'gracie abrams', 'tyla', 'chappell roan', 'benson boone', 'teddy swims',
    'hozier', 'tate mcrae', 'diljit dosanjh', 'karan aujla',
    'sidhu moose wala', 'jass manak'
  ],

  // ── Classification: Keyword Lists ──
  HINDI_KEYWORDS: [
    'ishq', 'dil', 'pyar', 'tum', 'meri', 'tera', 'sanam', 'channa', 'sajni',
    'rang', 'naina', 'baarish', 'raabta', 'humsafar', 'meherbaan', 'sun',
    'raha', 'hai', 'tu', 'jaana', 'pehla', 'phir', 'kabhi', 'zara', 'judaa',
    'dard', 'jiya', 'jeena', 'duniya', 'sapna', 'kahani', 'deewana', 'pagal',
    'piya', 'sajan'
  ],

  PUNJABI_KEYWORDS: [
    'vibe', 'jatt', 'gabru', 'laung', 'gawacha', 'kudi', 'nakhra', 'bhangra',
    'patiala', 'mundiya', 'tere', 'naal', 'yaar', 'billo'
  ],
};
