'use client';

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

const courses = [
  { name: 'Web Development Masterclass', price: 99 },
  { name: 'Advanced React & Next.js', price: 149 },
  { name: 'Full Stack JavaScript', price: 199 },
];

const purchaseSchema = z.object({
  cardNumber: z.string().min(13, 'Invalid card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().min(3, 'Invalid CVV'),
  cardHolder: z.string().min(1, 'Card holder name required'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export const CourseCard: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
  });

  const handleSelectCourse = async (course: typeof courses[0]) => {
    try {
      setLoading(true);
      setSelectedCourse(course);
      const response = await purchaseAPI.initiate({
        courseName: course.name,
        amount: course.price,
      });
      setPurchaseId(response.data.purchaseId);
      setShowPaymentForm(true);
      toast.success('Course selected! Please complete payment.');
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to initiate purchase');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PurchaseFormData) => {
    if (!purchaseId) return;

    try {
      setLoading(true);
      await purchaseAPI.pay(purchaseId, data);
      toast.success('Payment successful! Course purchased.');
      setShowPaymentForm(false);
      setPurchaseId(null);
      setSelectedCourse(null);
      reset();
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
        <h3 className="text-2xl font-semibold mb-6 text-slate-900">Purchase a Course</h3>

        {!showPaymentForm ? (
          <div className="flex flex-col gap-4">
            {courses.map((course) => (
              <div key={course.name} className="flex justify-between items-center p-5 border-2 border-slate-200 rounded-xl bg-white transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:border-blue-600">
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-semibold text-slate-900">{course.name}</h4>
                  <p className="text-xl font-bold text-blue-500">${course.price}</p>
                </div>
                <Button
                  onClick={() => handleSelectCourse(course)}
                  loading={loading && selectedCourse?.name === course.name}
                  size="sm"
                >
                  Buy Now
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-2 text-slate-900">
              Complete Payment for {selectedCourse?.name}
            </h4>

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
                onClick={() => {
                  setShowPaymentForm(false);
                  setPurchaseId(null);
                  setSelectedCourse(null);
                  reset();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                Pay ${selectedCourse?.price}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </motion.div>
  );
};
