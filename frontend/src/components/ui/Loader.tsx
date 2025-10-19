import React from 'react';
import { LuLoader} from 'react-icons/lu';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const iconSizes = {
    sm: 18,
    md: 36,
    lg: 48,
  } as const;

  const iconSize = iconSizes[size] ?? iconSizes.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LuLoader size={iconSize} className="animate-spin text-blue-500" />
    </div>
  );
};
