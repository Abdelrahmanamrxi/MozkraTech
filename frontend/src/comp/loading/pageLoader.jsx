import React, { lazy, Suspense } from "react";
import Loading from "./Loading";

// Cache for lazy components to prevent recreation
const lazyCache = new Map();

export const load = (importFn, message = "Loading...") => {
  // Create a stable cache key from the function
  const cacheKey = importFn.toString();
  
  // Return cached component if it exists
  if (lazyCache.has(cacheKey)) {
    const CachedComponent = lazyCache.get(cacheKey);
    return (props) => (
      <Suspense fallback={<Loading message={message} />}>
        <CachedComponent {...props} />
      </Suspense>
    );
  }

  // Create lazy component
  const LazyComponent = lazy(importFn);

  // Wrap with error boundary
  const WrappedComponent = (props) => (
    <Suspense fallback={<Loading message={message} />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Cache the component
  lazyCache.set(cacheKey, LazyComponent);

  return WrappedComponent;
};