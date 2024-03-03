import React, { useState, useEffect } from 'react';

import ErrorPage from './errorPage';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError: any = (_this: Window, error: ErrorEvent): any => {
      // Log the error to an error reporting service
      console.error('Error caught by error boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return <ErrorPage />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
