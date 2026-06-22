"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-neo-lime text-neo-dark hover:bg-white';
      break;
    case 'secondary':
      variantClasses = 'bg-neo-orange text-white hover:bg-white hover:text-neo-dark';
      break;
    case 'outline':
      variantClasses = 'bg-white text-neo-dark hover:bg-neo-lime';
      break;
    case 'dark':
      variantClasses = 'bg-neo-dark text-white hover:bg-neo-lime hover:text-neo-dark';
      break;
  }

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-xs font-bold';
      break;
    case 'md':
      sizeClasses = 'px-6 py-3 text-sm font-bold uppercase tracking-wider';
      break;
    case 'lg':
      sizeClasses = 'px-8 py-4 text-base font-extrabold uppercase tracking-widest';
      break;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: -2, y: -2 }}
      whileTap={{ scale: 0.98, x: 2, y: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`neo-border font-display neo-shadow flex items-center justify-center gap-2 cursor-pointer transition-colors duration-150 ${variantClasses} ${sizeClasses} ${className}`}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};
