import { User } from '../user/user.model';
import { ReferralService } from '../referral/referral.service';
import { config } from '../../config/env';

const referralService = new ReferralService();

export class CreditService {
  async getDashboard(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const stats = await referralService.getReferralStats(userId);

    const referralLink = `${config.corsOrigin}/register?ref=${user.referralCode}`;
    
    return {
      totalReferredUsers: stats.totalReferredUsers,
      convertedUsers: stats.convertedUsers,
      totalCredits: user.credits,
      referralLink
    };
  }
}
