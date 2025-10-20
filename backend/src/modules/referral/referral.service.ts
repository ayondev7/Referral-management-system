import { Referral } from './referral.model';
import { User } from '../auth/auth.model';
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
    let endDate: Date;
    let labels: string[] = [];
    let groupFormat: string;

    if (timeRange === 'daily') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      startDate = todayStart;
      endDate = todayEnd;
      groupFormat = '%Y-%m-%d';
      labels = ['Today'];
    } else if (timeRange === 'monthly') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      groupFormat = '%Y-%m';
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels = monthNames;
    } else {
      startDate = new Date(now.getFullYear() - 4, 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
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
          createdAt: { $gte: startDate, $lte: endDate }
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
          createdAt: { $gte: startDate, $lte: endDate }
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
      const dateStr = now.toISOString().split('T')[0];
      convertedData.push(convertedMap.get(dateStr) || 0);
      pendingData.push(pendingMap.get(dateStr) || 0);
    } else if (timeRange === 'monthly') {
      for (let month = 0; month < 12; month++) {
        const dateStr = `${now.getFullYear()}-${String(month + 1).padStart(2, '0')}`;
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
