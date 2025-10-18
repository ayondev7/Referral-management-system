import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { connectDB } from './config/db';
import { errorMiddleware } from './middleware/error.middleware';

import useRoutes from './routes/index';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Referral & Credit System API', version: '1.0.0' });
});

useRoutes(app);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
