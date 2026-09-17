import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PageTitleProvider } from './context/PageTitleContext';
import { LanguageProvider } from './context/LanguageContext';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <PageTitleProvider>
              <AppRoutes />
            </PageTitleProvider>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
