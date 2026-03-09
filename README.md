## Binary Sunset FE Challenge – AG Grid Data Table

### Objective

Develop a **high-performance, interactive data table** using **AG Grid** that demonstrates:
- **Advanced cell rendering**
- **Dynamic, row-level calculations**
- **Real-time, input-driven updates**

The solution should be **robust, well-tested**, and capable of handling **large datasets (10,000+ rows)** efficiently.

### Requirements

#### AG Grid Implementation

- **Large dataset**: Display **at least 10,000 rows** of data.
- **Data variety**: Include a mix of **string**, **number**, and **boolean** fields.
- **Performance features**:
  - Use **AG Grid virtualization** and appropriate **performance optimizations**.
  - Ensure **smooth scrolling**, sorting, and interaction even with the full dataset.

#### Custom Cell Renderers

- **Chips renderer**:
  - Create a custom cell renderer that displays values as styled **“chips”** (badges/tags).
  - The chip’s appearance (e.g. **color**, **icon**, **label**) should change based on:
    - The cell’s raw value, and/or
    - A **calculated status** (e.g. `"High Priority"`, `"Pending"`, `"Completed"`, `"Warning"`).
- **Calculation display renderer**:
  - Implement a custom cell renderer to show **results of dynamic calculations**.
  - This should clearly reflect updated values when underlying data changes.

#### Dynamic Calculations

- **Calculated columns**:
  - Include **at least two columns** whose values are **derived from other columns** in the same row.
  - These values must **recalculate in real-time** when source data changes.
- **Interaction with chips renderer**:
  - One calculated column should **influence a chips-rendered column**.
  - Example: If a calculated `Profit` column falls below a threshold, a `Status` column (using the chips renderer) should show `"Warning"` or similar.

#### Input Fields for Interaction

- **Editable cells**:
  - Make at least one column **directly editable** via input fields (e.g. number/text inputs).
- **Update behavior**:
  - Editing a value must:
    - **Instantly update** that cell’s value in the grid.
    - **Trigger recalculation** of any **dependent calculated columns**.
    - **Update any affected chips** in related cells (e.g. status indicators).

#### Performance

- The table must remain **highly performant and responsive** with **10,000+ entries** while:
  - Scrolling
  - Editing values
  - Sorting / filtering (if implemented)
- You should:
  - **Minimize unnecessary re-renders**
  - Optimize **data update flows** to prevent UI lag.

#### Testing

- **Unit tests**:
  - Cover **custom cell renderers**.
  - Cover **calculation logic**.
  - Cover **data update mechanisms** (e.g. how edits propagate to dependent cells).
- **Integration / E2E tests**:
  - Add integration or end-to-end tests for **critical user flows**, such as:
    - Editing a value and seeing dependent values + chips update.
    - Interacting with a large dataset (e.g. scrolling and editing combined).
- Aim for **good test coverage** on **all custom components and logic**.

### Deliverables

- **Functional web application** demonstrating:
  - AG Grid table with **10,000+ rows**
  - **Custom chips renderer**
  - **Custom calculation renderer**
  - **Dynamic calculations** and **editable inputs** that propagate changes
- **Source code**, including:
  - Custom components and renderers
  - Data generation logic (for the 10k+ rows)
  - Tests (unit + integration/E2E where applicable)
- A **clear setup guide** in this `README` (see below).

### Technology Stack (Suggested)

- **Framework**: React
- **Grid library**: AG Grid (latest stable version)
  - Official React getting started guide: [`https://www.ag-grid.com/react-data-grid/getting-started/`](https://www.ag-grid.com/react-data-grid/getting-started/)
  - You may use the **AG Grid Enterprise** version **for testing purposes** if you wish; the evaluation **watermark is acceptable** for this challenge.
- **Testing**:
  - Jest
  - React Testing Library
  - Cypress (or a similar framework) for E2E / integration tests

You are free to add supporting libraries and tooling as needed, but please keep the stack **focused and justifiable**.

### Getting Started (What We Expect in Your Submission)

When you implement your solution, please make sure your repository includes:

- **Setup instructions**:
  - How to install dependencies
  - How to run the development server
  - How to run the test suite and (if applicable) Cypress or other E2E tests
- **Any assumptions or trade-offs** you made, documented briefly in this file.

---

## Setup & Running This Solution

### Prerequisites

- **Node.js** 18+ and npm (or pnpm/yarn)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The grid loads with 10,000 rows by default.

### Run the test suite

- **Unit tests** (Vitest + React Testing Library):

  ```bash
  npm run test
  ```

- **Coverage**:

  ```bash
  npm run test:coverage
  ```

- **E2E tests** (Cypress): start the dev server in one terminal (`npm run dev`), then in another:

  ```bash
  npm run e2e
  ```

  Or open the Cypress UI:

  ```bash
  npm run e2e:open
  ```

### Lint

- **ESLint** (flat config) with TypeScript, React, React Hooks, and jsx-a11y:

  ```bash
  npm run lint
  npm run lint:fix   # auto-fix where possible
  ```

### Build for production

```bash
npm run build
npm run preview   # optional: preview production build
```

---

## Implementation Notes & Interview Talking Points

### Architecture

- **Single data source**: Row data lives in React state (`useMemo` for initial 10k rows). No Redux or external store; AG Grid holds the data reference and we refresh only calculated cells on edit via `refreshCells`.
- **Calculated columns**: Profit, Margin %, and Status use `valueGetter` so they always derive from the current row. On cell edit we call `api.refreshCells({ rowNodes: [params.node], columns: CALCULATED_COLUMNS, force: true })` so only that row’s derived columns re-render—no full grid refresh.
- **Cell renderers**: Status and Active use Chakra `Badge` inside AG Grid cells; they receive `props.data` (row) or `props.value` and render in the grid’s React context (ChakraProvider wraps the app).

### Performance

- **Virtualization**: AG Grid’s default row virtualization is used; only visible rows (plus `rowBuffer`) are rendered. Scrolling and filtering stay smooth with 10k rows.
- **Minimal re-renders**: Column defs and defaultColDef are memoized. Callbacks (`onGridReady`, `onCellValueChanged`) are stable with `useCallback`. Quick filter is a single `setGridOption('quickFilterText', …)` so the grid handles filtering internally.
- **No Strict Mode**: React 18 Strict Mode double-mounts components, which can break AG Grid’s internal state; it’s disabled for this app.

### Testing Strategy

- **Unit**: Vitest + React Testing Library for pure logic (calculations, data generation), column value getters, cell renderers (Chips, Active, Calculation), ErrorBoundary, and CompareRowsModal (with ChakraProvider where needed). Run `npm run test`; coverage: `npm run test:coverage`.
- **E2E**: Cypress for critical flows: load and header, quick filter and “Showing X of 10,000” label, edit revenue and see status chip, scroll with large dataset. Run with dev server up: `npm run e2e`.

### Requirements Checklist

| Requirement | Status |
|-------------|--------|
| 10,000+ rows, string/number/boolean fields | ✓ `generateData(DEFAULT_ROW_COUNT)` |
| Virtualization, smooth scroll/sort | ✓ AG Grid default + `rowBuffer`, `debounceVerticalScrollbar` |
| Chips renderer (color/label by value or status) | ✓ Status + Active columns, `ChipsCellRenderer`, `ActiveCellRenderer` |
| Calculation display renderer | ✓ Profit/Margin % via valueGetter + valueFormatter; `CalculationCellRenderer` in tests |
| ≥2 calculated columns, real-time recalc | ✓ Profit, Margin %, Status; `refreshCells` on edit |
| Calculated column influences chips | ✓ Status from profit/margin → Status chip |
| Editable cells, instant update + recalc + chips | ✓ Revenue, Cost, Qty editable; `onCellValueChanged` → `refreshCells` |
| Unit tests: renderers, calculations, data update | ✓ See `src/**/*.test.ts(x)` |
| E2E: edit + see update, scroll + large dataset | ✓ `cypress/e2e/grid.cy.ts` |

### Extras for the Interview

- **Error boundary**: A simple class-component error boundary wraps the app so a render error in the grid doesn’t white-screen; user sees a message and “Try again”.
- **Accessibility**: Search input has `aria-label="Search table rows across all columns"` so screen readers get context.
- **Filtered row count**: When the user types in the search box, the header shows “Showing X of 10,000 rows” via `onDisplayedRowCountChange` and AG Grid’s `getDisplayedRowCount()` / `filterChanged` event, so it’s clear the quick filter is applied.

## Assumptions & Trade-offs

- **Testing**: Vitest is used instead of Jest for faster runs and native ESM support; the test style (describe/it, RTL) matches the suggested stack.
- **AG Grid**: AG Grid Community is used (no Enterprise). Virtualization and default options are used to keep the grid performant with 10k+ rows.
- **Calculated columns**: Profit (`revenue - cost`), Margin % (`profit / revenue * 100`), and Status (derived from profit/margin and `active`) are implemented via `valueGetter` and refreshed on edit with `refreshCells` so no separate store is required.
- **Status chip**: Status is derived from row data: negative profit → "High Priority"; low profit or low margin → "Warning"; inactive → "Pending"; otherwise "Completed".
- **Data**: Data is generated in memory at load time (no backend). Row count is fixed at 10,000 in code; it can be changed in `src/data/generateData.ts` (`DEFAULT_ROW_COUNT`).

---

For this challenge repository, your task is to:

1. **Fork** this repository to your own GitHub account.
2. Implement the AG Grid-based table as described above.
3. Add appropriate tests.
4. Ensure the app runs reliably and performs well with large datasets.
5. **Open a Pull Request** from your fork back to this repository (`Farghoo/binary-sunset-fe-challenge`) with:
   - A clear title and short description of your solution.
   - Any notes on trade-offs, assumptions, or limitations.

