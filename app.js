import http from 'http';
import fs from 'fs';
import express from 'express';
import { logger } from './middlewares/logger.js';

const app = express();

app.use(express.static('public'));
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

// Serve static files from the 'views' directory
app.use(express.static('views'));

// Parse URL-encoded bodies for form submission
app.use(express.urlencoded({ extended: true }));

app.post('/contact', (request, response) => {
  // Log the submitted email and message
  console.log('Submitted email:', request.body.email);
  console.log('Submitted message:', request.body.message);
  
  // Read the contents of emailsub.html file
  fs.readFile('./views/emailsub.html', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading emailsub.html:', err);
      // Send an error response if unable to read the file
      response.status(500).send('Internal Server Error');
      return;
    }
    // Send the contents of emailsub.html as the response
    response.send(data);
  });
});

// Route for handling 404 errors
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/views/404.html');
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
