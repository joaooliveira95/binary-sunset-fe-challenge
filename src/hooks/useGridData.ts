import { useState, useEffect } from 'react';
import { generateData, DEFAULT_ROW_COUNT } from '../data/generateData';
import type { GridRow } from '../types';

const LOAD_DELAY_MS = 400;

export function useGridData(): { rowData: GridRow[] | null; isLoading: boolean } {
  const [rowData, setRowData] = useState<GridRow[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setRowData(generateData(DEFAULT_ROW_COUNT)), LOAD_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return {
    rowData,
    isLoading: rowData === null,
  };
}

export { DEFAULT_ROW_COUNT };
