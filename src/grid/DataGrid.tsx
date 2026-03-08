import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, CellValueChangedEvent, SelectionChangedEvent, GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { CALCULATED_COLUMNS } from './columnDefs';

/** Props for the AG Grid wrapper. Supports quick filter, selection callback, and API ref for export/clear. */
interface DataGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  quickFilterText?: string;
  groupByCategory?: boolean;
  onDisplayedRowCountChange?: (count: number) => void;
  onSelectionChanged?: (selectedRows: T[]) => void;
  gridApiRef?: MutableRefObject<GridApi<T> | null>;
}

export function DataGrid<T>({
  rowData,
  columnDefs,
  quickFilterText = '',
  groupByCategory = false,
  onDisplayedRowCountChange,
  onSelectionChanged,
  gridApiRef,
}: DataGridProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);

  const updateDisplayedCount = useCallback(() => {
    const api = gridRef.current?.api;
    if (api && onDisplayedRowCountChange) {
      onDisplayedRowCountChange(api.getDisplayedRowCount());
    }
  }, [onDisplayedRowCountChange]);

  /** Sync quick filter text to the grid and refresh displayed row count. */
  useEffect(() => {
    gridRef.current?.api?.setGridOption('quickFilterText', quickFilterText);
    const t = setTimeout(updateDisplayedCount, 0);
    return () => clearTimeout(t);
  }, [quickFilterText, updateDisplayedCount]);

  useEffect(() => {
    if (!onDisplayedRowCountChange) return;
    const api = gridRef.current?.api;
    if (api) {
      updateDisplayedCount();
      api.addEventListener('filterChanged', updateDisplayedCount);
      return () => api.removeEventListener('filterChanged', updateDisplayedCount);
    }
  }, [onDisplayedRowCountChange, quickFilterText, updateDisplayedCount]);

  const onGridReady = useCallback(
    (params: GridReadyEvent<T>) => {
      if (gridApiRef) gridApiRef.current = params.api;
      params.api.sizeColumnsToFit();
      if (onDisplayedRowCountChange) {
        onDisplayedRowCountChange(params.api.getDisplayedRowCount());
      }
    },
    [onDisplayedRowCountChange, gridApiRef]
  );

  const onSelectionChangedCallback = useCallback(
    (event: SelectionChangedEvent<T>) => {
      if (!event.api || !onSelectionChanged) return;
      onSelectionChanged(event.api.getSelectedRows());
    },
    [onSelectionChanged]
  );

  /** On edit of revenue/cost/quantity, refresh only this row's calculated columns (profit, margin %, status). */
  const onCellValueChanged = useCallback((params: CellValueChangedEvent<T>) => {
    if (!params.column?.getColId()) return;
    const colId = params.column.getColId();
    const isSourceField = ['revenue', 'cost', 'quantity'].includes(colId);
    if (isSourceField && params.node) {
      params.api.refreshCells({
        rowNodes: [params.node],
        columns: CALCULATED_COLUMNS,
        force: true,
      });
    }
  }, []);

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
        suppressAnimationFrame={false}
        rowBuffer={20}
        debounceVerticalScrollbar={true}
        animateRows={false}
        getRowId={({ data }) => (data as { id?: string }).id ?? ''}
      />
    </div>
  );
}
