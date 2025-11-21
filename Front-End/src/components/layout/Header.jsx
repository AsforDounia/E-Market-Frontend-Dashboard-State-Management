import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { Avatar, Button, Dropdown, DropdownItem, LogoWithText } from '../common';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import CartSidebar from '../common/CartSidebar';
import { FcHome, FcShop } from 'react-icons/fc';
import Sidebar from "./Sidebar";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname,
  );

  const isProductPage = location.pathname.startsWith("/product");
  const primaryNav = isProductPage
    ? { to: "/", label: "Accueil", icon: <FcHome /> }
    : { to: "/products", label: "Produits", icon: <FcShop /> };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div>
              <Sidebar />
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600 ml-2"
            >
              <LogoWithText />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex">
              <CartSidebar />
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Dropdown
                  trigger={
                    <Avatar
                      avatarUrl={user?.avatarUrl}
                      fullname={user?.fullname}
                      size="md"
                      className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                  }
                  position="right"
                >
                  <DropdownItem
                    icon={<span className="w-5 h-5">{primaryNav.icon}</span>}
                    onClick={() => (window.location.href = primaryNav.to)}
                  >
                    {primaryNav.label}
                  </DropdownItem>

                  <div className="border-t border-gray-200 my-1" />

                  {location.pathname !== "/profile" && (
                    <DropdownItem
                      icon={<AiOutlineUser className="w-5 h-5" />}
                      onClick={() => (window.location.href = "/profile")}
                    >
                      Mon Profil
                    </DropdownItem>
                  )}

                  <div className="border-t border-gray-200 my-1" />

                  <DropdownItem
                    icon={<AiOutlineLogout className="w-5 h-5" />}
                    onClick={() => dispatch(logout())}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Déconnexion
                  </DropdownItem>
                </Dropdown>
              ) : (
                <>
                  {isAuthPage ? (
                    <Link to="/">
                      <Button size="md" className="flex items-center gap-2">
                        <FcHome />
                        Accueil
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost" size="md">
                          Connexion
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button size="md">Inscription</Button>
                      </Link>
                    </>
                  )}
                  <Link to={primaryNav.to}>
                    <Button size="md" className="flex items-center gap-2">
                      {primaryNav.icon}
                      {primaryNav.label}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center md:hidden gap-2">
              <div className="sm:hidden">
                <CartSidebar />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

