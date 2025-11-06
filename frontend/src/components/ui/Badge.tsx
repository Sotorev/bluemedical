import React, { ReactNode } from 'react';
import { TaskStatus } from '@/types';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'status';
  status?: TaskStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const statusColors = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'en progreso': 'bg-blue-100 text-blue-800',
    'completada': 'bg-green-100 text-green-800',
  };

  const variantStyle = variant === 'status' && status
    ? statusColors[status]
    : 'bg-gray-100 text-gray-800';

  return (
    <span className={`${baseStyles} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
};

