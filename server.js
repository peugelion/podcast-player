const express = require('express');
// const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const CryptoJS = require('crypto-js');
const fetch = require('node-fetch');

dotenv.config();

const PORT = process.env.PORT || 3000;
const authKey = process.env.AUTH_KEY;
const secretKey = process.env.SECRET_KEY;
const userAgent = process.env.USER_AGENT;
const apiEndpoint = process.env.API_ENDPOINT;

const app = express();

// server static resources
app.use(express.static(path.join(__dirname, 'public')));

// shared authentication function
function generateSharedHeaders() {
  const apiHeaderTime = Math.floor(new Date().getTime() / 1000);
  const hash = CryptoJS.SHA1(authKey + secretKey + apiHeaderTime).toString(CryptoJS.enc.Hex);

  return {
    'User-Agent': userAgent,
    'X-Auth-Key': authKey,
    'X-Auth-Date': apiHeaderTime.toString(),
    'Authorization': hash
  }
}

// search for podcasts
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if(!query)return res.status(400).json({ error: 'Query Parameter is required' });

  const headers = generateSharedHeaders();
  try {
    const response = await fetch(`${apiEndpoint}/search/byterm?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: headers
    });
    
    if(response.ok && response.headers.get('content-type').includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const rawText = await response.text();
      console.log('Raw response: ', rawText);
      res.status(500).json({ error: 'Invalid response from API', rawText});
    }
  } catch (error) {
    console.error('Error fetvching API: ', error.message);
    res.status(500).json({ error: error.message });
  }
})

// search for podcast episodes
app.get('/api/episodes', async (req, res) => {
  const feedId = req.query.feedId;
  const max = req.query.max;

  if(!feedId) return res.status(400).json({ error: 'Feed ID Parameter is required' });

  const headers = generateSharedHeaders();
  try {
    const response = await fetch(`${apiEndpoint}/episodes/byitunesid?id=${encodeURIComponent(feedId)}&max=${max}`, {
      method: 'GET',
      headers: headers
    });
    
    if(response.ok && response.headers.get('content-type').includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const rawText = await response.text();
      console.log('Raw response: ', rawText);
      res.status(500).json({ error: 'Invalid response from API', rawText});
    }
  } catch (error) {
    console.error('Error fetvching API: ', error.message);
    res.status(500).json({ error: error.message });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT} pointing to ${apiEndpoint}`);
})