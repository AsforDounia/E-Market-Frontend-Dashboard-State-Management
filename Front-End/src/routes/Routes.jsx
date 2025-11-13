import { Routes, Route } from 'react-router-dom';
import Products from '../pages/Products';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import PublicRoute from '../components/common/PublicRoute';
import { useAuth } from '../hooks/useAuth';
import Logout from '../pages/Logout';
import ProtectedRoutes from '../components/common/ProtectedRoute';
import ProductDetails from '../pages/ProductDetails';
import Home from '../pages/Home';
import CreateProduct from '../pages/CreateProduct';
// Import PrivateRoute if you have one for protected routes

const AppRoutes = () => {
  const {logout} = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      {/* <Route path="product/:id" element={<ProductDetails />} /> */}
      <Route path="product/:slug" element={<ProductDetails />} />

      {/* Public routes - redirect if authenticated */}
      <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>}/>
      <Route path="/register" element={ <PublicRoute> <Register /> </PublicRoute>}/>
      

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="profile" element={<Profile />} />
        <Route path="logout" element={<Logout />} />
        <Route path="products/create" element={<CreateProduct />} />
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;