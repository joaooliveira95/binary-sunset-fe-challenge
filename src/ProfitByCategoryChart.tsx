import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { GridRow } from './types';
import { getProfit } from './calculations/rowCalculations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfitByCategoryChartProps {
  isOpen: boolean;
  onClose: () => void;
  rows: GridRow[];
}

export function ProfitByCategoryChart({ isOpen, onClose, rows }: ProfitByCategoryChartProps) {
  const barBg = useColorModeValue('rgba(59, 130, 246, 0.6)', 'rgba(96, 165, 250, 0.6)');
  const barBorder = useColorModeValue('rgb(59, 130, 246)', 'rgb(96, 165, 250)');

  const byCategory = rows.reduce<Record<string, number>>((acc, row) => {
    const cat = row.category;
    acc[cat] = (acc[cat] ?? 0) + getProfit(row);
    return acc;
  }, {});

  const labels = Object.keys(byCategory).sort();
  const data = labels.map((k) => byCategory[k] ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Profit',
        data,
        backgroundColor: barBg,
        borderColor: barBorder,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) =>
            `Profit: ${Number(ctx.raw).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) =>
            typeof value === 'number' ? value.toLocaleString() : value,
        },
      },
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profit by category</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box h="320px">
            <Bar data={chartData} options={options} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
