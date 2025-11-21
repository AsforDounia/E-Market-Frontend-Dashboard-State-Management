import { Routes, Route } from 'react-router-dom';
import Products from '../pages/Products';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import PublicRoute from '../components/common/PublicRoute';
import PrivateRoute from '../components/common/PrivateRoute';
import { useAuth } from '../hooks/useAuth';
import Logout from '../pages/Logout';
import ProtectedRoutes from '../components/common/ProtectedRoute';
import ProductDetails from '../pages/ProductDetails';
import Home from '../pages/Home';

import CouponManagement from '../pages/admin/CouponManagement';
import SellerDashboard from '../pages/seller/SellerDashboard';
import { ROLES } from '../constants/roles';

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
      </Route>

      {/* Admin routes */}
  
      <Route path="/admin/coupons" element={
        <PrivateRoute allowedRoles={[ROLES.ADMIN]}>
          <CouponManagement />
        </PrivateRoute>
      } />

      {/* Seller routes */}
      <Route path="/seller/dashboard" element={
        <PrivateRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN]}>
          <SellerDashboard />
        </PrivateRoute>
      } />
      
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;