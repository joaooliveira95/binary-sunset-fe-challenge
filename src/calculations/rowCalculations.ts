import type { GridRow } from '../types';
import type { StatusKind } from '../types';

const PROFIT_WARNING_THRESHOLD = 100;
const MARGIN_WARNING_PERCENT = 5;

/**
 * Computes profit (revenue - cost) for a row.
 */
export function getProfit(row: GridRow): number {
  return row.revenue - row.cost;
}

/**
 * Computes margin % (profit / revenue * 100), or 0 if revenue is 0.
 */
export function getMarginPercent(row: GridRow): number {
  if (row.revenue <= 0) return 0;
  return (getProfit(row) / row.revenue) * 100;
}

/**
 * Derives status from profit and margin for chips display.
 * - High Priority: profit < 0
 * - Warning: profit < threshold OR margin < margin threshold
 * - Completed: otherwise (healthy)
 * - Pending: active === false can be used; we use "Pending" for low-but-positive profit
 */
export function getStatus(row: GridRow): StatusKind {
  const profit = getProfit(row);
  const margin = getMarginPercent(row);
  if (profit < 0) return 'High Priority';
  if (profit < PROFIT_WARNING_THRESHOLD || margin < MARGIN_WARNING_PERCENT) return 'Warning';
  if (!row.active) return 'Pending';
  return 'Completed';
}

export function getRowCalculations(row: GridRow): { profit: number; marginPercent: number; status: StatusKind } {
  return {
    profit: getProfit(row),
    marginPercent: getMarginPercent(row),
    status: getStatus(row),
  };
}
