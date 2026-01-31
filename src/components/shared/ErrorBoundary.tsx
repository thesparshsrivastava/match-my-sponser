'use client';

import { Component, ReactNode } from 'react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <GlassCard className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
            <GlassButton
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </GlassButton>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
