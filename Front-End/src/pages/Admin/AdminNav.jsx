import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNav = () => {
    const navLinkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-md text-sm font-medium ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <nav className="flex space-x-4 mb-8">
            <NavLink to="/admin/dashboard" className={navLinkClasses}>
                Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClasses}>
                Products
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClasses}>
                Users
            </NavLink>
            <NavLink to="/admin/coupons" className={navLinkClasses}>
                Coupons
            </NavLink>
        </nav>
    );
};

export default AdminNav;
