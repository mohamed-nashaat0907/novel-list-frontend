import './App.css';
import { RouterProvider } from 'react-router-dom';
import Mainroutes from './routes/Mainroutes.tsx';
import AuthProvider from './context/AuthProvider.tsx';
import AuthCartProvider from './context/AuthCartProvider.tsx';
import AuthWhislistProvider from './context/AuthWhislistProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategoryProvider from './context/CategoryProvider.tsx';

const queryClient = new QueryClient();


function App() {
  // const router = Mainroutes; // ✅ تنفيذ الدالة

  return (

    < QueryClientProvider client={queryClient}>
      <CategoryProvider>
        <AuthProvider>
          <AuthCartProvider>
            <AuthWhislistProvider>
              <RouterProvider router={Mainroutes} />
            </AuthWhislistProvider>
          </AuthCartProvider>
        </AuthProvider>
      </CategoryProvider>
    </QueryClientProvider>
  );
}

export default App;
