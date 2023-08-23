// reqs
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// sundries
const PORT = 8000;

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Setup the morgan middleware to use the combined log format and write to the accessLogStream
app.use(morgan('combined', { stream: accessLogStream }));

// Proxies all requests that start with /trees to the Flask server
app.use('/trees', createProxyMiddleware({ target: 'http://127.0.0.1:5000', changeOrigin: true }));

app.use('/singletree', createProxyMiddleware({ target: 'http://127.0.0.1:5000', changeOrigin: true }));

// launch app
app.listen(PORT, () => {
  console.log('Node.js proxy server is running on http://localhost:8000');
});
