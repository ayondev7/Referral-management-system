import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loader loader-${size} ${className}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};
