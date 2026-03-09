import { Box, Spinner, Text, Button, useColorModeValue } from '@chakra-ui/react';
import type { MutableRefObject } from 'react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { DataGrid, type AggregationTotals } from '../grid/DataGrid';
import type { GridRow } from '../types';

export interface GridSectionProps<T extends GridRow> {
  rowData: T[] | null;
  columnDefs: ColDef<T>[];
  quickFilterText: string;
  groupByCategory: boolean;
  paginationPageSize: number | null;
  rowHeight: number;
  onDisplayedRowCountChange: (count: number) => void;
  onAggregationChange: (totals: AggregationTotals) => void;
  onSelectionChanged: (rows: T[]) => void;
  gridApiRef?: MutableRefObject<GridApi<T> | null>;
  isLoading: boolean;
  showEmptyState: boolean;
  aggregation: AggregationTotals | null;
  onClearFilters: () => void;
}

export function GridSection<T extends GridRow>({
  rowData,
  columnDefs,
  quickFilterText,
  groupByCategory,
  paginationPageSize,
  rowHeight,
  onDisplayedRowCountChange,
  onAggregationChange,
  onSelectionChanged,
  gridApiRef,
  isLoading,
  showEmptyState,
  aggregation,
  onClearFilters,
}: GridSectionProps<T>) {
  const gridContainerBg = useColorModeValue('white', 'gray.800');
  const gridContainerBorder = useColorModeValue('#d2d2d7', 'gray.600');
  const subtextColor = useColorModeValue('#6e6e73', 'gray.400');
  const headingColor = useColorModeValue('#1d1d1f', 'whiteAlpha.900');

  return (
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
        <DataGrid<T>
          rowData={rowData ?? []}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          groupByCategory={groupByCategory}
          paginationPageSize={paginationPageSize}
          rowHeight={rowHeight}
          onDisplayedRowCountChange={onDisplayedRowCountChange}
          onAggregationChange={onAggregationChange}
          onSelectionChanged={onSelectionChanged}
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
          <Button size="md" colorScheme="blue" onClick={onClearFilters}>
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
            <Text as="span" fontWeight="600" color={headingColor}>Revenue:</Text>{' '}
            {aggregation.sumRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text as="span" color={subtextColor}>
            <Text as="span" fontWeight="600" color={headingColor}>Cost:</Text>{' '}
            {aggregation.sumCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text as="span" color={subtextColor}>
            <Text as="span" fontWeight="600" color={headingColor}>Profit:</Text>{' '}
            {aggregation.sumProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text as="span" color={subtextColor}>
            <Text as="span" fontWeight="600" color={headingColor}>Qty:</Text>{' '}
            {aggregation.sumQuantity.toLocaleString()}
          </Text>
        </Box>
      )}
    </Box>
  );
}
