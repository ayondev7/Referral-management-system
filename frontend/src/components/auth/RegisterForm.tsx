'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '@lib/api';
import { useAuthStore } from '@store/authStore';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  referralCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const referralCode = searchParams.get('ref') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      referralCode,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      const { user, accessToken, refreshToken } = response.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Register</h1>
      
      <Input
        label="Name"
        type="text"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter your name"
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        placeholder="Enter your password"
      />

      <Input
        label="Referral Code (Optional)"
        type="text"
        {...register('referralCode')}
        error={errors.referralCode?.message}
        placeholder="Enter referral code"
      />

      <Button type="submit" loading={loading} className="w-full">
        Register
      </Button>

      <p className="text-center text-sm text-slate-900 opacity-80">
        Already have an account?{' '}
        <a href="/" className="text-blue-500 font-semibold hover:underline">Login</a>
      </p>
    </form>
  );
};
