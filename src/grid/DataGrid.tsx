import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, CellValueChangedEvent, SelectionChangedEvent, GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { CALCULATED_COLUMNS } from './columnDefs';
import { getProfit } from '../calculations/rowCalculations';
import type { GridRow } from '../types';

/** Aggregated totals for displayed rows (for footer). */
export interface AggregationTotals {
  sumRevenue: number;
  sumCost: number;
  sumQuantity: number;
  sumProfit: number;
}

/** Props for the AG Grid wrapper. Supports quick filter, selection callback, and API ref for export/clear. */
interface DataGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  quickFilterText?: string;
  groupByCategory?: boolean;
  paginationPageSize?: number | null;
  rowHeight?: number;
  onDisplayedRowCountChange?: (count: number) => void;
  onAggregationChange?: (totals: AggregationTotals) => void;
  onSelectionChanged?: (selectedRows: T[]) => void;
  gridApiRef?: MutableRefObject<GridApi<T> | null>;
}

export function DataGrid<T extends GridRow>({
  rowData,
  columnDefs,
  quickFilterText = '',
  groupByCategory = false,
  paginationPageSize = null,
  rowHeight,
  onDisplayedRowCountChange,
  onAggregationChange,
  onSelectionChanged,
  gridApiRef,
}: DataGridProps<T>) {
  const pagination = paginationPageSize != null && paginationPageSize > 0;
  const gridRef = useRef<AgGridReact<T>>(null);

  const updateDisplayedCount = useCallback(() => {
    const api = gridRef.current?.api;
    if (api && onDisplayedRowCountChange) {
      onDisplayedRowCountChange(api.getDisplayedRowCount());
    }
  }, [onDisplayedRowCountChange]);

  const updateAggregation = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api || !onAggregationChange) return;
    let sumRevenue = 0;
    let sumCost = 0;
    let sumQuantity = 0;
    let sumProfit = 0;
    api.forEachNodeAfterFilter((node) => {
      const data = node.data as GridRow | undefined;
      if (data && typeof data.revenue === 'number') {
        sumRevenue += data.revenue;
        sumCost += data.cost;
        sumQuantity += data.quantity;
        sumProfit += getProfit(data);
      }
    });
    onAggregationChange({ sumRevenue, sumCost, sumQuantity, sumProfit });
  }, [onAggregationChange]);

  /** Sync quick filter text to the grid and refresh displayed row count. */
  useEffect(() => {
    gridRef.current?.api?.setGridOption('quickFilterText', quickFilterText);
    const t = setTimeout(updateDisplayedCount, 0);
    return () => clearTimeout(t);
  }, [quickFilterText, updateDisplayedCount]);

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    updateDisplayedCount();
    if (onAggregationChange) updateAggregation();
    const onFilterChanged = () => {
      updateDisplayedCount();
      if (onAggregationChange) updateAggregation();
    };
    api.addEventListener('filterChanged', onFilterChanged);
    return () => api.removeEventListener('filterChanged', onFilterChanged);
  }, [onDisplayedRowCountChange, onAggregationChange, quickFilterText, updateDisplayedCount, updateAggregation]);

  const onGridReady = useCallback(
    (params: GridReadyEvent<T>) => {
      if (gridApiRef) gridApiRef.current = params.api;
      params.api.sizeColumnsToFit();
      if (onDisplayedRowCountChange) {
        onDisplayedRowCountChange(params.api.getDisplayedRowCount());
      }
      if (onAggregationChange) updateAggregation();
    },
    [onDisplayedRowCountChange, onAggregationChange, gridApiRef, updateAggregation]
  );

  const onSelectionChangedCallback = useCallback(
    (event: SelectionChangedEvent<T>) => {
      if (!event.api || !onSelectionChanged) return;
      onSelectionChanged(event.api.getSelectedRows());
    },
    [onSelectionChanged]
  );

  /** On edit of revenue/cost/quantity, refresh only this row's calculated columns (profit, margin %, status). */
  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent<T>) => {
      if (!params.column?.getColId()) return;
      const colId = params.column.getColId();
      const isSourceField = ['revenue', 'cost', 'quantity'].includes(colId);
      if (isSourceField && params.node) {
        params.api.refreshCells({
          rowNodes: [params.node],
          columns: CALCULATED_COLUMNS,
          force: true,
        });
        if (onAggregationChange) updateAggregation();
      }
    },
    [onAggregationChange, updateAggregation]
  );

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    []
  );

  return (
    <div
      className="ag-theme-quartz"
      style={{ width: '100%', height: '70vh', minHeight: 500 }}
      role="grid"
      aria-label="Data grid: arrow keys to move, Enter to edit, Escape to cancel"
    >
      <AgGridReact<T>
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        onSelectionChanged={onSelectionChangedCallback}
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
        groupDefaultExpanded={groupByCategory ? 1 : undefined}
        pagination={pagination}
        paginationPageSize={pagination ? paginationPageSize! : undefined}
        rowHeight={rowHeight}
        suppressAnimationFrame={false}
        rowBuffer={20}
        debounceVerticalScrollbar={true}
        animateRows={false}
        getRowId={({ data }) => (data as { id?: string }).id ?? ''}
      />
    </div>
  );
}
