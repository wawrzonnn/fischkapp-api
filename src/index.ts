import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cardRoutes from './routes/cardRoutes';

const app = express();
const port = process.env.PORT || 4000;
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fischkapp';

mongoose.connect(dbURI)
  .then(() => console.log('connection successful'))
  .catch((error) => {
    console.error('connection error:', error);
    process.exit(1);
  });

app.use(express.json());

app.use('/cards', cardRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});