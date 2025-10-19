'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { CLIENT_ROUTES } from '@/routes';
import Image from 'next/image';
import { useAuthStore } from '@store/authStore';
import { useSession } from 'next-auth/react';
import { courseAPI, purchaseAPI } from '@lib/api';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Loader } from '@components/ui/Loader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { infoToast } from '@lib/toast';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
}

const purchaseSchema = z.object({
  cardNumber: z.string().min(13, 'Invalid card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().min(3, 'Invalid CVV'),
  cardHolder: z.string().min(1, 'Card holder name required'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function CoursePurchasePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { isAuthenticated: storeAuth } = useAuthStore() as any;
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' || !!storeAuth || !!(session as any)?.accessToken;
  const searchParams = useSearchParams();
  const autoInitiatedRef = useRef(false);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
  });

  useEffect(() => {
    // If the store says user is not authenticated, redirect to home per requirement
    if (!isAuthenticated) {
      router.push(CLIENT_ROUTES.HOME);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseAPI.getById(courseId);
        const courseData = response.data.data;
        setCourse(courseData);

        // Auto-initiate the purchase after fetching the course so the payment form is ready
        if (courseData && !autoInitiatedRef.current) {
          autoInitiatedRef.current = true;
          try {
            setProcessing(true);
            const resp = await purchaseAPI.initiate({
              courseId: courseData._id,
              courseName: courseData.title,
              amount: courseData.price,
            });
            setPurchaseId(resp.data.purchaseId);
            setShowPaymentForm(true);
            infoToast('Please complete your payment details');
          } catch (err) {
            console.error('Auto-initiate purchase failed', err);
            toast.error('Failed to start checkout automatically');
          } finally {
            setProcessing(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course', error);
        toast.error('Course not found');
        router.push(CLIENT_ROUTES.COURSES);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isAuthenticated, router, searchParams]);

  const handleInitiatePurchase = async () => {
    if (!course) return;

    try {
      setProcessing(true);
      const response = await purchaseAPI.initiate({
        courseId: course._id,
        courseName: course.title,
        amount: course.price,
      });
  setPurchaseId(response.data.purchaseId);
  setShowPaymentForm(true);
  infoToast('Please complete your payment details');
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to initiate purchase'
      );
    } finally {
      setProcessing(false);
    }
  };

  const onSubmit = async (data: PurchaseFormData) => {
    if (!purchaseId) return;

    try {
      setProcessing(true);
      await purchaseAPI.pay(purchaseId, data);
      toast.success('Payment successful! Course purchased.');
      reset();
  router.push(CLIENT_ROUTES.DASHBOARD);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Payment failed'
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Complete Your Payment</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Card Number"
                  {...register('cardNumber')}
                  error={errors.cardNumber?.message}
                  placeholder="1234 5678 9012 3456"
                />

                <div className="grid grid-cols-2 gap-4">
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

                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // reset local state and navigate back to courses list
                      setShowPaymentForm(false);
                      setPurchaseId(null);
                      reset();
                      router.push(CLIENT_ROUTES.COURSES);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={processing} className="flex-1" disabled={!purchaseId}>
                    Pay ${course?.price}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
