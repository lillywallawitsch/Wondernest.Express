// Import using ES6 syntax
import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { logger } from './middlewares/logger.js';
import eventRouter from './routes/events.js';
import mongoose from 'mongoose';
import { Event } from './models/event.js';
import methodOverride from 'method-override'; 

mongoose.connect('mongodb://localhost/event');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const inputDate = new Date();

// Use methodOverride middleware
app.use(methodOverride('_method'));
app.use(logger);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use('/events', eventRouter);
app.set('view engine', 'ejs');

// Route to render the index page
app.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 'desc' });
  res.render('index', { events });
});

// Route to handle form submission for contact
app.post('/contact', (req, res) => {
  console.log('Submitted email:', req.body.email);
  console.log('Submitted message:', req.body.message);
  // Redirect to emailsub.html after form submission
  res.redirect('/pages/emailsub.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
