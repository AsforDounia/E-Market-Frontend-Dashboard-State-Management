import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const SellerNav = () => {
    const navItems = [
        { to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/seller/products", label: "Mes Produits", icon: Package },
        { to: "/seller/orders", label: "Mes Commandes", icon: ShoppingCart },
        { to: "/seller/coupons", label: "Mes Coupons", icon: Tag },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default SellerNav;
