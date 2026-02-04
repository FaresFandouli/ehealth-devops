#!/usr/bin/env python3
import os
import shutil

FRONTEND = "pds-frontend"

print("🔧 Removing Keycloak integration...")

# 1. Updated AuthContext without Keycloak
auth_context_content = """import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Mock user - pas de Keycloak pour le moment
  const [authenticated] = useState(true)
  const [user] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roles: ['doctor', 'admin']
  })
  const [loading] = useState(false)

  const login = () => {
    console.log('Login function - Keycloak disabled')
  }
  
  const logout = () => {
    console.log('Logout function - Keycloak disabled')
  }
  
  const getToken = () => 'mock-token'

  return (
    <AuthContext.Provider value={{ 
      authenticated, 
      user, 
      loading, 
      login, 
      logout, 
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
"""

# 2. Simplified AppRoutes
app_routes_content = """import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Login from '../pages/Auth/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Patients from '../pages/Patients/Patients'
import PatientDetails from '../pages/Patients/PatientDetails'
import Appointments from '../pages/Appointments/Appointments'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="appointments" element={<Appointments />} />
      </Route>
    </Routes>
  )
}
"""

# 3. Simplified Login page
login_content = """import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // Redirection directe vers le dashboard
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">PDS E-Health</h2>
        <p className="text-gray-600 text-center mb-8">
          Welcome to the E-Health Management System
        </p>
        <button onClick={handleLogin} className="btn btn-primary w-full">
          Enter Dashboard (Demo Mode)
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Keycloak authentication disabled for preview
        </p>
      </div>
    </div>
  )
}
"""

# 4. Updated main.jsx without StrictMode
main_content = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
"""

# Write files
files_to_update = {
    "src/context/AuthContext.jsx": auth_context_content,
    "src/routes/AppRoutes.jsx": app_routes_content,
    "src/pages/Auth/Login.jsx": login_content,
    "src/main.jsx": main_content,
}

for filepath, content in files_to_update.items():
    full_path = os.path.join(FRONTEND, filepath)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Updated: {filepath}")

print("\n" + "="*60)
print("✅ Keycloak removed successfully!")
print("="*60)
print("\nNow you can see the design without authentication issues!")
print("\nRun:")
print("   cd pds-frontend")
print("   npm run dev")
print("\nThen open: http://localhost:3000")
print("="*60)
