import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { logger } from './middlewares/logger.js';
import methodOverride from 'method-override';
import { Event } from './models/event.js';

mongoose.connect('mongodb://localhost/event');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('views'));

// Routes
app.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 'desc' })
  res.render('index', { events });
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'contact.html'));
});

// Handle form submission
app.post('/contact', (req, res) => {
  console.log('Submitted email:', req.body.email);
  console.log('Submitted message:', req.body.message);
  // Perform any necessary actions with the form data
  // Redirect to emailsub.html after form submission
  res.redirect('/pages/emailsub.html');
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'about.html'));
});

app.get('/events/new', (req, res) => {
    res.render('events/new', { event: new Event() });
});

app.get('/events/:slug', async (req, res) => {
    try {
        // Find the event by slug
        const event = await Event.findOne({ slug: req.params.slug });
        if (event == null) {
            return res.redirect('/');
        }
        res.render('events/show', { event });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

app.post('/events', async (req, res) => {
    const inputDate = new Date(req.body.date);
    // Create a new event object
    let event = new Event({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        date: inputDate,
        host: req.body.host,
    });

    try {
        // Save the event to the database
        event = await event.save();
        // Redirect to the details page of the newly created event
        res.redirect(`/events/${event.slug}`);
    } catch (error) {
        console.error(error);
        res.render('events/new', { event: event });
    }
});

app.delete('/events/:id', async (req, res) => {
    console.log('delete ID');
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
