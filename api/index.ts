import 'dotenv/config';
import express from 'express';
import { apiRouter } from '../src/server/apiRouter';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use('/api', apiRouter);

export default app;
