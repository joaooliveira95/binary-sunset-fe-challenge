import { useState, useEffect, useMemo } from 'react';
import { getColumnDefs, COLUMNS_FOR_VISIBILITY } from '../grid/columnDefs';
import type { ColumnVisibility } from '../grid/columnDefs';
import { loadView, saveView } from '../utils/viewStorage';

const defaultColumnVisibility: ColumnVisibility = Object.fromEntries(
  COLUMNS_FOR_VISIBILITY.map((c) => [c.colId, true])
);

export function useGridViewState() {
  const saved = useMemo(() => loadView(), []);
  const [quickFilter, setQuickFilter] = useState(saved.quickFilter ?? '');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    () => saved.columnVisibility ?? defaultColumnVisibility
  );
  const [groupByCategory, setGroupByCategory] = useState(saved.groupByCategory ?? false);
  const [paginationPageSize, setPaginationPageSize] = useState<number | null>(
    saved.paginationPageSize ?? null
  );
  const [dense, setDense] = useState(saved.dense ?? false);

  useEffect(() => {
    saveView({
      columnVisibility,
      quickFilter,
      paginationPageSize,
      groupByCategory,
      dense,
    });
  }, [columnVisibility, quickFilter, paginationPageSize, groupByCategory, dense]);

  const columnDefs = useMemo(
    () => getColumnDefs(columnVisibility, { groupByCategory }),
    [columnVisibility, groupByCategory]
  );

  const toggleColumnVisibility = (colId: string) => {
    setColumnVisibility((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  const rowHeight = dense ? 32 : 42;

  return {
    quickFilter,
    setQuickFilter,
    columnVisibility,
    toggleColumnVisibility,
    groupByCategory,
    setGroupByCategory,
    paginationPageSize,
    setPaginationPageSize,
    dense,
    setDense,
    columnDefs,
    rowHeight,
  };
}
