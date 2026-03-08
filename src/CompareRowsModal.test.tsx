import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { CompareRowsModal } from './CompareRowsModal';
import type { GridRow } from './types';

function row(overrides: Partial<GridRow> = {}): GridRow {
  return {
    id: 'row-1',
    name: 'Product A',
    category: 'Electronics',
    revenue: 1000,
    cost: 400,
    quantity: 10,
    active: true,
    ...overrides,
  };
}

describe('CompareRowsModal', () => {
  it('returns null when fewer than 2 rows', () => {
    render(
      <ChakraProvider>
        <CompareRowsModal isOpen={true} onClose={() => {}} rows={[row()]} />
      </ChakraProvider>
    );
    expect(screen.queryByText('Compare rows')).not.toBeInTheDocument();
  });

  it('renders comparison table when open with two rows', () => {
    const rows = [row({ id: 'r1', name: 'Row 1' }), row({ id: 'r2', name: 'Row 2', revenue: 500 })];
    render(
      <ChakraProvider>
        <CompareRowsModal isOpen={true} onClose={() => {}} rows={rows} />
      </ChakraProvider>
    );
    expect(screen.getByText('Compare rows')).toBeInTheDocument();
    expect(screen.getByText(/Row 1 \(r1\)/)).toBeInTheDocument();
    expect(screen.getByText(/Row 2 \(r2\)/)).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('shows calculated profit and status in comparison', () => {
    const rows = [
      row({ id: 'a', name: 'A', revenue: 1000, cost: 400 }),
      row({ id: 'b', name: 'B', revenue: 1000, cost: 950 }),
    ];
    render(
      <ChakraProvider>
        <CompareRowsModal isOpen={true} onClose={() => {}} rows={rows} />
      </ChakraProvider>
    );
    expect(screen.getByText('600')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
