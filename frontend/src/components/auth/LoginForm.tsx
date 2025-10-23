'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { authAPI } from '@lib/api';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { CLIENT_ROUTES } from '@/routes';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGuestLogin = async () => {
    try {
      setGuestLoading(true);

      const response = await authAPI.guestLogin();
      const { user, accessToken } = response.data;

      const result = await signIn('credentials', {
        email: user.email,
        password: accessToken,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success('Welcome Guest!');
        router.push(CLIENT_ROUTES.DASHBOARD);
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Guest login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setGuestLoading(false);
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
          className="absolute right-3 top-11 text-slate-500 hover:text-slate-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>
      </div>

      <Button type="submit" loading={loading} disabled={guestLoading} className="w-full">
        Login
      </Button>

      <Button 
        type="button" 
        onClick={handleGuestLogin} 
        loading={guestLoading} 
        disabled={loading}
        variant="outline" 
        className="w-full"
      >
        Guest Login
      </Button>

      <p className="text-center text-sm text-slate-900 opacity-80">
        Don&apos;t have an account?{' '}
        <a href={CLIENT_ROUTES.REGISTER} className="text-blue-500 font-semibold hover:underline">Register</a>
      </p>
    </form>
  );
};

export default LoginForm;
