import React from 'react';

const Badge = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    hot: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent font-bold',
    sale: 'bg-rose-600 text-white border-transparent font-bold',
    new: 'bg-indigo-600 text-white border-transparent font-bold'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-xl'
  };

  return (
    <span
      className={`inline-flex items-center justify-center border font-medium transition-colors ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
