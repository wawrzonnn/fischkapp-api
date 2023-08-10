import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization

	if (!authHeader || authHeader !== 'pss-this-is-my-secret') {
		return res.status(401).send('Unauthorized')
	} else {
		next()
	}
}
