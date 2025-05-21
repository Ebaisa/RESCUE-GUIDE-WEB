import React from 'react';
import { Container, Heading, Text, Box, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

function AdminDashboard() {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>Admin Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stat>
            <StatLabel>Total Hospitals</StatLabel>
            <StatNumber>25</StatNumber>
          </Stat>
        </Box>
        <Box p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stat>
            <StatLabel>Active Users</StatLabel>
            <StatNumber>150</StatNumber>
          </Stat>
        </Box>
        <Box p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stat>
            <StatLabel>Total Beds</StatLabel>
            <StatNumber>500</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>
      <Box mt={10}>
        <Text fontSize="lg">Welcome to the admin dashboard. Here you can manage hospitals, users, and monitor system activity.</Text>
      </Box>
    </Container>
  );
}

export default AdminDashboard; 