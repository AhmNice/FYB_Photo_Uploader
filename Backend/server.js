import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import { uploadRoute } from './routes/routes.js';


dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', uploadRoute);

// Optional test route
app.get('/', (req, res) => res.send('API is running...'));

const startServer = async () => {
  console.log('Connecting...');
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log('Server is up and running on port', process.env.PORT);
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();
