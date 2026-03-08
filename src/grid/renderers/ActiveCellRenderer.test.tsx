import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ActiveCellRenderer } from './ActiveCellRenderer';
import type { ICellRendererParams } from 'ag-grid-community';

function renderWithProps(value: boolean) {
  const params = { value } as ICellRendererParams;
  render(
    <ChakraProvider>
      <ActiveCellRenderer {...params} />
    </ChakraProvider>
  );
}

describe('ActiveCellRenderer', () => {
  it('renders Active chip when value is true', () => {
    renderWithProps(true);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Inactive chip when value is false', () => {
    renderWithProps(false);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders Inactive for undefined/falsy value', () => {
    const params = { value: undefined } as ICellRendererParams;
    render(
      <ChakraProvider>
        <ActiveCellRenderer {...params} />
      </ChakraProvider>
    );
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
