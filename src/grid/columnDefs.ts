import type { ColDef } from 'ag-grid-community';
import type { GridRow } from '../types';
import { getProfit, getMarginPercent, getStatus } from '../calculations/rowCalculations';
import { ActiveCellRenderer } from './renderers/ActiveCellRenderer';
import { ChipsCellRenderer } from './renderers/ChipsCellRenderer';

/** Column IDs that are derived from row data (valueGetter). Refreshed on revenue/cost/quantity edit. */
export const CALCULATED_COLUMNS = ['profit', 'marginPercent', 'status'];

/** Column ids and labels for the column visibility menu (checkbox column excluded). */
export const COLUMNS_FOR_VISIBILITY: { colId: string; headerName: string }[] = [
  { colId: 'id', headerName: 'ID' },
  { colId: 'name', headerName: 'Name' },
  { colId: 'category', headerName: 'Category' },
  { colId: 'revenue', headerName: 'Revenue' },
  { colId: 'cost', headerName: 'Cost' },
  { colId: 'quantity', headerName: 'Qty' },
  { colId: 'active', headerName: 'Active' },
  { colId: 'profit', headerName: 'Profit' },
  { colId: 'marginPercent', headerName: 'Margin %' },
  { colId: 'status', headerName: 'Status' },
];

export type ColumnVisibility = Record<string, boolean>;

export interface ColumnDefsOptions {
  groupByCategory?: boolean;
}

function getRow(params: { data?: GridRow | null }): GridRow | null {
  return params.data ?? null;
}

/** AG Grid column definitions: checkbox, id, name, category, editable revenue/cost/qty, chips (Active, Status), calculated Profit and Margin %. */
export function getColumnDefs(visibility?: ColumnVisibility, options?: ColumnDefsOptions): ColDef<GridRow>[] {
  const isVisible = (colId: string) => visibility == null || visibility[colId] !== false;
  const groupByCategory = options?.groupByCategory === true;
  return [
    {
      colId: '_checkbox',
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
      colId: 'id',
      headerName: 'ID',
      hide: !isVisible('id'),
      width: 100,
      suppressSizeToFit: true,
    },
    {
      field: 'name',
      colId: 'name',
      headerName: 'Name',
      hide: !isVisible('name'),
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'category',
      colId: 'category',
      headerName: 'Category',
      hide: groupByCategory ? true : !isVisible('category'),
      width: 120,
      rowGroup: groupByCategory,
      filter: 'agTextColumnFilter',
      filterParams: { filterOptions: ['contains', 'equals', 'startsWith'] },
    },
    {
      field: 'revenue',
      colId: 'revenue',
      headerName: 'Revenue',
      hide: !isVisible('revenue'),
      width: 110,
      editable: true,
      type: 'numericColumn',
      filter: 'agNumberColumnFilter',
      filterParams: { maxNumConditions: 2 },
      cellClass: 'editable-cell',
      valueParser: (params) => {
        const n = Number(params.newValue);
        return Number.isFinite(n) ? n : undefined;
      },
    },
    {
      field: 'cost',
      colId: 'cost',
      headerName: 'Cost',
      hide: !isVisible('cost'),
      width: 100,
      editable: true,
      type: 'numericColumn',
      filter: 'agNumberColumnFilter',
      filterParams: { maxNumConditions: 2 },
      cellClass: 'editable-cell',
      valueParser: (params) => {
        const n = Number(params.newValue);
        return Number.isFinite(n) ? n : undefined;
      },
    },
    {
      field: 'quantity',
      colId: 'quantity',
      headerName: 'Qty',
      hide: !isVisible('quantity'),
      width: 90,
      editable: true,
      type: 'numericColumn',
      filter: 'agNumberColumnFilter',
      filterParams: { maxNumConditions: 2 },
      cellClass: 'editable-cell',
      valueParser: (params) => {
        const n = Number(params.newValue);
        return Number.isFinite(n) ? n : undefined;
      },
    },
    {
      field: 'active',
      colId: 'active',
      headerName: 'Active',
      hide: !isVisible('active'),
      width: 100,
      cellRenderer: ActiveCellRenderer,
      filter: 'agTextColumnFilter',
      filterParams: { filterOptions: ['equals'], defaultOption: 'equals' },
    },
    {
      colId: 'profit',
      headerName: 'Profit',
      hide: !isVisible('profit'),
      width: 110,
      filter: 'agNumberColumnFilter',
      filterParams: { maxNumConditions: 2 },
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
      hide: !isVisible('marginPercent'),
      width: 100,
      filter: 'agNumberColumnFilter',
      filterParams: { maxNumConditions: 2 },
      tooltipValueGetter: () =>
        'Margin % = (profit / revenue) × 100. Red when negative.',
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
      hide: !isVisible('status'),
      width: 130,
      filter: 'agTextColumnFilter',
      filterParams: { filterOptions: ['equals'], defaultOption: 'equals' },
      tooltipValueGetter: (params) => {
        const r = getRow(params);
        if (!r) return '';
        const s = getStatus(r);
        const tips: Record<string, string> = {
          'High Priority': 'Profit is negative.',
          Warning: 'Profit < 100 or margin < 5%.',
          Pending: 'Row is inactive.',
          Completed: 'Healthy profit and margin.',
        };
        return tips[s] ?? '';
      },
      valueGetter: (params) => {
        const r = getRow(params);
        return r != null ? getStatus(r) : null;
      },
      cellRenderer: ChipsCellRenderer,
    },
  ];
}
