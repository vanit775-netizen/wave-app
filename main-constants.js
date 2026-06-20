// ═══════════════════════════════════════════════════════════
// WAVE — Main-process constants (Node / Electron main)
// Required via: const MC = require('./main-constants')
// ═══════════════════════════════════════════════════════════

module.exports = {
  // ── Spotify OAuth ──
  SPOTIFY_CLIENT_ID: '75cecbf531b245a58c23e0a9ca877bc3',
  SPOTIFY_REDIRECT_URI: 'https://example.com/callback',

  // ── Shared User-Agent (used in 3+ places) ──
  CHROME_USER_AGENT:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',

  // ── JioSaavn domain matching ──
  JIOSAAVN_DOMAINS: ['jiosaavn', 'saavncdn', 'saavn'],

  // ── Anonymous Spotify token ──
  ANONYMOUS_TOKEN_URL:
    'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
  TOKEN_EXPIRY_MS: 45 * 60 * 1000, // 45 minutes

  // ── BrowserWindow defaults ──
  WINDOW_DEFAULTS: {
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
  },
};
