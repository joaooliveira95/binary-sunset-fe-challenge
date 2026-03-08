import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Catches render errors (e.g. in the grid) and shows a fallback UI with "Try again" instead of a white screen. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <Box
          minH="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={8}
          bg="#f5f5f7"
        >
          <Heading size="lg" color="#1d1d1f" mb={2}>
            Something went wrong
          </Heading>
          <Text color="#6e6e73" mb={4} textAlign="center" maxW="md">
            The grid failed to load. This can happen with large datasets or a temporary error.
          </Text>
          <Text as="pre" fontSize="xs" color="red.600" bg="red.50" p={3} borderRadius="md" mb={4}>
            {this.state.error.message}
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
