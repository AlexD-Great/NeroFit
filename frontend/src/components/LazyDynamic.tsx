"use client";

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load the Dynamic widget using standard import
const DynamicWidget = lazy(() => 
  import('@dynamic-labs/sdk-react-core').then(module => ({
    default: module.DynamicWidget
  }))
);

interface LazyDynamicProps {
  className?: string;
}

function DynamicLoadingFallback() {
  return (
    <div className="w-full p-8 text-center">
      <LoadingSpinner size="lg" text="Loading authentication options..." />
    </div>
  );
}

export function LazyDynamic({ className }: LazyDynamicProps) {
  return (
    <div className={className}>
      <Suspense fallback={<DynamicLoadingFallback />}>
        <DynamicWidget />
      </Suspense>
    </div>
  );
} 