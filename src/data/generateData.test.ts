import { describe, it, expect } from 'vitest';
import { generateData } from './generateData';

describe('generateData', () => {
  it('generates requested number of rows', () => {
    expect(generateData(100)).toHaveLength(100);
    expect(generateData(10_000)).toHaveLength(10_000);
  });

  it('each row has id, name, category, revenue, cost, quantity, active', () => {
    const rows = generateData(5);
    for (const r of rows) {
      expect(r).toHaveProperty('id');
      expect(typeof r.id).toBe('string');
      expect(r).toHaveProperty('name');
      expect(typeof r.name).toBe('string');
      expect(r).toHaveProperty('category');
      expect(typeof r.category).toBe('string');
      expect(r).toHaveProperty('revenue');
      expect(typeof r.revenue).toBe('number');
      expect(r).toHaveProperty('cost');
      expect(typeof r.cost).toBe('number');
      expect(r).toHaveProperty('quantity');
      expect(typeof r.quantity).toBe('number');
      expect(r).toHaveProperty('active');
      expect(typeof r.active).toBe('boolean');
    }
  });

  it('ids are unique', () => {
    const rows = generateData(500);
    const ids = new Set(rows.map((r) => r.id));
    expect(ids.size).toBe(500);
  });
});
