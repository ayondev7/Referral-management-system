'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CLIENT_ROUTES } from '@/routes';
import Image from 'next/image';
import { useAuthStore } from '@store/authStore';
import { useSession } from 'next-auth/react';
import { useCourse, useInitiatePurchase } from '@/hooks';
import Card from '@components/ui/Card';
import Loader from '@components/ui/Loader';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PaymentForm from '@components/dashboard/PaymentForm';

export default function CoursePurchasePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { isAuthenticated: storeAuth } = useAuthStore();
  const { data: session, status } = useSession();

  type SessionWithToken = { accessToken?: string };
  const hasAccessToken = !!(session && 'accessToken' in session && (session as SessionWithToken).accessToken);
  const isAuthenticated = status === 'authenticated' || !!storeAuth || hasAccessToken;
  const autoInitiatedRef = useRef(false);
  
  const { data: course, isLoading: loading } = useCourse(courseId);
  const initiatePurchaseMutation = useInitiatePurchase();
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(CLIENT_ROUTES.HOME);
      return;
    }

    if (course && !autoInitiatedRef.current) {
      autoInitiatedRef.current = true;
      initiatePurchaseMutation.mutate(
        {
          courseId: course._id,
          courseName: course.title,
          amount: course.price,
        },
        {
          onSuccess: (data) => {
            setPurchaseId(data.purchaseId);
          },
          onError: (error) => {
            console.error('Auto-initiate purchase failed', error);
            toast.error('Failed to start checkout automatically');
          },
        }
      );
    }
  }, [course, isAuthenticated, router, initiatePurchaseMutation]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 px-4">
        <Loader size="lg" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-20">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">{course.title}</h2>
                  <div className="mb-4">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      width={400}
                      height={250}
                      className="w-full h-40 sm:h-48 object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 mb-4">{course.description}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <p className="text-base sm:text-lg font-semibold text-slate-900">Author: {course.author}</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">${course.price}</p>
                  </div>
                  {course.category && (
                    <p className="text-sm text-slate-500 mt-2">Category: {course.category}</p>
                  )}
                </div>

                <div>
                  <PaymentForm
                    course={{ id: course._id, name: course.title, price: course.price }}
                    purchaseId={purchaseId}
                    onPaymentSuccess={() => router.push(CLIENT_ROUTES.DASHBOARD)}
                    onCancel={() => router.push(CLIENT_ROUTES.COURSES)}
                    showCard={false}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
