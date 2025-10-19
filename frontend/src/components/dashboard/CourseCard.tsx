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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate purchase');
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="course-card">
        <h3 className="course-title">Purchase a Course</h3>

        {!showPaymentForm ? (
          <div className="course-list">
            {courses.map((course) => (
              <div key={course.name} className="course-item">
                <div className="course-info">
                  <h4 className="course-name">{course.name}</h4>
                  <p className="course-price">${course.price}</p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
            <h4 className="payment-title">
              Complete Payment for {selectedCourse?.name}
            </h4>

            <Input
              label="Card Number"
              {...register('cardNumber')}
              error={errors.cardNumber?.message}
              placeholder="1234 5678 9012 3456"
            />

            <div className="payment-row">
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

            <div className="payment-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPaymentForm(false);
                  setPurchaseId(null);
                  setSelectedCourse(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Pay ${selectedCourse?.price}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </motion.div>
  );
};
