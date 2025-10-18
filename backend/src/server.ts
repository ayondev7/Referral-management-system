import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { connectDB } from './config/db';
import { errorMiddleware } from './middleware/error.middleware';

import userRoutes from './modules/user/user.route';
import referralRoutes from './modules/referral/referral.route';
import purchaseRoutes from './modules/purchase/purchase.route';
import creditRoutes from './modules/credit/credit.route';

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

app.use('/api/auth', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/dashboard', creditRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`CORS enabled for: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
