const { app, BrowserWindow, session, ipcMain, net } = require('electron')
const crypto = require('crypto')
const MC = require('./main-constants')

let mainWindow = null
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) { app.quit() }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: MC.WINDOW_DEFAULTS.width, height: MC.WINDOW_DEFAULTS.height, minWidth: MC.WINDOW_DEFAULTS.minWidth, minHeight: MC.WINDOW_DEFAULTS.minHeight,
    title: 'WAVE — Your Music',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })
  mainWindow.loadFile('wave-music-app.html')
  mainWindow.setMenuBarVisibility(false)

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details.url.includes('spotify.com')) {
      return callback({ requestHeaders: details.requestHeaders })
    }
    const url = details.url
    if (MC.JIOSAAVN_DOMAINS.some(d => url.includes(d))) {
      details.requestHeaders['Referer'] = 'https://www.jiosaavn.com/'
      details.requestHeaders['Origin'] = 'https://www.jiosaavn.com'
    }
    details.requestHeaders['User-Agent'] = MC.CHROME_USER_AGENT
    callback({ requestHeaders: details.requestHeaders })
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.includes('spotify.com')) {
      return callback({ responseHeaders: details.responseHeaders })
    }
    const headers = { ...details.responseHeaders }
    headers['access-control-allow-origin'] = ['*']
    headers['access-control-allow-methods'] = ['GET, POST, OPTIONS']
    delete headers['x-frame-options']
    delete headers['X-Frame-Options']
    delete headers['content-security-policy']
    delete headers['Content-Security-Policy']
    callback({ responseHeaders: headers })
  })
}

app.whenReady().then(() => {
  createWindow()

  // fetch-url via net module
  ipcMain.handle('fetch-url', async (_, { url, headers = {} }) => {
    return new Promise((resolve) => {
      const req = net.request({ url, method: 'GET', session: session.defaultSession })
      req.setHeader('User-Agent', MC.CHROME_USER_AGENT)
      req.setHeader('Accept', headers['Accept'] || 'text/html,application/json,*/*')
      req.setHeader('Accept-Language', 'en-US,en;q=0.9')
      req.setHeader('Referer', 'https://open.spotify.com/')
      for (const [k, v] of Object.entries(headers)) {
        try { req.setHeader(k, v) } catch (e) {}
      }
      let body = ''
      req.on('response', (res) => {
        res.on('data', c => body += c.toString())
        res.on('end', () => resolve({ text: body, status: res.statusCode }))
        res.on('error', e => resolve({ error: e.message, text: '' }))
      })
      req.on('error', e => resolve({ error: e.message, text: '' }))
      req.end()
    })
  })

  // Persistent Spotify session - login once, works forever
  let savedSpotifyToken = null
  let savedTokenExpiry = 0

  // ── SPOTIFY: No login needed! Uses anonymous token + partner API for unlimited tracks ──
  // We get a fresh anonymous token from open.spotify.com on every import
  // This is the same method webtune.me / spotify-to-mp3 sites use

  const getAnonymousSpotifyToken = () => new Promise((resolve) => {
    const https = require('https')
    const req = https.get(MC.ANONYMOUS_TOKEN_URL, {
      headers: {
        'User-Agent': MC.CHROME_USER_AGENT,
        'Accept': 'application/json',
        'Referer': 'https://open.spotify.com/'
      }
    }, (res) => {
      let body = ''
      res.on('data', d => body += d.toString())
      res.on('end', () => {
        try {
          const j = JSON.parse(body)
          resolve(j.accessToken || null)
        } catch(e) { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
  })

  // Official Spotify OAuth 2.0 Credentials
  const SPOTIFY_CLIENT_ID = MC.SPOTIFY_CLIENT_ID
  const SPOTIFY_REDIRECT_URI = MC.SPOTIFY_REDIRECT_URI

  // Open Spotify OAuth login window
  ipcMain.handle('spotify-login-window', async () => {
    return new Promise((resolve) => {
      let resolved = false
      const loginWin = new BrowserWindow({
        width: 460, height: 720,
        parent: mainWindow,
        modal: true,
        title: 'Log in to Spotify',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      })
      loginWin.setMenuBarVisibility(false)
      
      // Generate PKCE code verifier and challenge
      const codeVerifier = crypto.randomBytes(64).toString('hex').substring(0, 128);
      const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

      const scopes = encodeURIComponent('playlist-read-private playlist-read-collaborative user-read-private user-read-email')
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${scopes}&code_challenge_method=S256&code_challenge=${codeChallenge}&show_dialog=true`
      
      loginWin.loadURL(authUrl)

      // Listen for the redirect to our local callback
      const handleNavigation = (url) => {
        if (resolved) return
        if (url.startsWith(SPOTIFY_REDIRECT_URI)) {
          const urlObj = new URL(url)
          const code = urlObj.searchParams.get('code')
          
          if (code) {
            resolved = true
            // Exchange code for token using native Node.js fetch
            // Exchange code for token using pure Node.js https module
            const postData = new URLSearchParams({
              client_id: SPOTIFY_CLIENT_ID,
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: SPOTIFY_REDIRECT_URI,
              code_verifier: codeVerifier
            }).toString()

            const https = require('https')
            const tokenReq = https.request('https://accounts.spotify.com/api/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
              }
            }, (res) => {
              let body = ''
              res.on('data', chunk => body += chunk.toString())
              res.on('end', () => {
                try {
                  const data = JSON.parse(body)
                  if (data.access_token) {
                    savedSpotifyToken = data.access_token
                    savedTokenExpiry = Date.now() + (data.expires_in * 1000)
                    console.log('[WAVE] Spotify PKCE OAuth successful, got token')
                    resolve({ success: true, hasToken: true, email: 'Spotify User' })
                  } else {
                    resolve({ success: false, hasToken: false })
                  }
                } catch(e) { resolve({ success: false, hasToken: false }) }
                try { loginWin.close() } catch(e) {}
              })
            })
            tokenReq.on('error', () => {
              resolve({ success: false, hasToken: false })
              try { loginWin.close() } catch(e) {}
            })
            tokenReq.write(postData)
            tokenReq.end()
          } else {
            resolved = true
            resolve({ success: false, hasToken: false })
            try { loginWin.close() } catch(e) {}
          }
        }
      }

      loginWin.webContents.on('will-redirect', (event, url) => {
        handleNavigation(url)
      })
      
      loginWin.webContents.on('did-navigate', (event, url) => {
        handleNavigation(url)
      })

      loginWin.on('closed', () => {
        if (!resolved) {
          resolved = true
          // Fallback to anonymous token if they cancel login
          getAnonymousSpotifyToken().then(token => {
            if (token) {
              savedSpotifyToken = token
              savedTokenExpiry = Date.now() + MC.TOKEN_EXPIRY_MS
            }
            resolve({ success: !!token, hasToken: !!token, email: token ? 'Spotify User' : '' })
          }).catch(() => {
            resolve({ success: false, hasToken: false })
          })
        }
      })
    })
  })
  ipcMain.handle('get-spotify-token', async () => {
    if (savedSpotifyToken && Date.now() < savedTokenExpiry) return savedSpotifyToken
    // Fetch a fresh anonymous token instead of returning null
    savedSpotifyToken = await getAnonymousSpotifyToken()
    if (savedSpotifyToken) {
      savedTokenExpiry = Date.now() + MC.TOKEN_EXPIRY_MS
      console.log('[WAVE] get-spotify-token: fetched fresh anonymous token')
    }
    return savedSpotifyToken || null
  })
  ipcMain.handle('spotify-disconnect', async () => {
    savedSpotifyToken = null; savedTokenExpiry = 0
    // Clear Spotify cookies so next login starts fresh
    try {
      await session.defaultSession.clearStorageData({ origin: 'https://open.spotify.com' })
      await session.defaultSession.clearStorageData({ origin: 'https://accounts.spotify.com' })
    } catch(e) {}
    return { success: true }
  })

  // ── MAIN: Fetch ALL playlist tracks with no login required ──
  ipcMain.handle('fetch-spotify-playlist', async (_, { playlistId }) => {

    // Step 1: Get a fresh anonymous token (works for all public playlists, no account needed)
    if (!savedSpotifyToken || Date.now() >= savedTokenExpiry) {
      savedSpotifyToken = await getAnonymousSpotifyToken()
      savedTokenExpiry = Date.now() + MC.TOKEN_EXPIRY_MS
      console.log('[WAVE] Got anonymous Spotify token:', !!savedSpotifyToken)
    }
    const token = savedSpotifyToken
    if (!token) return { tracks: [], error: 'Could not get Spotify token' }

    // Helper: one HTTP request via pure Node.js https module to avoid Chromium interceptors
    const https = require('https')
    const netGet = (url, headers = {}) => new Promise((resolve) => {
      const mergedHeaders = {
        'User-Agent': MC.CHROME_USER_AGENT,
        'Accept': 'application/json',
        ...headers
      }
      https.get(url, { headers: mergedHeaders }, (res) => {
        let body = ''
        res.on('data', d => body += d.toString())
        res.on('end', () => resolve(body))
      }).on('error', () => resolve(''))
    })

    try {
      // Step 2: Get playlist name + total track count
      const metaBody = await netGet(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,tracks.total`,
        { Authorization: 'Bearer ' + token }
      )
      let meta;
      try {
        meta = JSON.parse(metaBody)
      } catch (e) {
        console.log('[WAVE] CRITICAL API ERROR! Raw response body:')
        console.log(metaBody)
        return { tracks: [], error: `JSON Parse error: ${e.message}. Raw body: ${metaBody.substring(0, 100)}` }
      }
      if (meta.error) {
        console.log('[WAVE] API error:', meta.error.message)
        return { tracks: [], error: meta.error.message }
      }
      const plName = meta.name || 'Playlist'
      const total = meta.tracks?.total || 0
      console.log(`[WAVE] "${plName}" has ${total} tracks`)

      // Step 3: Fetch all pages in parallel (100 tracks per page)
      const offsets = []
      for (let i = 0; i < total; i += 100) offsets.push(i)

      const pages = await Promise.all(offsets.map(async (offset) => {
        const body = await netGet(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=${offset}&market=IN`,
          { Authorization: 'Bearer ' + token }
        )
        try {
          const d = JSON.parse(body)
          if (!d.items) return []
          return d.items
            .filter(i => i && i.track && i.track.name)
            .map(i => ({
              title: i.track.name,
              artist: (i.track.artists || []).map(a => a.name).join(', ')
            }))
        } catch(e) { return [] }
      }))

      const allTracks = pages.flat()
      console.log(`[WAVE] Imported ${allTracks.length} / ${total} tracks`)
      return { tracks: allTracks, name: plName, total }

    } catch(e) {
      console.log('[WAVE] Error:', e.message)
      return { tracks: [], error: e.message }
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})