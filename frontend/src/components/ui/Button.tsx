import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 border-none outline-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40',
    secondary: 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40',
    outline: 'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-px hover:shadow-lg',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const disabledClass = (disabled || loading) ? 'opacity-60 cursor-not-allowed hover:transform-none' : 'cursor-pointer';

  return (
    <button
      className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        children
      )}
    </button>
  );
};
