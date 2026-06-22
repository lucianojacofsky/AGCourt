"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export const Card = ({ children, className = '', animate = false, ...props }: CardProps) => {
  if (animate) {
    return (
      <motion.div
        whileHover={{ y: -4, x: -4, boxShadow: '8px 8px 0px 0px #121212' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`neo-border bg-white neo-shadow p-6 rounded-none ${className}`}
        {...props as any}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`neo-border bg-white neo-shadow p-6 rounded-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
