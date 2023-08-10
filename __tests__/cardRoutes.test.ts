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

describe('POST /cards', () => {
	it('should return status code 201 when creating a card', async () => {
		const response = await request(app).post('/cards').send(sampleCard)

		expect(response.status).toBe(201)
	})

	it('should create a new card with the correct fields', async () => {
		await request(app).post('/cards').send(sampleCard)

		const card = await Card.findOne({ front: sampleCard.front })
		expect(card).not.toBeNull()
		expect(card!.front).toBe(sampleCard.front)
		expect(card!.back).toBe(sampleCard.back)
		expect(card!.tags).toEqual(expect.arrayContaining(sampleCard.tags))
		expect(card!.author).toBe(sampleCard.author)
	})

	it('should return status code 400 when card with specific front value already exists', async () => {
		await Card.create(sampleCard) 

		const response = await request(app).post('/cards').send(sampleCard)

		expect(response.status).toBe(400)
		expect(response.text).toBe('A card with the same front value already exists.')
	})
})

describe('PUT /cards/:id', () => {
    let createdCardId: string;

    beforeEach(async () => {
        const createdCard = await Card.create(sampleCard);
        createdCardId = createdCard.id;
    });

    it('should return status code 200 when updating a card', async () => {
        const updatedData = {
            front: 'Updated front',
            back: 'Updated back',
            tags: ['updatedTag']
        };

        const response = await request(app)
            .put(`/cards/${createdCardId}`)
            .send(updatedData);

        expect(response.status).toBe(200);
    });

    it('should update the card with the correct fields', async () => {
        const updatedData = {
            front: 'Updated front',
            back: 'Updated back',
            tags: ['updatedTag']
        };

        await request(app)
            .put(`/cards/${createdCardId}`)
            .send(updatedData);

        const updatedCard = await Card.findById(createdCardId);

        expect(updatedCard).not.toBeNull();
        expect(updatedCard!.front).toBe(updatedData.front);
        expect(updatedCard!.back).toBe(updatedData.back);
        expect(updatedCard!.tags).toEqual(expect.arrayContaining(updatedData.tags));
    });

    it('should return the updated flashcard', async () => {
        const updatedData = {
            front: 'Updated front',
            back: 'Updated back',
            tags: ['updatedTag']
        };

        const response = await request(app)
            .put(`/cards/${createdCardId}`)
            .send(updatedData);

        expect(response.body.front).toBe(updatedData.front);
        expect(response.body.back).toBe(updatedData.back);
        expect(response.body.tags).toEqual(expect.arrayContaining(updatedData.tags));
    });

});

describe('DELETE /cards/:id', () => {
    
    it('returns a status code of 204 if card deleted correctly', async () => {
        const card = await Card.create(sampleCard);

        const response = await request(app).delete(`/cards/${card._id}`);
        expect(response.status).toBe(204);
    });

    it('deletes the requested flashcard if it was created less than 5 minutes ago', async () => {
        const card = await Card.create(sampleCard);

        await request(app).delete(`/cards/${card._id}`);
        const searchedCard = await Card.findById(card._id);
        expect(searchedCard).toBeNull();
    });

    it('returns a status code of 403 if the flashcard was created more than 5 minutes ago', async () => {
        const card = await Card.create({
            ...sampleCard,
            createdAt: new Date(Date.now() - 6 * 60 * 1000) 
        });

        const response = await request(app).delete(`/cards/${card._id}`);
        expect(response.status).toBe(403);
    });

    it('returns a status code of 404 if the requested flashcard does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
    
        const card = await Card.findById(nonExistentId);
        expect(card).toBeNull(); 
    
        const response = await request(app).delete(`/cards/${nonExistentId}`);
        expect(response.status).toBe(404);
    });
});
