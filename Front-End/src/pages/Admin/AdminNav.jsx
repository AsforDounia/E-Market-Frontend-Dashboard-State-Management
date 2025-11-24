import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminNav = () => {
    const getNavLinkClasses = (isActive) =>
        cn(
            "text-sm font-medium",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
        );

    return (
        <nav className="flex space-x-4 mb-8">
            <Button asChild variant="ghost">
                <NavLink to="/admin/dashboard" className={({ isActive }) => getNavLinkClasses(isActive)}>
                    Dashboard
                </NavLink>
            </Button>
            <Button asChild variant="ghost">
                <NavLink to="/admin/products" className={({ isActive }) => getNavLinkClasses(isActive)}>
                    Products
                </NavLink>
            </Button>
            <Button asChild variant="ghost">
                <NavLink to="/admin/users" className={({ isActive }) => getNavLinkClasses(isActive)}>
                    Users
                </NavLink>
            </Button>
            <Button asChild variant="ghost">
                <NavLink to="/admin/coupons" className={({ isActive }) => getNavLinkClasses(isActive)}>
                    Coupons
                </NavLink>
            </Button>
            <Button asChild variant="ghost">
                <NavLink to="/admin/orders" className={({ isActive }) => getNavLinkClasses(isActive)}>
                    Orders
                </NavLink>
            </Button>
        </nav>
    );
};

export default AdminNav;
