import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { BrowserRouter } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    this.setState({ info });
  }
  render() {
    const { hasError, error, info } = this.state as any;
    if (hasError) {
      return (
        <div style={{ padding: '20px', background: '#900', color: 'white', minHeight: '100vh' }}>
          <h2>React Crash:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error?.toString()}</pre>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Stack Trace</summary>
            {info?.componentStack}
          </details>
        </div>
      );
    }
    return (this.props as any).children;
  }
}

import { ClerkProvider } from '@clerk/react';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || "pk_test_missing_key"}>
      <App />
    </ClerkProvider>
  </ErrorBoundary>
);