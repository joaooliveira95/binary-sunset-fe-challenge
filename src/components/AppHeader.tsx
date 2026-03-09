import { Box, Container, Heading, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useColorMode } from '@chakra-ui/react';

export interface AppHeaderProps {
  /** Subtitle / row count label shown below the title. */
  subtitle: string;
  /** Toolbar content (search, buttons, menus). */
  children: React.ReactNode;
}

export function AppHeader({ subtitle, children }: AppHeaderProps) {
  const { toggleColorMode, colorMode } = useColorMode();
  const headerBg = useColorModeValue('white', 'gray.800');
  const headerBorder = useColorModeValue('#e5e5ea', 'gray.700');
  const headingColor = useColorModeValue('#1d1d1f', 'whiteAlpha.900');
  const subtextColor = useColorModeValue('#6e6e73', 'gray.400');

  return (
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
            {subtitle}
          </Text>
          <Box mt={4}>{children}</Box>
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
  );
}
