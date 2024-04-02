import express from 'express';
import { Event } from '../models/event.js';

const router = express.Router();

// Route to render the form for creating a new event
router.get('/new', (req, res) => {
    res.render('events/new', { event: new Event() });
});

// Route to show the details of a specific event
router.get('/:slug', async (req, res) => {
    try {
        // Find the event by slug
        const event = await Event.findOne({ slug: req.params.slug });
        if (event == null) {
            // If event not found, redirect to index or handle the error
            return res.redirect('/');
        }
        // Render the event details page
        res.render('events/show', { event });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.redirect('/');
    }
});

// Route to handle the creation of a new event
router.post('/', async (req, res) => {
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


router.delete('/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


export default router;
