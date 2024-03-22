import fs from 'fs'; // Import the file system module
import path from 'path'; // Import the path module
import express from 'express'; // Import the Express framework
import { logger } from './middlewares/logger.js'; // Import custom logger middleware
import { fileURLToPath } from 'url'; // Import the fileURLToPath function

// Derive __dirname using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 

// Create an Express application
const app = express();

// Use the custom logger middleware
app.use(logger);

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

// Route handler function to serve HTML files
app.get('/:page', (req, res) => {
  const page = req.params.page; // Extract the requested page from the URL
  const filePath = `./views/${page}.html`; // Construct the file path based on the requested page

  // Serve the HTML file or display 404.html if an error occurs
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(404).sendFile('./views/404.html');
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });
});

// Route to handle form submission for the contact page
app.post('/contact', (request, response) => {
  // Log submitted email and message
  console.log('Submitted email:', request.body.email);
  console.log('Submitted message:', request.body.message);
  
  // Read and send the emailsub.html response
  fs.readFile('./views/emailsub.html', 'utf8', (err, data) => {
    if (err) {
      // Log error and send 500 status for server error
      console.error('Error reading emailsub.html:', err);
      response.status(500).send('Internal Server Error');
      return;
    }
    response.send(data);
  });
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
