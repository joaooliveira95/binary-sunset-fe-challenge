import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { CalculationCellRenderer } from './CalculationCellRenderer';
import type { GridRow } from '../../types';
import type { ICellRendererParams } from 'ag-grid-community';

function row(overrides: Partial<GridRow> = {}): GridRow {
  return {
    id: '1',
    name: 'X',
    category: 'Y',
    revenue: 1000,
    cost: 400,
    quantity: 10,
    active: true,
    ...overrides,
  };
}

function renderWithData(data: GridRow | undefined) {
  const params = { data } as ICellRendererParams;
  render(
    <ChakraProvider>
      <CalculationCellRenderer {...params} />
    </ChakraProvider>
  );
}

describe('CalculationCellRenderer', () => {
  it('displays profit and margin from row data', () => {
    renderWithData(row({ revenue: 4841.41, cost: 3606.85 }));
    expect(screen.getByTestId('calculation-display')).toBeInTheDocument();
    expect(screen.getByText('1234.56')).toBeInTheDocument();
    expect(screen.getByText('25.5%')).toBeInTheDocument();
  });

  it('formats zero values', () => {
    renderWithData(row({ revenue: 100, cost: 100 }));
    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('returns null when data is undefined', () => {
    const { container } = render(
      <ChakraProvider>
        <CalculationCellRenderer {...({ data: undefined } as ICellRendererParams)} />
      </ChakraProvider>
    );
    expect(container.querySelector('[data-testid="calculation-display"]')).toBeNull();
  });
});
