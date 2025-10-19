"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { purchaseAPI } from '@lib/api';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

const purchaseSchema = z.object({
  cardNumber: z.string().min(13, 'Invalid card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().min(3, 'Invalid CVV'),
  cardHolder: z.string().min(1, 'Card holder name required'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PaymentFormProps {
  course: { id: string; name: string; price: number };
  purchaseId: string | null;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  course,
  purchaseId,
  onPaymentSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
  });

  const onSubmit = async (data: PurchaseFormData) => {
    if (!purchaseId) return;

    try {
      setLoading(true);
      await purchaseAPI.pay(purchaseId, data);
      toast.success('Payment successful! Course purchased.');
      reset();
      onPaymentSuccess();
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <Card>
        <h3 className="text-2xl font-semibold mb-6 text-slate-900">Complete Payment for {course.name}</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Card Number"
            {...register('cardNumber')}
            error={errors.cardNumber?.message}
            placeholder="1234 5678 9012 3456"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Expiry"
              {...register('expiry')}
              error={errors.expiry?.message}
              placeholder="MM/YY"
            />
            <Input
              label="CVV"
              {...register('cvv')}
              error={errors.cvv?.message}
              placeholder="123"
            />
          </div>

          <Input
            label="Card Holder"
            {...register('cardHolder')}
            error={errors.cardHolder?.message}
            placeholder="John Doe"
          />

          <div className="flex gap-4 mt-4 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1" disabled={!purchaseId}>
              Pay ${course.price}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};
