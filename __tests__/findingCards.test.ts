import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import express from 'express';
import cardRoutes from '../src/routes/cardRoutes'
import { Card } from '../src/models/card';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/cards', cardRoutes);

const sampleCard = {
    front: 'Front of card',
    back: 'Back of card',
    tags: ['tag1'],
    author: 'sampleAuthor'
};

beforeAll(async () => {
    const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fischkapp';
    await mongoose.connect(url)
        .then(() => console.log('Test DB connection successful'))
        .catch((error) => {
            console.error('Test DB connection error:', error);
            process.exit(1);
        });
});

afterEach(async () => {
    await Card.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('GET /cards', () => {
    it('should return status code 200', async () => {
        await request(app).get('/cards').expect(200);
    });

    it('should return cards in the correct order', async () => {
        await Card.create(sampleCard);
        await Card.create({ ...sampleCard, front: 'Second card', author: 'anotherAuthor' });

        const response = await request(app).get('/cards');
        expect(response.body[0].front).toBe('Second card');
        expect(response.body[1].front).toBe('Front of card');
    });

    it('should return correct number of cards', async () => {
        await Card.create(sampleCard);
        await Card.create({ ...sampleCard, front: 'Second card' });

        const response = await request(app).get('/cards');
        expect(response.body.length).toBe(2);
    });
});

describe('GET /cards/author/:author', () => {
    it('should return cards written by the requested author in correct order', async () => {
        await Card.create(sampleCard);
        await Card.create({ ...sampleCard, front: 'Second card', author: 'sampleAuthor' });

        const response = await request(app).get('/cards/author/sampleAuthor');
        expect(response.body[0].front).toBe('Second card');
    });

    it('should return correct number of cards written by the requested author', async () => {
        await Card.create(sampleCard);
        await Card.create({ ...sampleCard, front: 'Second card', author: 'sampleAuthor' });
        await Card.create({ ...sampleCard, front: 'Third card', author: 'anotherAuthor' });

        const response = await request(app).get('/cards/author/sampleAuthor');
        expect(response.body.length).toBe(2);
    });
});

describe('GET /cards/tags/:tag', () => {
    it('should return correct number of cards with the requested tag', async () => {
        await Card.create(sampleCard);
        await Card.create({ ...sampleCard, front: 'Second card', tags: ['tag2'] });

        const response = await request(app).get('/cards/tags/tag1');
        expect(response.body.length).toBe(1);
    });
});