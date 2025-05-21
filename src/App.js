import { ChakraProvider, Spinner, Center } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Guidelines from './pages/Guidelines'
import About from './pages/About'
import HospitalRegister from './pages/HospitalRegister'
import HospitalLogin from './pages/HospitalLogin'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserRegister from './pages/UserRegister'
import UserLogin from './pages/UserLogin'
import UserDashboard from './pages/UserDashboard'

function AppRoutes() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="green.500" />
      </Center>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/about" element={<About />} />
          
          {/* Hospital routes */}
          <Route path="/hospital-register" element={<HospitalRegister />} />
          <Route path="/hospital-login" element={<HospitalLogin />} />
          
          {/* User routes */}
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin">
            <Route path="login" element={<AdminLogin />} />
            <Route path="dashboard/*" element={<AdminDashboard />} />
            {/* Redirect /admin to /admin/login */}
            <Route index element={<Navigate to="/admin/login" replace />} />
          </Route>

          {/* Redirect /admin-login to /admin/login */}
          <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App 