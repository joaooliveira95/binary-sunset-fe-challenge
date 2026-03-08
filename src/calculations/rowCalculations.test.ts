import { describe, it, expect } from 'vitest';
import {
  getProfit,
  getMarginPercent,
  getStatus,
  getRowCalculations,
} from './rowCalculations';
import type { GridRow } from '../types';

function row(overrides: Partial<GridRow> = {}): GridRow {
  return {
    id: '1',
    name: 'Test',
    category: 'Electronics',
    revenue: 1000,
    cost: 400,
    quantity: 10,
    active: true,
    ...overrides,
  };
}

describe('getProfit', () => {
  it('returns revenue minus cost', () => {
    expect(getProfit(row({ revenue: 1000, cost: 400 }))).toBe(600);
    expect(getProfit(row({ revenue: 100, cost: 100 }))).toBe(0);
    expect(getProfit(row({ revenue: 50, cost: 100 }))).toBe(-50);
  });
});

describe('getMarginPercent', () => {
  it('returns (profit / revenue) * 100 when revenue > 0', () => {
    expect(getMarginPercent(row({ revenue: 1000, cost: 400 }))).toBe(60);
    expect(getMarginPercent(row({ revenue: 100, cost: 50 }))).toBe(50);
  });

  it('returns 0 when revenue is 0', () => {
    expect(getMarginPercent(row({ revenue: 0, cost: 100 }))).toBe(0);
  });
});

describe('getStatus', () => {
  it('returns High Priority when profit < 0', () => {
    expect(getStatus(row({ revenue: 50, cost: 100 }))).toBe('High Priority');
  });

  it('returns Warning when profit is low or margin is low', () => {
    expect(getStatus(row({ revenue: 1000, cost: 950 }))).toBe('Warning'); // profit 50 < 100
    expect(getStatus(row({ revenue: 100, cost: 96 }))).toBe('Warning'); // margin 4% < 5%
  });

  it('returns Pending when active is false and not high priority/warning', () => {
    expect(getStatus(row({ revenue: 1000, cost: 400, active: false }))).toBe('Pending');
  });

  it('returns Completed when profit and margin are healthy and active', () => {
    expect(getStatus(row({ revenue: 1000, cost: 400, active: true }))).toBe('Completed');
  });
});

describe('getRowCalculations', () => {
  it('returns profit, marginPercent, and status', () => {
    const r = row({ revenue: 1000, cost: 400 });
    expect(getRowCalculations(r)).toEqual({
      profit: 600,
      marginPercent: 60,
      status: 'Completed',
    });
  });

  it('recalculates when row data changes (data update propagation)', () => {
    const r = row({ revenue: 1000, cost: 400 });
    expect(getRowCalculations(r).profit).toBe(600);

    const updated = { ...r, revenue: 500 };
    expect(getRowCalculations(updated).profit).toBe(100);
    expect(getRowCalculations(updated).marginPercent).toBe(20);
    expect(getRowCalculations(updated).status).toBe('Completed');
  });
});
