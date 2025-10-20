'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { CLIENT_ROUTES } from '@/routes';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
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
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success('Welcome!');
        router.push(CLIENT_ROUTES.DASHBOARD);
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-4 sm:gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-1 sm:mb-2">Login</h1>
      
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
        <a href={CLIENT_ROUTES.REGISTER} className="text-blue-500 font-semibold hover:underline">Register</a>
      </p>
    </form>
  );
};

export default LoginForm;
