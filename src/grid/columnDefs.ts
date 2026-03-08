import type { ColDef } from 'ag-grid-community';
import type { GridRow } from '../types';
import { getProfit, getMarginPercent, getStatus } from '../calculations/rowCalculations';
import { ActiveCellRenderer } from './renderers/ActiveCellRenderer';
import { ChipsCellRenderer } from './renderers/ChipsCellRenderer';

/** Column IDs that are derived from row data (valueGetter). Refreshed on revenue/cost/quantity edit. */
export const CALCULATED_COLUMNS = ['profit', 'marginPercent', 'status'];

function getRow(params: { data?: GridRow | null }): GridRow | null {
  return params.data ?? null;
}

/** AG Grid column definitions: checkbox, id, name, category, editable revenue/cost/qty, chips (Active, Status), calculated Profit and Margin %. */
export function getColumnDefs(): ColDef<GridRow>[] {
  return [
    {
      headerName: '',
      width: 50,
      maxWidth: 50,
      minWidth: 50,
      suppressSizeToFit: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      suppressSizeToFit: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 110,
      editable: true,
      type: 'numericColumn',
      cellClass: 'editable-cell',
      valueParser: (params) => {
        const n = Number(params.newValue);
        return Number.isFinite(n) ? n : undefined;
      },
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 100,
      editable: true,
      type: 'numericColumn',
      cellClass: 'editable-cell',
      valueParser: (params) => {
        const n = Number(params.newValue);
        return Number.isFinite(n) ? n : undefined;
      },
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 90,
      editable: true,
      type: 'numericColumn',
      cellClass: 'editable-cell',
      valueParser: (params) => {
        const n = Number(params.newValue);
        return Number.isFinite(n) ? n : undefined;
      },
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 100,
      cellRenderer: ActiveCellRenderer,
    },
    {
      colId: 'profit',
      headerName: 'Profit',
      width: 110,
      valueGetter: (params) => {
        // Calculated: revenue - cost; refreshed on edit via refreshCells
        const r = getRow(params);
        return r != null ? getProfit(r) : null;
      },
      valueFormatter: (params) =>
        params.value != null ? Number(params.value).toFixed(2) : '',
      cellClassRules: {
        'cell-negative': (params) => params.value != null && Number(params.value) < 0,
      },
    },
    {
      colId: 'marginPercent',
      headerName: 'Margin %',
      width: 100,
      valueGetter: (params) => {
        const r = getRow(params);
        return r != null ? getMarginPercent(r) : null;
      },
      valueFormatter: (params) =>
        params.value != null ? Number(params.value).toFixed(1) + '%' : '',
      cellClassRules: {
        'cell-negative': (params) => params.value != null && Number(params.value) < 0,
      },
    },
    {
      colId: 'status',
      headerName: 'Status',
      width: 130,
      valueGetter: (params) => {
        const r = getRow(params);
        return r != null ? getStatus(r) : null;
      },
      cellRenderer: ChipsCellRenderer,
    },
  ];
}
