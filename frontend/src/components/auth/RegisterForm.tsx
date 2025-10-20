 'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { authAPI } from '@lib/api';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { CLIENT_ROUTES } from '@/routes';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const { ...registerData } = data;

      await authAPI.register(registerData);

      const result = await signIn('credentials', {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success('Registration successful! Welcome!');
        router.push(CLIENT_ROUTES.DASHBOARD);
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-4 sm:gap-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-1 sm:mb-2">Register</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Name"
            type="text"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Enter your email"
          />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={errors.password?.message}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-700"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Referral Code (Optional)"
            type="text"
            {...register('referralCode')}
            error={errors.referralCode?.message}
            placeholder="Enter referral code"
          />
        </div>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Register
      </Button>

      <p className="text-center text-sm text-slate-900 opacity-80">
        Already have an account?{' '}
        <Link href={CLIENT_ROUTES.HOME} className="text-blue-500 font-semibold hover:underline">Login</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
