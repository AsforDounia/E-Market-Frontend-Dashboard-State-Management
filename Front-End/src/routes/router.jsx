import { createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Logout from '../pages/Logout';
import NotFound from '../pages/NotFound';
import ErrorBoundary from '../components/common/ErrorBoundary';
import PublicRoute from '../components/common/PublicRoute';
import ProtectedRoutes from '../components/common/ProtectedRoute';
import { productsLoader, productDetailsLoader } from '../loaders/productLoaders';
import { profileLoader } from '../loaders/userLoaders';

const AppLayout = () => (
  <AuthProvider>
    <Layout />
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'products',
        element: <Products />,
        loader: productsLoader,
        errorElement: <ErrorBoundary />
      },
      {
        path: 'product/:slug',
        element: <ProductDetails />,
        loader: productDetailsLoader,
        errorElement: <ErrorBoundary />
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'login',
            element: <Login />
          }
        ]
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: 'profile',
            element: <Profile />,
            loader: profileLoader,
            errorElement: <ErrorBoundary />
          },
          {
            path: 'logout',
            element: <Logout />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);