import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './error-boundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Component that throws during render
const AlwaysThrowsError = () => {
  throw new Error('Always throws error');
};

// Suppress console.error for tests since we're intentionally triggering errors
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  describe('Error catching', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should catch and display error when child component throws', () => {
      render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Error details')).toBeInTheDocument();
    });

    it('should display the error message in details', () => {
      render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Always throws error/)).toBeInTheDocument();
    });

    it('should display component stack in details', () => {
      render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      const details = screen.getByText('Component Stack:');
      expect(details).toBeInTheDocument();
    });
  });

  describe('Custom fallback', () => {
    it('should render custom fallback ReactNode when error occurs', () => {
      const customFallback = <div>Custom error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error UI')).toBeInTheDocument();
      expect(
        screen.queryByText('Something went wrong')
      ).not.toBeInTheDocument();
    });

    it('should render custom fallback function when error occurs', () => {
      const fallbackFn = (error: Error) => (
        <div>Error occurred: {error.message}</div>
      );

      render(
        <ErrorBoundary fallback={fallbackFn}>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Error occurred: Always throws error')
      ).toBeInTheDocument();
    });

    it('should pass error and errorInfo to fallback function', () => {
      const fallbackFn = jest.fn((error, errorInfo) => (
        <div>
          Error: {error.message}
          {errorInfo.componentStack && <span>Has stack</span>}
        </div>
      ));

      render(
        <ErrorBoundary fallback={fallbackFn}>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      expect(fallbackFn).toHaveBeenCalled();
      const [error, errorInfo] = fallbackFn.mock.calls[0];
      expect(error.message).toBe('Always throws error');
      expect(errorInfo).toHaveProperty('componentStack');
    });
  });

  describe('Error callback', () => {
    it('should call onError callback when error is caught', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      const [error, errorInfo] = onError.mock.calls[0];
      expect(error.message).toBe('Always throws error');
      expect(errorInfo).toHaveProperty('componentStack');
    });

    it('should not call onError when no error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('Default error UI', () => {
    it('should have accessible error alert role', () => {
      render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should show error details in expandable section', () => {
      render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      const details = screen.getByText('Error details');
      expect(details.tagName).toBe('SUMMARY');
    });

    it('should display helpful error message', () => {
      render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      // Check for helpful heading
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Check for error details section
      expect(screen.getByText('Error details')).toBeInTheDocument();

      // Check for actual error message
      expect(screen.getByText(/Always throws error/)).toBeInTheDocument();
    });
  });

  describe('Error boundary state', () => {
    it('should update state when error is caught', () => {
      const { container } = render(
        <ErrorBoundary>
          <AlwaysThrowsError />
        </ErrorBoundary>
      );

      // Error UI should be rendered
      expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    });
  });

  describe('Multiple children', () => {
    it('should catch errors in any child component', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <AlwaysThrowsError />
          <div>Third child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('First child')).not.toBeInTheDocument();
      expect(screen.queryByText('Third child')).not.toBeInTheDocument();
    });
  });

  describe('Nested error boundaries', () => {
    it('should allow nested error boundaries', () => {
      const outerFallback = <div>Outer error</div>;
      const innerFallback = <div>Inner error</div>;

      render(
        <ErrorBoundary fallback={outerFallback}>
          <div>Outer content</div>
          <ErrorBoundary fallback={innerFallback}>
            <AlwaysThrowsError />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(screen.getByText('Inner error')).toBeInTheDocument();
      // Outer error should not be shown since inner boundary caught it
      expect(screen.queryByText('Outer error')).not.toBeInTheDocument();
      // Outer content should still be rendered (only inner subtree is replaced)
      expect(screen.getByText('Outer content')).toBeInTheDocument();
    });
  });
});
