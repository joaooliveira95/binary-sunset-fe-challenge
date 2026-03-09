import { getRowCalculations } from '../calculations/rowCalculations';
import type { GridRow } from '../types';

/** Escapes a cell value for CSV (quotes and commas). */
export function escapeCsvCell(value: string | number | boolean): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const CSV_HEADERS = ['id', 'name', 'category', 'revenue', 'cost', 'quantity', 'active', 'profit', 'marginPercent', 'status'];

/** Builds and downloads a CSV from selected rows, including calculated profit, margin %, and status. */
export function exportSelectedRowsToCsv(rows: GridRow[], fileName: string): void {
  const dataRows = rows.map((row) => {
    const { profit, marginPercent, status } = getRowCalculations(row);
    return [
      row.id,
      row.name,
      row.category,
      row.revenue,
      row.cost,
      row.quantity,
      row.active,
      profit.toFixed(2),
      marginPercent.toFixed(1),
      status,
    ].map(escapeCsvCell).join(',');
  });
  const csv = [CSV_HEADERS.join(','), ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
