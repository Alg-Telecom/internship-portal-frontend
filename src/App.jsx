import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PageTitleProvider } from './context/PageTitleContext';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PageTitleProvider>
            <AppRoutes />
          </PageTitleProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
