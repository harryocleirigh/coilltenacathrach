// reqs
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');

const NodeCache = require('node-cache');
const cache = new NodeCache();

const app = express();

// sundries
const PORT = 8000;

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Define a custom log format
morgan.format('custom', ':remote-addr - - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"');

// Setup morgan to use the combined log format and write to the accessLogStream.
app.use(morgan('custom', {
  stream: {
    write: (message) => {
      accessLogStream.write(message);
    }
  }
}));

// Proxies all requests that start with /trees to the Flask server
app.use(compression());

// Middleware for caching
function cacheMiddleware(duration) {

  return (req, res, next) => {
    
      const key = req.originalUrl || req.url;
      const cachedResponse = cache.get(key);

      if (cachedResponse) {
          // Set CORS headers for cached responses
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          console.log('Cache HIT for', key);
          res.send(cachedResponse);
          return; // Don't continue to next middleware if cache hit
      } else {
          console.log('Cache MISS for', key);
      }

      next(); // Continue to next middleware
  };
}

// debugger to see active cache
app.get('/debug/cache', (req, res) => {
  const keys = cache.keys();
  let cacheContents = {};

  keys.forEach(key => {
      cacheContents[key] = cache.get(key);
  });

  res.json({
      keys,
      cacheContents,
      stats: cache.getStats()
  });
});

// middleware proxies
app.use('/trees', cacheMiddleware(3600));
app.use('/trees', createProxyMiddleware({ 

    target: 'http://34.254.173.244:5000',
    changeOrigin: true,
    selfHandleResponse: true, // Add this line to handle the response ourselves
    onProxyRes: (proxyRes, req, res) => {

      let bodyChunks = [];

      proxyRes.on('data', chunk => {
          bodyChunks.push(chunk);
      }); 
  
      proxyRes.on('end', () => {

          const body = Buffer.concat(bodyChunks).toString();

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');    
  
          console.log(`Response from Flask for ${req.url}:`, proxyRes.statusCode);
  
          if (proxyRes.statusCode === 200 && proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('application/json')) {
              const key = req.originalUrl || req.url;
              cache.set(key, body, 36000);
              console.log('Cached data for', key);
          }
  
          // Copy the headers from the Flask response to the Node response
          Object.keys(proxyRes.headers).forEach(function (key) {
              res.setHeader(key, proxyRes.headers[key]);
          });
  
          // Set the status code from the Flask response
          res.status(proxyRes.statusCode);
  
          // End the response with the body
          res.end(body);
      });
  }  
}));

app.use('/singletree', createProxyMiddleware({ target: 'http://34.254.173.244:5000', changeOrigin: true }));

// launch app
app.listen(PORT, () => {
  console.log('Node.js proxy server is running on http://localhost:8000');
});