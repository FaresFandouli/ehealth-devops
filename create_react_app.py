#!/usr/bin/env python3
import os

# Créer le dossier frontend dans le répertoire actuel (PDS)
FRONTEND = "pds-frontend"

files = {
    "src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)""",

    "src/App.jsx": """import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App""",

    "src/assets/styles/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  }
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}""",

    "src/context/AuthContext.jsx": """import { createContext, useState, useEffect, useContext } from 'react'
import Keycloak from 'keycloak-js'

const AuthContext = createContext()

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'pds-realm',
  clientId: 'pds-client'
})

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then(authenticated => {
      setAuthenticated(authenticated)
      if (authenticated) {
        loadUserProfile()
      }
      setLoading(false)
    })
  }, [])

  const loadUserProfile = async () => {
    try {
      const profile = await keycloak.loadUserProfile()
      setUser({
        ...profile,
        roles: keycloak.tokenParsed?.realm_access?.roles || []
      })
    } catch (error) {
      console.error('Failed to load user profile', error)
    }
  }

  const login = () => keycloak.login()
  const logout = () => keycloak.logout()
  const getToken = () => keycloak.token

  return (
    <AuthContext.Provider value={{ 
      authenticated, 
      user, 
      loading, 
      login, 
      logout, 
      getToken,
      keycloak 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)""",

    "src/api/axios.config.js": """import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error)
  }
)

export default api""",

    "src/api/clinic.api.js": """import api from './axios.config'

export const patientAPI = {
  getAll: () => api.get('/clinic/patients'),
  getById: (id) => api.get(`/clinic/patients/${id}`),
  create: (data) => api.post('/clinic/patients', data),
  update: (id, data) => api.put(`/clinic/patients/${id}`, data),
  delete: (id) => api.delete(`/clinic/patients/${id}`),
}

export const appointmentAPI = {
  getAll: () => api.get('/clinic/appointments'),
  getById: (id) => api.get(`/clinic/appointments/${id}`),
  create: (data) => api.post('/clinic/appointments', data),
  update: (id, data) => api.put(`/clinic/appointments/${id}`, data),
  delete: (id) => api.delete(`/clinic/appointments/${id}`),
}""",

    "src/routes/AppRoutes.jsx": """import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import Login from '../pages/Auth/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Patients from '../pages/Patients/Patients'
import PatientDetails from '../pages/Patients/PatientDetails'
import Appointments from '../pages/Appointments/Appointments'

const ProtectedRoute = ({ children, roles }) => {
  const { authenticated, user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!authenticated) return <Navigate to="/login" />
  if (roles && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

export default function AppRoutes() {
  const { authenticated, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="appointments" element={<Appointments />} />
      </Route>
    </Routes>
  )
}""",

    "src/components/layout/Layout.jsx": """import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}""",

    "src/components/layout/Header.jsx": """import { useAuth } from '../../context/AuthContext'
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-primary-600">PDS E-Health</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{user?.firstName} {user?.lastName}</span>
          </div>
          <button onClick={logout} className="btn btn-secondary flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}""",

    "src/components/layout/Sidebar.jsx": """import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FileText } from 'lucide-react'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/patients', icon: Users, label: 'Patients' },
  { path: '/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/medical', icon: FileText, label: 'Medical Records' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}""",

    "src/pages/Auth/Login.jsx": """import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, authenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticated) {
      navigate('/dashboard')
    }
  }, [authenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">PDS E-Health</h2>
        <p className="text-gray-600 text-center mb-8">
          Welcome to the E-Health Management System
        </p>
        <button onClick={login} className="btn btn-primary w-full">
          Sign In with Keycloak
        </button>
      </div>
    </div>
  )
}""",

    "src/pages/Dashboard/Dashboard.jsx": """import { useAuth } from '../../context/AuthContext'
import { Users, Calendar, FileText, Activity } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Total Patients', value: '1,234', color: 'bg-blue-500' },
  { icon: Calendar, label: 'Appointments Today', value: '45', color: 'bg-green-500' },
  { icon: FileText, label: 'Medical Records', value: '5,678', color: 'bg-purple-500' },
  { icon: Activity, label: 'Active Cases', value: '89', color: 'bg-orange-500' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.firstName}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}""",

    "src/pages/Patients/Patients.jsx": """import { useQuery } from '@tanstack/react-query'
import { patientAPI } from '../../api/clinic.api'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: patientAPI.getAll
  })

  if (isLoading) return <div>Loading...</div>

  const filteredPatients = patients?.data?.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Phone</th>
              <th className="text-left py-3">Blood Type</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients?.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{patient.firstName} {patient.lastName}</td>
                <td className="py-3">{patient.email}</td>
                <td className="py-3">{patient.phone}</td>
                <td className="py-3">{patient.bloodType}</td>
                <td className="py-3">
                  <button className="text-primary-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}""",

    "src/pages/Patients/PatientDetails.jsx": """export default function PatientDetails() {
  return <div>Patient Details</div>
}""",

    "src/pages/Appointments/Appointments.jsx": """export default function Appointments() {
  return <div>Appointments</div>
}""",

    "package.json": """{
  "name": "pds-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.17.9",
    "axios": "^1.6.5",
    "keycloak-js": "^23.0.4",
    "lucide-react": "^0.312.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.21.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.11"
  }
}""",

    "vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})""",

    "tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}""",

    "postcss.config.js": """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}""",

    "index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PDS E-Health</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>""",

    ".gitignore": """# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?""",

    "README.md": """# PDS E-Health Frontend

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Features

-  Keycloak Authentication
-  Dashboard with Statistics
- Patient Management
- Appointment Scheduling
- Tailwind CSS Styling
- React Query for Data Fetching
""",

    "src/components/common/.gitkeep": "",
    "src/hooks/.gitkeep": "",
    "src/services/.gitkeep": "",
    "src/utils/.gitkeep": "",
}

# Create all files
for filepath, content in files.items():
    full_path = os.path.join(FRONTEND, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"Created: {filepath}")

print("\nReact frontend created successfully in 'pds-frontend' folder!")
print("Location: " + os.path.abspath(FRONTEND))
print("\n Next steps:")
print("   1. cd pds-frontend")
print("   2. npm install")
print("   3. npm run dev")