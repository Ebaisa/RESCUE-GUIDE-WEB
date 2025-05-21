import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  Image,
  HStack,
  Tooltip,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Add base URL for the backend
const API_BASE_URL = 'http://localhost:8000' // Update this to match your backend URL

// Development CORS proxy
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

// Configure axios defaults
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.timeout = 10000; // 10 seconds timeout

function HospitalRegister() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    latitude: '',
    longitude: '',
    password: '',
    photo: null
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  const getLocation = () => {
    setIsLocating(true)
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }))
        toast({
          title: 'Location Found',
          description: 'Your location has been automatically filled',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setIsLocating(false)
      },
      (error) => {
        let message = 'Error getting location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Please allow location access to automatically fill coordinates'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            message = 'Location request timed out'
            break
          default:
            message = 'An unknown error occurred'
        }
        toast({
          title: 'Location Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.latitude) newErrors.latitude = 'Latitude is required'
    if (!formData.longitude) newErrors.longitude = 'Longitude is required'
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.photo) newErrors.photo = 'Photo is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Submitting form data:', {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        latitude: formData.latitude,
        longitude: formData.longitude,
        // Don't log password for security
        photoName: formData.photo?.name
      })

      const formDataToSend = new FormData()
      formDataToSend.append('photo', formData.photo)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('phoneNumber', formData.phoneNumber)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('latitude', formData.latitude)
      formDataToSend.append('longitude', formData.longitude)
      formDataToSend.append('password', formData.password)

      // Use CORS proxy in development
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? `${CORS_PROXY}${API_BASE_URL}/Hospital-register/`
        : `${API_BASE_URL}/Hospital-register/`

      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        withCredentials: false,
      })

      console.log('Registration response:', response.data) // Add this for debugging

      if (response.data.status === 200) {
        toast({
          title: 'Registration Successful',
          description: 'Your hospital has been registered successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        navigate('/hospital-login')
      } else {
        throw new Error(response.data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      })
      
      let errorMessage = 'An error occurred during registration.'
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please check your connection and try again.'
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message
      }

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading>Hospital Registration</Heading>
          
          <FormControl isInvalid={errors.name}>
            <FormLabel>Hospital Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter hospital name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.phoneNumber}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.latitude || errors.longitude}>
            <FormLabel>Location</FormLabel>
            <HStack spacing={2} align="flex-start">
              <Box flex="1">
                <Input
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="Latitude"
                  isReadOnly
                />
                <FormErrorMessage>{errors.latitude}</FormErrorMessage>
              </Box>
              <Box flex="1">
                <Input
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Longitude"
                  isReadOnly
                />
                <FormErrorMessage>{errors.longitude}</FormErrorMessage>
              </Box>
              <Tooltip label="Get current location">
                <Button
                  onClick={getLocation}
                  isLoading={isLocating}
                  loadingText="Locating..."
                  colorScheme="blue"
                >
                  📍 Get Location
                </Button>
              </Tooltip>
            </HStack>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.photo}>
            <FormLabel>Hospital Photo</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              p={1}
            />
            <FormErrorMessage>{errors.photo}</FormErrorMessage>
          </FormControl>

          {previewImage && (
            <Box>
              <Image
                src={previewImage}
                alt="Preview"
                maxH="200px"
                objectFit="contain"
              />
            </Box>
          )}

          <Button
            colorScheme="green"
            width="full"
            type="submit"
            isLoading={isLoading}
            loadingText="Registering..."
          >
            Register Hospital
          </Button>
        </VStack>
      </Box>
    </Container>
  )
}

export default HospitalRegister 