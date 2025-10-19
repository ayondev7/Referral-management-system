'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '@lib/api';
import { useAuthStore } from '@store/authStore';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      const { user, accessToken, refreshToken } = response.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white/98 p-12 rounded-3xl shadow-2xl flex flex-col gap-6 backdrop-blur-md border border-white/30">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Login</h1>
      
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

      <Button type="submit" loading={loading} className="w-full">
        Login
      </Button>

      <p className="text-center text-sm text-slate-900 opacity-80">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-blue-500 font-semibold hover:underline">Register</a>
      </p>
    </form>
  );
};
