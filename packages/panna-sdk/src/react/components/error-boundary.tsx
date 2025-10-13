import { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error information
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(
            this.state.error,
            this.state.errorInfo || {
              componentStack: ''
            }
          );
        }
        return this.props.fallback;
      }

      // Default fallback UI with helpful error message
      return (
        <div
          role="alert"
          className="m-5 rounded-xl border border-[#FF6B6B] bg-[#FFF5F5] p-5 text-[#C92A2A]"
        >
          <h2 className="mt-0">Something went wrong</h2>
          <details className="whitespace-pre-wrap">
            <summary className="mb-2.5 cursor-pointer">Error details</summary>
            <p>
              <strong>Error:</strong> {this.state.error.message}
            </p>
            {this.state.errorInfo && (
              <p>
                <strong>Component Stack:</strong>
                {this.state.errorInfo.componentStack}
              </p>
            )}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
