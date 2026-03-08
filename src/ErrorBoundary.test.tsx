import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary } from './ErrorBoundary';

const Throw = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ChakraProvider>
        <ErrorBoundary>
          <span>Child content</span>
        </ErrorBoundary>
      </ChakraProvider>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ChakraProvider>
        <ErrorBoundary>
          <Throw />
        </ErrorBoundary>
      </ChakraProvider>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
