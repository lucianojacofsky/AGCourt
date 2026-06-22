import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'orange' | 'dark' | 'blue';
  className?: string;
}

export const Badge = ({ children, variant = 'lime', className = '' }: BadgeProps) => {
  let colorClasses = '';
  switch (variant) {
    case 'lime':
      colorClasses = 'bg-neo-lime text-neo-dark';
      break;
    case 'orange':
      colorClasses = 'bg-neo-orange text-white';
      break;
    case 'dark':
      colorClasses = 'bg-neo-dark text-white';
      break;
    case 'blue':
      colorClasses = 'bg-neo-blue text-white';
      break;
  }

  return (
    <span
      className={`inline-block border-2 border-neo-dark font-display text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 select-none ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};
