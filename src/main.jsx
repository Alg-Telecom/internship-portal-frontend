import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

// One shared cache for every useQuery call in the app. refetchOnWindowFocus
// is turned off because it was re-fetching (and briefly flashing loading
// states) every time you tabbed back into the browser while testing —
// data still updates normally through each page's own refetch() calls
// after a mutation.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
