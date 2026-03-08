import type { GridRow } from '../types';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports', 'Books', 'Toys'];
const NAME_PREFIXES = ['Pro', 'Basic', 'Deluxe', 'Standard', 'Premium', 'Eco', 'Smart'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]!;
}

/**
 * Generates a dataset of the given size with mixed string, number, and boolean fields.
 * Suitable for 10,000+ rows with stable references for AG Grid.
 */
export function generateData(rowCount: number): GridRow[] {
  const rows: GridRow[] = [];
  for (let i = 0; i < rowCount; i++) {
    const revenue = randomInt(100, 10000);
    const cost = randomInt(50, 8000);
    rows.push({
      id: `row-${i}`,
      name: `${randomChoice(NAME_PREFIXES)} Item ${i + 1}`,
      category: randomChoice(CATEGORIES),
      revenue,
      cost,
      quantity: randomInt(1, 500),
      active: Math.random() > 0.2,
    });
  }
  return rows;
}

export const DEFAULT_ROW_COUNT = 10_000;
