import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  VStack,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.post('/api/admin/login', formData);
      
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin dashboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred during login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading>Admin Login</Heading>
          
          <FormControl isInvalid={errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="green"
            width="full"
            type="submit"
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default AdminLogin; 