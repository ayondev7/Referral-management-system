import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 ${
      hover ? 'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 hover:border-blue-200' : ''
    } ${className}`}>
      {children}
    </div>
  );
};

export default Card;
