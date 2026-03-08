import { useMemo, useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Spinner,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiSun, FiMoon, FiLayers, FiDownload, FiX, FiChevronDown, FiColumns, FiBarChart2 } from 'react-icons/fi';
import type { GridApi } from 'ag-grid-community';
import { DataGrid, type AggregationTotals } from './grid/DataGrid';
import { getColumnDefs, COLUMNS_FOR_VISIBILITY, type ColumnVisibility } from './grid/columnDefs';
import { generateData, DEFAULT_ROW_COUNT } from './data/generateData';
import { getRowCalculations } from './calculations/rowCalculations';
import { CompareRowsModal } from './CompareRowsModal';
import { ProfitByCategoryChart } from './ProfitByCategoryChart';
import type { GridRow } from './types';

const VIEW_STORAGE_KEY = 'grid-view';

function loadView(): Partial<{
  columnVisibility: ColumnVisibility;
  quickFilter: string;
  paginationPageSize: number | null;
  groupByCategory: boolean;
  dense: boolean;
}> {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Escapes a cell value for CSV (quotes and commas). */
function escapeCsvCell(value: string | number | boolean): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Builds and downloads a CSV file from selected rows, including calculated profit, margin %, and status. */
function exportSelectedRowsToCsv(rows: GridRow[], fileName: string) {
  const headers = ['id', 'name', 'category', 'revenue', 'cost', 'quantity', 'active', 'profit', 'marginPercent', 'status'];
  const headerRow = headers.join(',');
  const dataRows = rows.map((row) => {
    const { profit, marginPercent, status } = getRowCalculations(row);
    return [
      row.id,
      row.name,
      row.category,
      row.revenue,
      row.cost,
      row.quantity,
      row.active,
      profit.toFixed(2),
      marginPercent.toFixed(1),
      status,
    ].map(escapeCsvCell).join(',');
  });
  const csv = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function App() {
  const { toggleColorMode, colorMode } = useColorMode();
  const gridApiRef = useRef<GridApi<GridRow> | null>(null);
  const hasHadRowsRef = useRef(false);
  const savedView = useMemo(loadView, []);
  const [quickFilter, setQuickFilter] = useState(savedView.quickFilter ?? '');
  const [displayedRowCount, setDisplayedRowCount] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRow[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    () => savedView.columnVisibility ?? Object.fromEntries(COLUMNS_FOR_VISIBILITY.map((c) => [c.colId, true]))
  );
  const [groupByCategory, setGroupByCategory] = useState(savedView.groupByCategory ?? false);
  const [paginationPageSize, setPaginationPageSize] = useState<number | null>(
    savedView.paginationPageSize ?? null
  );
  const [dense, setDense] = useState(savedView.dense ?? false);
  const [aggregation, setAggregation] = useState<AggregationTotals | null>(null);
  const [rowData, setRowData] = useState<GridRow[] | null>(null);
  const rowHeight = dense ? 32 : 42;
  useEffect(() => {
    const t = setTimeout(() => setRowData(generateData(DEFAULT_ROW_COUNT)), 400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    localStorage.setItem(
      VIEW_STORAGE_KEY,
      JSON.stringify({
        columnVisibility,
        quickFilter,
        paginationPageSize,
        groupByCategory,
        dense,
      })
    );
  }, [columnVisibility, quickFilter, paginationPageSize, groupByCategory, dense]);
  const columnDefs = useMemo(
    () => getColumnDefs(columnVisibility, { groupByCategory }),
    [columnVisibility, groupByCategory]
  );

  const toggleColumnVisibility = (colId: string) => {
    setColumnVisibility((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  /** Export all visible (filtered) rows via AG Grid CSV export. */
  const handleExportAll = () => {
    gridApiRef.current?.exportDataAsCsv({ fileName: 'grid-export-all.csv' });
  };

  /** Export only selected rows to CSV (includes calculated fields). */
  const handleExportSelected = () => {
    if (selectedRows.length > 0) {
      exportSelectedRowsToCsv(selectedRows, 'grid-export-selected.csv');
    }
  };

  const handleClearSelection = () => {
    gridApiRef.current?.deselectAll();
  };

  const handleClearFilters = () => {
    setQuickFilter('');
    gridApiRef.current?.setFilterModel(null);
  };

  const isFiltered = quickFilter.trim().length > 0;
  if (displayedRowCount != null && displayedRowCount > 0) hasHadRowsRef.current = true;
  const showEmptyState =
    displayedRowCount === 0 &&
    rowData != null &&
    rowData.length > 0 &&
    (isFiltered || hasHadRowsRef.current);
  const isLoading = rowData === null;
  const rowCountLabel =
    displayedRowCount != null && isFiltered
      ? `Showing ${displayedRowCount.toLocaleString()} of ${DEFAULT_ROW_COUNT.toLocaleString()} rows`
      : `${DEFAULT_ROW_COUNT.toLocaleString()} rows`;

  const pageBg = useColorModeValue('#f5f5f7', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const headerBorder = useColorModeValue('#e5e5ea', 'gray.700');
  const headingColor = useColorModeValue('#1d1d1f', 'whiteAlpha.900');
  const subtextColor = useColorModeValue('#6e6e73', 'gray.400');
  const inputBg = useColorModeValue('white', 'gray.700');
  const gridContainerBg = useColorModeValue('white', 'gray.800');
  const gridContainerBorder = useColorModeValue('#d2d2d7', 'gray.600');
  const searchIconColor = useColorModeValue('#718096', 'gray.400');

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={pageBg}>
      <Box
        as="header"
        py={5}
        px={6}
        bg={headerBg}
        borderBottomWidth="1px"
        borderColor={headerBorder}
        flexShrink={0}
      >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={4}>
          <Container maxW="full" px={0} flex={1} minW={0}>
            <Heading size="lg" fontWeight="600" color={headingColor} letterSpacing="tight">
              AG Grid Data Table
            </Heading>
            <Text mt={1} fontSize="sm" color={subtextColor}>
              {rowCountLabel} · Edit Revenue, Cost, or Qty to see calculations and status update
              in real time.
            </Text>
            <Box mt={4} display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <InputGroup maxW="md" size="md">
                <InputLeftElement
                  pointerEvents="none"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box as="span" color={searchIconColor} display="inline-flex">
                    <FiSearch size={20} aria-hidden />
                  </Box>
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search all columns..."
                  value={quickFilter}
                  onChange={(e) => setQuickFilter(e.target.value)}
                  bg={inputBg}
                  borderColor="gray.500"
                  color={headingColor}
                  aria-label="Search table rows across all columns"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                    bg: inputBg,
                  }}
                />
                {quickFilter.length > 0 && (
                  <InputRightElement height="100%">
                    <IconButton
                      aria-label="Clear search"
                      icon={<FiX size={16} />}
                      size="xs"
                      variant="ghost"
                      onClick={() => setQuickFilter('')}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
              <Button
                leftIcon={<FiLayers size={18} />}
                size="md"
                variant="outline"
                isDisabled={selectedRows.length !== 2}
                onClick={() => setCompareModalOpen(true)}
                title={selectedRows.length !== 2 ? 'Select exactly 2 rows to compare' : 'Compare selected rows'}
              >
                Compare ({selectedRows.length}/2)
              </Button>
              {selectedRows.length > 0 && (
                <Button size="md" variant="ghost" onClick={handleClearSelection}>
                  Clear selection
                </Button>
              )}
              <Button
                size="md"
                variant={dense ? 'solid' : 'outline'}
                colorScheme={dense ? 'gray' : undefined}
                onClick={() => setDense((v) => !v)}
                title={dense ? 'Comfortable density' : 'Compact density'}
              >
                {dense ? 'Compact' : 'Comfortable'}
              </Button>
              <Select
                size="md"
                maxW="32"
                value={paginationPageSize ?? 'all'}
                onChange={(e) => {
                  const v = e.target.value;
                  setPaginationPageSize(v === 'all' ? null : Number(v));
                }}
                bg={inputBg}
              >
                <option value="all">All rows</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </Select>
              <Button
                size="md"
                variant={groupByCategory ? 'solid' : 'outline'}
                colorScheme={groupByCategory ? 'blue' : undefined}
                onClick={() => setGroupByCategory((v) => !v)}
              >
                Group by category
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  size="md"
                  variant="outline"
                  leftIcon={<FiColumns size={18} />}
                  rightIcon={<FiChevronDown size={16} />}
                >
                  Columns
                </MenuButton>
                <MenuList maxH="320px" overflowY="auto">
                  {COLUMNS_FOR_VISIBILITY.map(({ colId, headerName }) => (
                    <MenuItem
                      key={colId}
                      onClick={() => toggleColumnVisibility(colId)}
                      closeOnSelect={false}
                    >
                      {columnVisibility[colId] !== false ? (
                        <Box as="span" mr={2} color="green.500" aria-hidden>
                          ✓
                        </Box>
                      ) : null}
                      {headerName}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Button
                size="md"
                variant="outline"
                leftIcon={<FiBarChart2 size={18} />}
                onClick={() => setChartModalOpen(true)}
                isDisabled={rowData == null || rowData.length === 0}
              >
                Chart
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  size="md"
                  variant="outline"
                  leftIcon={<FiDownload size={18} />}
                  rightIcon={<FiChevronDown size={16} />}
                >
                  Export
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleExportAll}>
                    Export all (visible rows)
                  </MenuItem>
                  <MenuItem
                    onClick={handleExportSelected}
                    isDisabled={selectedRows.length === 0}
                    title={selectedRows.length === 0 ? 'Select rows first' : undefined}
                  >
                    Export selected ({selectedRows.length})
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Container>
          <IconButton
            aria-label={colorMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            icon={colorMode === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            flexShrink={0}
          />
        </Box>
      </Box>
      <Box as="main" flex={1} minH={0} p={4}>
        <Box
          w="100%"
          position="relative"
          minH="500px"
          borderRadius="12px"
          overflow="hidden"
          shadow="0 2px 8px rgba(0,0,0,0.06)"
          bg={gridContainerBg}
          borderWidth="1px"
          borderColor={gridContainerBorder}
        >
          <Box h="70vh" minH="500px">
            <DataGrid<GridRow>
            rowData={rowData ?? []}
            columnDefs={columnDefs}
            quickFilterText={quickFilter}
            groupByCategory={groupByCategory}
            paginationPageSize={paginationPageSize}
            rowHeight={rowHeight}
            onDisplayedRowCountChange={setDisplayedRowCount}
            onAggregationChange={setAggregation}
            onSelectionChanged={setSelectedRows}
            gridApiRef={gridApiRef}
          />
          </Box>
          {isLoading && (
            <Box
              position="absolute"
              inset={0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg={gridContainerBg}
              borderRadius="12px"
              gap={3}
            >
              <Spinner size="xl" color="blue.500" />
              <Text color={subtextColor}>Loading grid…</Text>
            </Box>
          )}
          {showEmptyState && (
            <Box
              position="absolute"
              inset={0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg={gridContainerBg}
              borderRadius="12px"
              gap={3}
            >
              <Text color={subtextColor} fontSize="md">
                No rows match your filters.
              </Text>
              <Button size="md" colorScheme="blue" onClick={handleClearFilters}>
                Clear filters
              </Button>
            </Box>
          )}
          {aggregation != null && (
            <Box
              mt={0}
              py={2}
              px={4}
              borderTopWidth="1px"
              borderColor={gridContainerBorder}
              bg={gridContainerBg}
              borderRadius="0 0 12px 12px"
              fontSize="sm"
              display="flex"
              gap={6}
              flexWrap="wrap"
            >
              <Text as="span" color={subtextColor}>
                <Text as="span" fontWeight="600" color={headingColor}>Revenue:</Text> {aggregation.sumRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
              <Text as="span" color={subtextColor}>
                <Text as="span" fontWeight="600" color={headingColor}>Cost:</Text> {aggregation.sumCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
              <Text as="span" color={subtextColor}>
                <Text as="span" fontWeight="600" color={headingColor}>Profit:</Text> {aggregation.sumProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
              <Text as="span" color={subtextColor}>
                <Text as="span" fontWeight="600" color={headingColor}>Qty:</Text> {aggregation.sumQuantity.toLocaleString()}
              </Text>
            </Box>
          )}
        </Box>
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
