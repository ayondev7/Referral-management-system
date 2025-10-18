import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  courseName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  isFirstPurchase: boolean;
  paymentInfo?: {
    cardHolder: string;
    last4: string;
    paidAt: Date;
  };
  createdAt: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    courseName: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    isFirstPurchase: {
      type: Boolean,
      default: false
    },
    paymentInfo: {
      cardHolder: { type: String },
      last4: { type: String },
      paidAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);
