import fs from 'fs'; // File system module
import path from 'path'; // Path module
import express from 'express'; // Express framework
import { logger } from './middlewares/logger.js'; // Custom logger middleware
import { fileURLToPath } from 'url'; // URL handling
import eventRouter from './routes/events.js'; // Custom router (assuming it's defined in events.js)

// Derive the directory of the current module using import.meta.url
const __filename = fileURLToPath(import.meta.url); // Current file path
const __dirname = path.dirname(__filename); // Directory name

// Create Express application
const app = express();

// Set up middleware
app.use(logger); // Custom logger middleware
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files from the 'views' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies for form data

// Use eventRouter middleware for the '/events' route
app.use('/events', eventRouter);

// Route handler to serve HTML files
app.get('/:page', (req, res) => {
  const page = req.params.page; // Extract the requested page from the URL
  const filePath = path.join(__dirname, 'views', 'pages', `${page}.html`); // Construct file path for requested page

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, send 404 error
      return res.status(404).sendFile(path.join(__dirname, 'views', 'pages', '404.html'));
    }

    // File exists, send it as response
    res.sendFile(filePath);
  });
});

// Route to render the index.ejs file
app.get('/', (req, res) => {
  const events = [/* event data array */]; // Placeholder for event data
  const indexPath = path.join(__dirname, 'views', 'pages', 'index.ejs');
  
  // Render the index.ejs file and pass event data to the template
  res.render(indexPath, { events });
});

// Route to handle form submission for the contact page
app.post('/contact', (request, response) => {
  console.log('Submitted email:', request.body.email); // Log submitted email
  console.log('Submitted message:', request.body.message); // Log submitted message
  
  // Render the emailsub.html page as the response after form submission
  response.sendFile(path.join(__dirname, 'views', 'emailsub.html'));
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`); // Log server start message
});
