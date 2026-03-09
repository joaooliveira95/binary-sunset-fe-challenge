import { useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import type { GridApi } from 'ag-grid-community';
import type { AggregationTotals } from './grid/DataGrid';
import { useGridViewState } from './hooks/useGridViewState';
import { useGridData, DEFAULT_ROW_COUNT } from './hooks/useGridData';
import { exportSelectedRowsToCsv } from './utils/exportCsv';
import { AppHeader } from './components/AppHeader';
import { GridToolbar } from './components/GridToolbar';
import { GridSection } from './components/GridSection';
import { CompareRowsModal } from './CompareRowsModal';
import { ProfitByCategoryChart } from './ProfitByCategoryChart';
import type { GridRow } from './types';
import { useColorModeValue } from '@chakra-ui/react';

function App() {
  const gridApiRef = useRef<GridApi<GridRow> | null>(null);
  const [hasHadRows, setHasHadRows] = useState(false);
  const [displayedRowCount, setDisplayedRowCount] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRow[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [aggregation, setAggregation] = useState<AggregationTotals | null>(null);

  const viewState = useGridViewState();
  const { rowData, isLoading } = useGridData();

  const handleDisplayedRowCountChange = (count: number) => {
    setDisplayedRowCount(count);
    if (count > 0) setHasHadRows(true);
  };

  const isFiltered = viewState.quickFilter.trim().length > 0;
  const showEmptyState =
    displayedRowCount === 0 &&
    rowData != null &&
    rowData.length > 0 &&
    (isFiltered || hasHadRows);
  const rowCountLabel =
    displayedRowCount != null && isFiltered
      ? `Showing ${displayedRowCount.toLocaleString()} of ${DEFAULT_ROW_COUNT.toLocaleString()} rows`
      : `${DEFAULT_ROW_COUNT.toLocaleString()} rows`;

  const handleExportAll = () => {
    gridApiRef.current?.exportDataAsCsv({ fileName: 'grid-export-all.csv' });
  };
  const handleExportSelected = () => {
    if (selectedRows.length > 0) {
      exportSelectedRowsToCsv(selectedRows, 'grid-export-selected.csv');
    }
  };
  const handleClearSelection = () => {
    gridApiRef.current?.deselectAll();
  };
  const handleClearFilters = () => {
    viewState.setQuickFilter('');
    gridApiRef.current?.setFilterModel(null);
  };

  const pageBg = useColorModeValue('#f5f5f7', 'gray.900');
  const subtitle = `${rowCountLabel} · Edit Revenue, Cost, or Qty to see calculations and status update in real time.`;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg}>
      <AppHeader subtitle={subtitle}>
        <GridToolbar
          quickFilter={viewState.quickFilter}
          onQuickFilterChange={viewState.setQuickFilter}
          selectedRows={selectedRows}
          onCompareClick={() => setCompareModalOpen(true)}
          onClearSelection={handleClearSelection}
          columnVisibility={viewState.columnVisibility}
          onToggleColumnVisibility={viewState.toggleColumnVisibility}
          dense={viewState.dense}
          onDenseChange={viewState.setDense}
          paginationPageSize={viewState.paginationPageSize}
          onPaginationPageSizeChange={viewState.setPaginationPageSize}
          groupByCategory={viewState.groupByCategory}
          onGroupByCategoryChange={viewState.setGroupByCategory}
          onChartClick={() => setChartModalOpen(true)}
          onExportAll={handleExportAll}
          onExportSelected={handleExportSelected}
          rowDataLength={rowData?.length ?? 0}
        />
      </AppHeader>
      <Box as="main" flex={1} minH={0} p={4}>
        <GridSection<GridRow>
          rowData={rowData}
          columnDefs={viewState.columnDefs}
          quickFilterText={viewState.quickFilter}
          groupByCategory={viewState.groupByCategory}
          paginationPageSize={viewState.paginationPageSize}
          rowHeight={viewState.rowHeight}
          onDisplayedRowCountChange={handleDisplayedRowCountChange}
          onAggregationChange={setAggregation}
          onSelectionChanged={setSelectedRows}
          gridApiRef={gridApiRef}
          isLoading={isLoading}
          showEmptyState={showEmptyState}
          aggregation={aggregation}
          onClearFilters={handleClearFilters}
        />
      </Box>
      <CompareRowsModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        rows={selectedRows.length >= 2 ? selectedRows.slice(0, 2) : []}
      />
      <ProfitByCategoryChart
        isOpen={chartModalOpen}
        onClose={() => setChartModalOpen(false)}
        rows={rowData ?? []}
      />
    </Box>
  );
}

export default App;
