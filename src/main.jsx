import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { seedDatabase } from './services/mockApi/seed'
import { clearSession } from './services/mockApi/authApi'


seedDatabase()


if (import.meta.env.DEV) {
  clearSession()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
