import dotenv from 'dotenv'
dotenv.config()
import request from 'supertest'
import express from 'express'
import cardRoutes from '../src/routes/cardRoutes'
import { Card } from '../src/models/card'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())
app.use('/cards', cardRoutes)

const sampleCard = {
	front: 'Front of card',
	back: 'Back of card',
	tags: ['tag1'],
	author: 'sampleAuthor',
}

beforeAll(async () => {
	const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fischkapp'
	await mongoose
		.connect(url)
		.then(() => console.log('Test DB connection successful'))
		.catch(error => {
			console.error('Test DB connection error:', error)
			process.exit(1)
		})
})

afterEach(async () => {
	await Card.deleteMany({})
})

afterAll(async () => {
	await mongoose.disconnect()
})

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
		await Card.create(sampleCard) // Pre-create the card to trigger the error

		const response = await request(app).post('/cards').send(sampleCard)

		expect(response.status).toBe(400)
		expect(response.text).toBe('A card with the same front value already exists.')
	})
})
