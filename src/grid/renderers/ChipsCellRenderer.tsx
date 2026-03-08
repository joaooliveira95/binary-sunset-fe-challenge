import { Badge } from '@chakra-ui/react';
import type { ICellRendererParams } from 'ag-grid-community';
import type { StatusKind } from '../../types';

/** Maps status (from calculated column) to chip label and Chakra color scheme. */
const STATUS_CONFIG: Record<
  StatusKind,
  { label: string; colorScheme: 'red' | 'orange' | 'green' | 'blue' }
> = {
  'High Priority': { label: 'High Priority', colorScheme: 'red' },
  Warning: { label: 'Warning', colorScheme: 'orange' },
  Completed: { label: 'Completed', colorScheme: 'green' },
  Pending: { label: 'Pending', colorScheme: 'blue' },
};

/** Renders Status column as a colored chip (High Priority / Warning / Completed / Pending). Falls back to Pending for unknown values. */
export function ChipsCellRenderer(props: ICellRendererParams) {
  const value = props.value as StatusKind | string | undefined;
  const status: StatusKind =
    value != null && value in STATUS_CONFIG ? (value as StatusKind) : 'Pending';
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant="solid"
      title={config.label}
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
      {config.label}
    </Badge>
  );
}
