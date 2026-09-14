import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { seedDatabase } from './services/mockApi/seed'
import { clearSession } from './services/mockApi/authApi'


seedDatabase()

// Dev convenience: always land on /login on a fresh `npm run dev` load
// instead of picking up whatever session was left over from earlier
// testing. Guarded by DEV so a production build keeps real persisted
// sessions across reloads.
if (import.meta.env.DEV) {
  clearSession()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
