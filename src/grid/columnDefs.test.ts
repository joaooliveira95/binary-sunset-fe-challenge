import { describe, it, expect } from 'vitest';
import { getColumnDefs } from './columnDefs';
import type { GridRow } from '../types';

describe('columnDefs', () => {
  const defs = getColumnDefs();

  it('includes editable columns for revenue, cost, quantity', () => {
    const revenue = defs.find((c) => c.field === 'revenue');
    const cost = defs.find((c) => c.field === 'cost');
    const quantity = defs.find((c) => c.field === 'quantity');
    expect(revenue?.editable).toBe(true);
    expect(cost?.editable).toBe(true);
    expect(quantity?.editable).toBe(true);
  });

  it('profit and marginPercent valueGetters derive from row data', () => {
    const profitCol = defs.find((c) => c.colId === 'profit');
    const marginCol = defs.find((c) => c.colId === 'marginPercent');
    expect(profitCol?.valueGetter).toBeDefined();
    expect(marginCol?.valueGetter).toBeDefined();

    const row: GridRow = {
      id: '1',
      name: 'X',
      category: 'Y',
      revenue: 1000,
      cost: 400,
      quantity: 10,
      active: true,
    };
    const params = { data: row };
    expect((profitCol!.valueGetter as (p: { data: GridRow }) => number)(params)).toBe(600);
    expect((marginCol!.valueGetter as (p: { data: GridRow }) => number)(params)).toBe(60);
  });

  it('status valueGetter influences chips (returns status string)', () => {
    const statusCol = defs.find((c) => c.colId === 'status');
    expect(statusCol?.valueGetter).toBeDefined();
    expect(statusCol?.cellRenderer).toBeDefined();

    const row: GridRow = {
      id: '1',
      name: 'X',
      category: 'Y',
      revenue: 50,
      cost: 100,
      quantity: 1,
      active: true,
    };
    const params = { data: row };
    expect((statusCol!.valueGetter as (p: { data: GridRow }) => string)(params)).toBe('High Priority');
  });
});
