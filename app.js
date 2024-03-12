import http from 'http';
import fs from 'fs';
import express from 'express';
import { logger } from './middlewares/logger.js';

const app = express();

app.use(express.static('public'))
app.use(logger);

const hostname = '127.0.0.1';
const port = 3000;
app.get('/', (req, res) => {
  fs.readFile('./views/index.html', (err, data) => {
    if (err) {
      console.log(err);
      res.statusCode = 404;
      res.end();
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(data);
    }
  });
});

app.get('/about', (req, res) => {
  fs.readFile('./views/about.html', (err, data) => {
    if (err) {
      console.log(err);
      res.statusCode = 404;
      res.end();
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(data);
    }
  });
});

app.get('/contact', (req, res) => {
  fs.readFile('./views/contact.html', (err, data) => {
    if (err) {
      console.log(err);
      res.statusCode = 404;
      res.end();
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(data);
    }
  });
});


app.use((req, res) => {
  res.statusCode = 404;
  res.end('404 Not Found');
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
