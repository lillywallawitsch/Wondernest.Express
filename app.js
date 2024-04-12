import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { logger } from './middlewares/logger.js';
import methodOverride from 'method-override';
import { Event } from './models/event.js';
import 'dotenv/config';

mongoose.connect(process.env.MONGODB_URI);

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
    try {
        const events = await Event.find().sort({ date: 'desc' });
        res.render('index', { events });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
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

// Validation and sanitization middleware for the event creation route
const validateEvent = [
    body('title').trim().notEmpty().escape(),
    body('description').trim().notEmpty().escape(),
    body('location').trim().notEmpty().escape(),
    body('date').toDate(),
    body('host').trim().notEmpty().escape(),
];

// Handle rendering the new event form
app.get('/events/new', (req, res) => {
    // Create a new event object with default values
    const newEvent = new Event({
        title: '',
        description: '',
        location: '',
        date: new Date(),
        host: ''
    });
    // Render the new event form with the new event object
    res.render('events/new', { event: newEvent });
});

app.get('/events/:slug', async (req, res) => {
    try {
        const event = await Event.findOne({ slug: req.params.slug });
        if (!event) {
            return res.redirect('/');
        }
        res.render('events/show', { event });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission
app.post('/events', validateEvent, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const inputDate = new Date(req.body.date);
        let event = new Event({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            date: inputDate,
            host: req.body.host,
        });
        event = await event.save();
        res.redirect(`/events/${event.slug}`);
    } catch (error) {
        console.error(error);
        res.render('events/new', { event: event });
    }
});

// Edit route
app.get('/events/:slug/edit', async (req, res) => {
    try {
        const event = await Event.findOne({ slug: req.params.slug });
        if (!event) {
            return res.redirect('/');
        }
        res.render('events/edit', { event });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Update route
app.post('/events/:slug', async (req, res) => {
    try {
        const { title, description, location, date, host } = req.body;
        await Event.findOneAndUpdate({ slug: req.params.slug }, { title, description, location, date, host });
        res.redirect(`/events/${req.params.slug}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete route
app.delete('/events/:id', async (req, res) => {
    try {
        console.log('delete ID');
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle 404 responses
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'pages', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}/`);
});

// Close the MongoDB connection after execution
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});