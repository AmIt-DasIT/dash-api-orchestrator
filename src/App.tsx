
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/layout/Dashboard';
import Home from './pages/Index';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard><Home /></Dashboard>} />
          <Route path="/products" element={<Dashboard><Products /></Dashboard>} />
          <Route path="/categories" element={<Dashboard><Categories /></Dashboard>} />
          <Route path="/users" element={<Dashboard><Users /></Dashboard>} />
          <Route path="/orders" element={<Dashboard><Orders /></Dashboard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
