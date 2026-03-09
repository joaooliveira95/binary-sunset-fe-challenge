import type { ColumnVisibility } from '../grid/columnDefs';

export const VIEW_STORAGE_KEY = 'grid-view';

export interface SavedView {
  columnVisibility?: ColumnVisibility;
  quickFilter?: string;
  paginationPageSize?: number | null;
  groupByCategory?: boolean;
  dense?: boolean;
}

export function loadView(): SavedView {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveView(view: SavedView): void {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(view));
  } catch {
    // ignore
  }
}
