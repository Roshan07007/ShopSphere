import React from 'react';

/**
 * Ambient Glowing Blobs for futuristic 3D background depth
 */
export const AmbientGlow = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Indigo Blob */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/20 dark:bg-primary-600/25 rounded-full blur-3xl filter animate-blob" />
      {/* Purple/Violet Blob */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-accent-500/20 dark:bg-accent-600/20 rounded-full blur-3xl filter animate-blob animation-delay-2000" />
      {/* Warm Saffron/Orange Accent Blob for Indian touch */}
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/15 dark:bg-orange-500/15 rounded-full blur-3xl filter animate-blob animation-delay-4000" />
    </div>
  );
};

export default AmbientGlow;
