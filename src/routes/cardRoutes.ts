import { Router, Request, Response } from 'express'
import { Card } from '../models/card'
import { CreateCardPayload } from '../types/cardTypes'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
	const cardData = req.body as CreateCardPayload

	try {
		const existingCard = await Card.findOne({ front: cardData.front })

		if (existingCard) {
			return res.status(400).send('Karta o tej samej wartości frontu już istnieje.')
		}

		const newCard = new Card(cardData)
		await newCard.save()
		res.status(201).send(newCard)
	} catch (error) {
		res.status(500).send('Wystąpił błąd podczas tworzenia karty.')
	}
})

export default router
