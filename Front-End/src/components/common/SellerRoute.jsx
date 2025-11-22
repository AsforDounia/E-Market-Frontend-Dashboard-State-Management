import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const SellerRoute = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "seller" && user.role !== "admin") {
        return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />;
};

export default SellerRoute;
