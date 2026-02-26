import React from 'react';

export default function PokemonSkeleton() {
  return (
    // We use animate-pulse on the parent to make the whole card breathe
    <div className="rounded-xl shadow-sm p-4 bg-white flex flex-col items-center animate-pulse border border-gray-100">
      
      {/* The Image Skeleton (Matches the w-32 h-32 of your real images) */}
      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
      
      {/* The Title Skeleton (A slightly thicker rectangle) */}
      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
      
      {/* The ID Number Skeleton (A smaller, shorter rectangle) */}
      <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
      
    </div>
  );
}