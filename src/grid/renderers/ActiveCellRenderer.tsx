import { Badge } from '@chakra-ui/react';
import type { ICellRendererParams } from 'ag-grid-community';

/** Renders Active column as a chip: green "Active" or gray "Inactive" from boolean value. */
export function ActiveCellRenderer(props: ICellRendererParams) {
  const isActive = props.value === true;
  return (
    <Badge
      colorScheme={isActive ? 'green' : 'gray'}
      variant="solid"
      fontSize="xs"
      fontWeight="500"
      letterSpacing="0.01em"
      lineHeight="1.2"
      px={1.5}
      py={0.25}
      borderRadius="md"
      textTransform="none"
      minH="unset"
      height="auto"
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
