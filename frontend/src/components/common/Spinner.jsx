import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-14 h-14 border-4'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingPage = ({ text = 'Loading ShopSphere...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 py-16">
      <Spinner size="lg" />
      <p className="text-slate-600 dark:text-slate-400 font-medium text-sm animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Spinner;
