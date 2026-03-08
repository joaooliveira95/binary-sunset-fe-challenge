import { Box } from '@chakra-ui/react';
import type { ICellRendererParams } from 'ag-grid-community';
import { getRowCalculations } from '../../calculations/rowCalculations';
import type { GridRow } from '../../types';

/** Optional shape of value from valueGetter; this renderer reads row data and uses getRowCalculations. */
export interface CalculationDisplayValue {
  profit: number;
  marginPercent: number;
}

/** Renders profit and margin % from row data (for a combined calculation cell). Used in tests; grid uses separate Profit/Margin % columns with valueFormatter. */
export function CalculationCellRenderer(props: ICellRendererParams) {
  const row = props.data as GridRow | undefined;
  if (row == null) return null;

  const { profit, marginPercent } = getRowCalculations(row);
  const profitFormatted = typeof profit === 'number' ? profit.toFixed(2) : '—';
  const marginFormatted = typeof marginPercent === 'number' ? marginPercent.toFixed(1) + '%' : '—';
  const isProfitNegative = typeof profit === 'number' && profit < 0;
  const isMarginNegative = typeof marginPercent === 'number' && marginPercent < 0;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      fontSize="sm"
      data-testid="calculation-display"
      whiteSpace="nowrap"
    >
      <span>
        <span style={{ color: '#718096', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profit </span>
        <span style={{ fontWeight: 600, fontFamily: 'mono', color: isProfitNegative ? '#c53030' : '#1d1d1f' }}>{profitFormatted}</span>
      </span>
      <span style={{ color: '#d2d2d7' }}>|</span>
      <span>
        <span style={{ color: '#718096', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Margin </span>
        <span style={{ fontWeight: 600, fontFamily: 'mono', color: isMarginNegative ? '#c53030' : '#1d1d1f' }}>{marginFormatted}</span>
      </span>
    </Box>
  );
}
