const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Proxy endpoint to bypass CORS for JioSaavn APIs
app.use('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('No URL provided');
  
  try {
    // Dynamic import of node-fetch (works in commonjs for node-fetch@3 or global fetch in Node 18+)
    const fetchToUse = typeof fetch !== 'undefined' ? fetch : (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;
    delete headers.referer;
    
    // JioSaavn requires these headers to not block requests
    if (targetUrl.includes('jiosaavn.com')) {
      headers['Referer'] = 'https://www.jiosaavn.com/';
      headers['Origin'] = 'https://www.jiosaavn.com';
      headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    }

    const response = await fetchToUse(targetUrl, { 
      headers, 
      method: req.method 
    });
    
    const buffer = await response.arrayBuffer();
    
    // Copy content-type header
    if (response.headers.get('content-type')) {
      res.setHeader('Content-Type', response.headers.get('content-type'));
    }
    
    res.status(response.status).send(Buffer.from(buffer));
  } catch (e) {
    console.error('Proxy error:', e.message);
    res.status(500).send(e.message);
  }
});

// Serve the main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'wave-music-app.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 WAVE Web App is running!`);
  console.log(`👉 Open your browser to: http://localhost:${port}`);
  console.log(`=========================================\n`);
});
