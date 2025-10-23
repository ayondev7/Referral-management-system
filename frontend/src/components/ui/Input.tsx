import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && <label className="text-sm font-medium text-slate-900">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-4 py-3 text-base border-2 rounded-xl bg-white text-slate-900 transition-all duration-200 outline-none ${
            error 
              ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' 
              : 'border-slate-200 focus:border-blue-500 focus:bg-white'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 -mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
