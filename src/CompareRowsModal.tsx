import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
} from '@chakra-ui/react';
import type { GridRow } from './types';
import { getRowCalculations } from './calculations/rowCalculations';

/** Human-readable labels for compare table columns. */
const FIELD_LABELS: Record<string, string> = {
  id: 'ID',
  name: 'Name',
  category: 'Category',
  revenue: 'Revenue',
  cost: 'Cost',
  quantity: 'Qty',
  active: 'Active',
  profit: 'Profit',
  marginPercent: 'Margin %',
  status: 'Status',
};

function getDisplayValue(row: GridRow, field: string): string | number | boolean {
  if (field === 'profit') return getRowCalculations(row).profit;
  if (field === 'marginPercent') return getRowCalculations(row).marginPercent;
  if (field === 'status') return getRowCalculations(row).status;
  if (field === 'active') return row.active;
  const v = (row as unknown as Record<string, unknown>)[field];
  if (v === undefined || v === null) return '—';
  return v as string | number | boolean;
}

function formatValue(value: string | number | boolean, field: string): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    const numStr = Number.isInteger(value) ? String(value) : value.toFixed(2);
    return field === 'marginPercent' ? numStr + '%' : numStr;
  }
  return String(value);
}

interface CompareRowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: GridRow[];
}

/** Modal that shows two selected rows side-by-side with field-by-field comparison; differing values are highlighted. */
export function CompareRowsModal({ isOpen, onClose, rows }: CompareRowsModalProps) {
  const diffBg = useColorModeValue('orange.100', 'orange.900');
  const fields = [
    'id',
    'name',
    'category',
    'revenue',
    'cost',
    'quantity',
    'active',
    'profit',
    'marginPercent',
    'status',
  ];

  if (rows.length < 2) return null;

  const rowA = rows[0]!;
  const rowB = rows[1]!;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Compare rows</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <TableContainer>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th w="180px">Field</Th>
                  <Th>{rowA.name} ({rowA.id})</Th>
                  <Th>{rowB.name} ({rowB.id})</Th>
                </Tr>
              </Thead>
              <Tbody>
                {fields.map((field) => {
                  const valA = getDisplayValue(rowA, field);
                  const valB = getDisplayValue(rowB, field);
                  const same = valA === valB;
                  const label = FIELD_LABELS[field] ?? field;

                  return (
                    <Tr key={field}>
                      <Td fontWeight="medium">{label}</Td>
                      <Td bg={same ? undefined : diffBg}>{formatValue(valA, field)}</Td>
                      <Td bg={same ? undefined : diffBg}>{formatValue(valB, field)}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
