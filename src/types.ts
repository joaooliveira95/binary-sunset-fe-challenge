/**
 * Row data type for the grid.
 * Includes raw fields and derived values that are computed in real time.
 */
export interface GridRow {
  id: string;
  /** Product or item name */
  name: string;
  /** Category (string) */
  category: string;
  /** Revenue (editable) */
  revenue: number;
  /** Cost (editable) */
  cost: number;
  /** Quantity (editable) */
  quantity: number;
  /** Active flag (boolean) */
  active: boolean;
}

/** Status used by the chips renderer; derived from calculations */
export type StatusKind = 'High Priority' | 'Warning' | 'Completed' | 'Pending';

/** Calculated values (not stored; derived per row) */
export interface RowCalculations {
  profit: number;
  marginPercent: number;
  status: StatusKind;
}
