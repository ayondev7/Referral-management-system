import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  referredId: mongoose.Types.ObjectId;
  status: 'pending' | 'converted';
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    referredId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'converted'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

referralSchema.index({ referrerId: 1, referredId: 1 }, { unique: true });

export const Referral = mongoose.model<IReferral>('Referral', referralSchema);
