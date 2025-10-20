import { Referral } from './referral.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

interface ReferralChartData {
  converted: number;
  pending: number;
  labels: string[];
  convertedData: number[];
  pendingData: number[];
}

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

  async getUserReferralsPaginated(userId: string, page: number = 1, limit: number = 8) {
    const skip = (page - 1) * limit;

    const referrals = await Referral.find({ referrerId: userId })
      .populate('referredId', 'name email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Referral.countDocuments({ referrerId: userId });

    return {
      referrals,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    };
  }

  async getReferralAnalytics(userId: string, timeRange: 'daily' | 'monthly' | 'yearly'): Promise<{ chartData: ReferralChartData; stats: any }> {
    const now = new Date();
    let startDate: Date;
    let labels: string[] = [];
    let groupFormat: string;

    if (timeRange === 'daily') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (timeRange === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      groupFormat = '%Y-%m';
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
    } else {
      startDate = new Date(now.getFullYear() - 4, 0, 1);
      groupFormat = '%Y';
      for (let i = 4; i >= 0; i--) {
        labels.push((now.getFullYear() - i).toString());
      }
    }

    const convertedAggregation = await Referral.aggregate([
      {
        $match: {
          referrerId: new mongoose.Types.ObjectId(userId),
          status: 'converted',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const pendingAggregation = await Referral.aggregate([
      {
        $match: {
          referrerId: new mongoose.Types.ObjectId(userId),
          status: 'pending',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const convertedMap = new Map(convertedAggregation.map(item => [item._id, item.count]));
    const pendingMap = new Map(pendingAggregation.map(item => [item._id, item.count]));

    const convertedData: number[] = [];
    const pendingData: number[] = [];

    if (timeRange === 'daily') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        convertedData.push(convertedMap.get(dateStr) || 0);
        pendingData.push(pendingMap.get(dateStr) || 0);
      }
    } else if (timeRange === 'monthly') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        convertedData.push(convertedMap.get(dateStr) || 0);
        pendingData.push(pendingMap.get(dateStr) || 0);
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = (now.getFullYear() - i).toString();
        convertedData.push(convertedMap.get(year) || 0);
        pendingData.push(pendingMap.get(year) || 0);
      }
    }

    const totalConverted = await Referral.countDocuments({
      referrerId: userId,
      status: 'converted'
    });

    const totalPending = await Referral.countDocuments({
      referrerId: userId,
      status: 'pending'
    });

    const totalReferrals = totalConverted + totalPending;

    return {
      chartData: {
        converted: totalConverted,
        pending: totalPending,
        labels,
        convertedData,
        pendingData
      },
      stats: {
        totalReferrals,
        convertedReferrals: totalConverted,
        pendingReferrals: totalPending
      }
    };
  }
}
