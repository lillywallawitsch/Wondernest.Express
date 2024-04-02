import mongoose from 'mongoose';
import slugify from 'slugify';


const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

eventSchema.pre('validate', function(next){
    if(this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    next()
})




export const Event = mongoose.model('Event', eventSchema);
