import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, IUser } from './user.model';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { nanoid } from 'nanoid';

export class UserService {
  async register(data: {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
  }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      const error: any = new Error('An account with this email already exists. Please log in instead');
      error.statusCode = 400;
      throw error;
    }

    let referrerId: any = null;

    if (data.referralCode) {
      const referrer = await User.findOne({ referralCode: data.referralCode });
      if (!referrer) {
        const error: any = new Error('The referral code you entered is not valid. Please check and try again');
        error.statusCode = 400;
        throw error;
      }
      referrerId = referrer._id;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const referralCode = nanoid(10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      referralCode,
      referrerId,
      credits: 0
    });

    if (referrerId) {
      const { Referral } = await import('../referral/referral.model');
      await Referral.create({
        referrerId,
        referredId: user._id,
        status: 'pending'
      });
      console.log(`Referral record created: referrer=${referrerId}, referred=${user._id}`);
    }

    const accessToken = generateAccessToken({ id: (user._id as mongoose.Types.ObjectId).toString(), email: user.email });
    const refreshToken = generateRefreshToken({ id: (user._id as mongoose.Types.ObjectId).toString(), email: user.email });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits
      },
      accessToken,
      refreshToken
    };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error('Email or password is incorrect. Please try again');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error: any = new Error('Email or password is incorrect. Please try again');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken({ id: (user._id as mongoose.Types.ObjectId).toString(), email: user.email });
    const refreshToken = generateRefreshToken({ id: (user._id as mongoose.Types.ObjectId).toString(), email: user.email });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits
      },
      accessToken,
      refreshToken
    };
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error('We couldn\'t find your account. Please contact support');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async addCredits(userId: string, amount: number) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error('We couldn\'t find your account. Please contact support');
      error.statusCode = 404;
      throw error;
    }
    user.credits += amount;
    await user.save();
    console.log(`Added ${amount} credits to user ${userId}. New balance: ${user.credits}`);
    return user;
  }
}
