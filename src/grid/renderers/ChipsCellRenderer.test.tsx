import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ChipsCellRenderer } from './ChipsCellRenderer';
import type { ICellRendererParams } from 'ag-grid-community';

function renderWithProps(value: string) {
  const params = { value } as ICellRendererParams;
  render(
    <ChakraProvider>
      <ChipsCellRenderer {...params} />
    </ChakraProvider>
  );
}

describe('ChipsCellRenderer', () => {
  it('renders High Priority chip', () => {
    renderWithProps('High Priority');
    expect(screen.getByText(/High Priority/)).toBeInTheDocument();
    expect(screen.getByTitle('High Priority')).toBeInTheDocument();
  });

  it('renders Warning chip', () => {
    renderWithProps('Warning');
    expect(screen.getByText(/Warning/)).toBeInTheDocument();
    expect(screen.getByTitle('Warning')).toBeInTheDocument();
  });

  it('renders Completed chip', () => {
    renderWithProps('Completed');
    expect(screen.getByText(/Completed/)).toBeInTheDocument();
    expect(screen.getByTitle('Completed')).toBeInTheDocument();
  });

  it('renders Pending chip for unknown value', () => {
    renderWithProps('Pending');
    expect(screen.getByText(/Pending/)).toBeInTheDocument();
    expect(screen.getByTitle('Pending')).toBeInTheDocument();
  });

  it('falls back to Pending for unknown status value', () => {
    renderWithProps('Unknown');
    expect(screen.getByText(/Pending/)).toBeInTheDocument();
  });
});
