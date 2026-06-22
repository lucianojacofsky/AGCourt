import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-display text-xs font-black uppercase tracking-wider text-neo-dark">
          {label}
        </label>
      )}
      <input
        className={`neo-border bg-white px-4 py-2.5 text-sm font-medium outline-none focus:bg-amber-50 focus:shadow-neo transition-all duration-75 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-neo-orange text-xs font-bold mt-0.5">
          * {error}
        </span>
      )}
    </div>
  );
};
