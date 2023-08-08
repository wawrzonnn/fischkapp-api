import { Router, Request, Response } from 'express'
import { Card } from '../models/card'
import { CreateCardPayload, UpdateCardPayload } from '../types/cardTypes'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
	const cardData = req.body as CreateCardPayload

	try {
		const existingCard = await Card.findOne({ front: cardData.front })

		if (existingCard) {
			return res.status(400).send('A card with the same front value already exists.')
		}

		const newCard = new Card(cardData)
		await newCard.save()
		res.status(201).send(newCard)
	} catch (error) {
		res.status(500).send('An error occurred while creating the card.')
	}
})

router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { front, back, tags } = req.body as UpdateCardPayload;

    try {
        const card = await Card.findById(id);

        if (!card) {
            return res.status(404).send('Card not found.');
        }

        card.front = front;
        card.back = back;
        card.tags = tags;

        await card.save();

        res.send(card);
    } catch (error) {
        res.status(500).send('An error occurred while updating the card.');
    }
});

export default router