import React from 'react';
import { LuLoader } from 'react-icons/lu';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md',
    secondary: 'bg-amber-600 text-white shadow-sm hover:bg-amber-700 hover:shadow-md',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md',
    ghost: 'bg-transparent text-slate-700 hover:text-blue-600',
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
        <>
          <LuLoader className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
