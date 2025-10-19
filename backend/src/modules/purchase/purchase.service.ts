import { Purchase } from './purchase.model';
import { ReferralService } from '../referral/referral.service';

const referralService = new ReferralService();

export class PurchaseService {
  async initiatePurchase(userId: string, courseName: string, amount: number) {
    const purchase = await Purchase.create({
      userId,
      courseName,
      amount,
      status: 'pending',
      isFirstPurchase: false
    });

    console.log(`Purchase initiated: ${purchase._id} for user ${userId}`);
    return purchase;
  }

  async processPurchase(
    purchaseId: string,
    userId: string,
    paymentData: {
      cardNumber: string;
      expiry: string;
      cvv: string;
      cardHolder: string;
    }
  ) {
    const purchase = await Purchase.findOne({ _id: purchaseId, userId });
    if (!purchase) {
      const error: any = new Error('We couldn\'t find this purchase. Please try again');
      error.statusCode = 404;
      throw error;
    }

    if (purchase.status !== 'pending') {
      const error: any = new Error('This purchase has already been completed');
      error.statusCode = 400;
      throw error;
    }

    this.validateCard(paymentData);

    const last4 = paymentData.cardNumber.slice(-4);

    const paidPurchaseCount = await Purchase.countDocuments({
      userId,
      status: 'paid'
    });

    const isFirstPurchase = paidPurchaseCount === 0;

    purchase.status = 'paid';
    purchase.isFirstPurchase = isFirstPurchase;
    purchase.paymentInfo = {
      cardHolder: paymentData.cardHolder,
      last4,
      paidAt: new Date()
    };

    await purchase.save();
    console.log(`Purchase paid: ${purchase._id}, isFirstPurchase: ${isFirstPurchase}`);

    if (isFirstPurchase) {
      await referralService.convertReferral(userId);
    }

    return purchase;
  }

  private validateCard(paymentData: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardHolder: string;
  }) {
    if (!paymentData.cardNumber || paymentData.cardNumber.length < 13) {
      const error: any = new Error('Please enter a valid card number');
      error.statusCode = 400;
      throw error;
    }

    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
      const error: any = new Error('Please enter expiry date in MM/YY format');
      error.statusCode = 400;
      throw error;
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      const error: any = new Error('Please enter a valid CVV code');
      error.statusCode = 400;
      throw error;
    }

    if (!paymentData.cardHolder || paymentData.cardHolder.trim().length === 0) {
      const error: any = new Error('Please enter the card holder name');
      error.statusCode = 400;
      throw error;
    }

    console.log('Card validation successful');
  }

  async getUserPurchases(userId: string) {
    const purchases = await Purchase.find({ userId }).sort({ createdAt: -1 });
    console.log(`Fetched ${purchases.length} purchases for user ${userId}`);
    return purchases;
  }
}
