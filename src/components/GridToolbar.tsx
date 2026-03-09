import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiLayers, FiDownload, FiX, FiChevronDown, FiColumns, FiBarChart2, FiSliders } from 'react-icons/fi';
import { COLUMNS_FOR_VISIBILITY } from '../grid/columnDefs';
import type { ColumnVisibility } from '../grid/columnDefs';
import type { GridRow } from '../types';

export interface GridToolbarProps {
  quickFilter: string;
  onQuickFilterChange: (value: string) => void;
  selectedRows: GridRow[];
  onCompareClick: () => void;
  onClearSelection: () => void;
  columnVisibility: ColumnVisibility;
  onToggleColumnVisibility: (colId: string) => void;
  dense: boolean;
  onDenseChange: (dense: boolean) => void;
  paginationPageSize: number | null;
  onPaginationPageSizeChange: (size: number | null) => void;
  groupByCategory: boolean;
  onGroupByCategoryChange: (value: boolean) => void;
  onChartClick: () => void;
  onExportAll: () => void;
  onExportSelected: () => void;
  rowDataLength: number;
}

export function GridToolbar({
  quickFilter,
  onQuickFilterChange,
  selectedRows,
  onCompareClick,
  onClearSelection,
  columnVisibility,
  onToggleColumnVisibility,
  dense,
  onDenseChange,
  paginationPageSize,
  onPaginationPageSizeChange,
  groupByCategory,
  onGroupByCategoryChange,
  onChartClick,
  onExportAll,
  onExportSelected,
  rowDataLength,
}: GridToolbarProps) {
  const inputBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('#1d1d1f', 'whiteAlpha.900');
  const searchIconColor = useColorModeValue('#718096', 'gray.400');
  const toolbarBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const toolbarBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  const groupBorder = useColorModeValue('gray.300', 'gray.500');

  return (
    <Box p={3} borderRadius="lg" bg={toolbarBg} borderWidth="1px" borderColor={toolbarBorder}>
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'stretch', md: 'center' }}
        gap={3}
        flexWrap="wrap"
      >
        <InputGroup maxW="xs" size="md" flex="1" minW="200px">
          <InputLeftElement pointerEvents="none" height="100%" display="flex" alignItems="center" justifyContent="center">
            <Box as="span" color={searchIconColor} display="inline-flex">
              <FiSearch size={18} aria-hidden />
            </Box>
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search..."
            value={quickFilter}
            onChange={(e) => onQuickFilterChange(e.target.value)}
            bg={inputBg}
            borderColor={toolbarBorder}
            color={headingColor}
            aria-label="Search table rows across all columns"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)', bg: inputBg }}
          />
          {quickFilter.length > 0 && (
            <InputRightElement height="100%">
              <IconButton aria-label="Clear search" icon={<FiX size={14} />} size="xs" variant="ghost" onClick={() => onQuickFilterChange('')} />
            </InputRightElement>
          )}
        </InputGroup>

        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box borderLeftWidth={{ base: 0, md: '1px' }} borderColor={groupBorder} pl={{ base: 0, md: 3 }} display="flex" alignItems="center" gap={2}>
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                leftIcon={<FiLayers size={14} />}
                isDisabled={selectedRows.length !== 2}
                onClick={onCompareClick}
                title={selectedRows.length !== 2 ? 'Select exactly 2 rows to compare' : 'Compare selected rows'}
              >
                Compare ({selectedRows.length}/2)
              </Button>
              {selectedRows.length > 0 && <Button onClick={onClearSelection}>Clear</Button>}
            </ButtonGroup>
          </Box>

          <Box borderLeftWidth="1px" borderColor={groupBorder} pl={3} display="flex" alignItems="center" gap={2}>
            <Menu>
              <MenuButton as={Button} size="sm" variant="outline" leftIcon={<FiSliders size={14} />} rightIcon={<FiChevronDown size={12} />}>
                View
              </MenuButton>
              <MenuList minW="200px">
                <MenuGroup title="Density">
                  <MenuItem onClick={() => onDenseChange(false)} closeOnSelect={false}>
                    {!dense ? '✓ ' : ''}Comfortable
                  </MenuItem>
                  <MenuItem onClick={() => onDenseChange(true)} closeOnSelect={false}>
                    {dense ? '✓ ' : ''}Compact
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Rows per page">
                  <MenuItem onClick={() => onPaginationPageSizeChange(null)} closeOnSelect={false}>
                    {paginationPageSize == null ? '✓ ' : ''}All rows
                  </MenuItem>
                  <MenuItem onClick={() => onPaginationPageSizeChange(100)} closeOnSelect={false}>100</MenuItem>
                  <MenuItem onClick={() => onPaginationPageSizeChange(500)} closeOnSelect={false}>500</MenuItem>
                  <MenuItem onClick={() => onPaginationPageSizeChange(1000)} closeOnSelect={false}>1000</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem onClick={() => onGroupByCategoryChange(!groupByCategory)} closeOnSelect={false}>
                  {groupByCategory ? '✓ ' : ''}Group by category
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} size="sm" variant="outline" leftIcon={<FiColumns size={14} />} rightIcon={<FiChevronDown size={12} />}>
                Columns
              </MenuButton>
              <MenuList maxH="320px" overflowY="auto">
                {COLUMNS_FOR_VISIBILITY.map(({ colId, headerName }) => (
                  <MenuItem key={colId} onClick={() => onToggleColumnVisibility(colId)} closeOnSelect={false}>
                    {columnVisibility[colId] !== false ? <Box as="span" mr={2} color="green.500">✓</Box> : null}
                    {headerName}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>

          <Box borderLeftWidth="1px" borderColor={groupBorder} pl={3} display="flex" alignItems="center" gap={2}>
            <IconButton
              aria-label="Open chart"
              icon={<FiBarChart2 size={16} />}
              size="sm"
              variant="outline"
              onClick={onChartClick}
              isDisabled={rowDataLength === 0}
              title="Profit by category"
            />
            <Menu>
              <MenuButton as={Button} size="sm" colorScheme="blue" variant="outline" leftIcon={<FiDownload size={14} />} rightIcon={<FiChevronDown size={12} />}>
                Export
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onExportAll}>Export all (visible rows)</MenuItem>
                <MenuItem onClick={onExportSelected} isDisabled={selectedRows.length === 0} title={selectedRows.length === 0 ? 'Select rows first' : undefined}>
                  Export selected ({selectedRows.length})
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
