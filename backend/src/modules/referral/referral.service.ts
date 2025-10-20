import { Referral } from './referral.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

export class ReferralService {
  async convertReferral(referredUserId: string) {
    const referredUser = await User.findById(referredUserId);
    if (!referredUser || !referredUser.referrerId) {
      return null;
    }

    const referral = await Referral.findOne({
      referrerId: referredUser.referrerId,
      referredId: referredUserId,
      status: 'pending'
    });

    if (!referral) {
      return null;
    }

    referral.status = 'converted';
    await referral.save();

    const referrer = await User.findById(referredUser.referrerId);
    if (referrer) {
      referrer.credits += 2;
      await referrer.save();
    }

    referredUser.credits += 2;
    await referredUser.save();

    return referral;
  }

  async getReferralStats(userId: string) {
    const totalReferredUsers = await Referral.countDocuments({ referrerId: userId });
    const convertedUsers = await Referral.countDocuments({
      referrerId: userId,
      status: 'converted'
    });

    return {
      totalReferredUsers,
      convertedUsers
    };
  }

  async getUserReferrals(userId: string) {
    const referrals = await Referral.find({ referrerId: userId })
      .populate('referredId', 'name email createdAt')
      .sort({ createdAt: -1 });

    return referrals;
  }
}
