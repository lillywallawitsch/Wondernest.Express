// Import using ES6 syntax
import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { logger } from './middlewares/logger.js';
import eventRouter from './routes/events.js';
import mongoose from 'mongoose';
import { Event } from './models/event.js';


mongoose.connect('mongodb://localhost/event');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const inputDate = new Date();
import methodOverride from 'method-override';

app.use(logger);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use('/events', eventRouter);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Define the absolute path to 404.html
// const pathTo404Html = '/absolute/path/to/404.html'; // Replace this with the actual absolute path


app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = page === 'index' ? path.join(__dirname, 'views', `${page}.ejs`) : path.join(__dirname, 'views', 'pages', `${page}.html`);
 res.sendFile(filePath);
});

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) return res.status(404).sendFile(path.join(__dirname, 'views', 'pages', '404.html'));


app.get('/', async (req, res) => {
  const events = await Event.find().sort({date: 'desc'})

  res.render('index', { events });
});


app.post('/contact', (req, res) => {
  console.log('Submitted email:', req.body.email);
  console.log('Submitted message:', req.body.message);
  // Redirect to emailsub.html after form submission
  res.redirect('/pages/emailsub.html');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
