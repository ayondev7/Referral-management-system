import { Express } from 'express';
import userRoutes from '../modules/user/user.route';
import referralRoutes from '../modules/referral/referral.route';
import purchaseRoutes from '../modules/purchase/purchase.route';
import creditRoutes from '../modules/credit/credit.route';

export const useRoutes = (app: Express) => {
  app.use('/api/auth', userRoutes);
  app.use('/api/referrals', referralRoutes);
  app.use('/api/purchases', purchaseRoutes);
  app.use('/api/dashboard', creditRoutes);
};

export default useRoutes;
