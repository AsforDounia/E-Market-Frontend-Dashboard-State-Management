import { NavLink } from "react-router-dom";

const SellerNav = () => {
    const getNavLinkClasses = (isActive) =>
        `px-4 py-2 rounded-lg transition-colors ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <nav className="bg-white shadow-sm mb-6">
            <div className="container mx-auto px-5">
                <div className="flex items-center gap-4 py-4 overflow-x-auto">
                    <NavLink
                        to="/seller/dashboard"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/seller/products"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Mes Produits
                    </NavLink>
                    <NavLink
                        to="/seller/orders"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Mes Commandes
                    </NavLink>
                    <NavLink
                        to="/seller/coupons"
                        className={({ isActive }) => getNavLinkClasses(isActive)}
                    >
                        Mes Coupons
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default SellerNav;
