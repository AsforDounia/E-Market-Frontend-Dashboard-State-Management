import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { Avatar, Button, Dropdown, DropdownItem, LogoWithText } from '../common';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import CartSidebar from '../common/CartSidebar';
import { FiMenu, FiX } from 'react-icons/fi';
import { FcHome, FcShop } from 'react-icons/fc';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  // show "Accueil" when on any /product* page (e.g. /product/:slug), otherwise show "Produits"
  const isProductPage = location.pathname.startsWith("/product");
  const primaryNav = isProductPage
    ? { to: "/", label: "Accueil", icon: <FcHome /> }
    : { to: "/products", label: "Produits", icon: <FcShop /> };

  return (
    <header className="bg-white shadow-md sticky top-0 z-60">
      <nav
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${mobileOpen ? "opacity-40 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100"}`}
      >
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600"
              onClick={closeMobile}
            >
              <LogoWithText />
            </Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* cart */}
            <div className="hidden sm:flex">
              <CartSidebar />
            </div>

            {/* Desktop: auth / buttons */}
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
                  {/* Use primaryNav inside dropdown as well */}
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
                  <Link to={primaryNav.to} onClick={closeMobile}>
                    <Button size="md" className="flex items-center gap-2">
                      {primaryNav.icon}
                      {primaryNav.label}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile cart and hamburger */}
            <div className="flex items-center md:hidden gap-2">
              <div className="sm:hidden">
                {/* small screen cart (icon only) */}
                <CartSidebar />
              </div>

              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                {mobileOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
        className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 ${mobileOpen ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Mobile menu panel */}
      <div
        className={`md:hidden transition-transform origin-top shadow-lg bg-white relative z-50 ${mobileOpen ? "max-h-[90vh] ease-out border-t" : "max-h-0 overflow-hidden ease-in"}`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 pt-4 pb-6">
          <div className="flex flex-col gap-3">
            {/* primary nav on mobile */}
            <Link
              to={primaryNav.to}
              className="block text-gray-800 rounded hover:"
              onClick={closeMobile}
            >
              <Button
                fullWidth
                className="flex items-center gap-2 justify-center"
              >
                <span className="text-xl">{primaryNav.icon}</span>
                <span>{primaryNav.label}</span>
              </Button>
            </Link>

            {/* Mobile auth area */}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMobile}>
                  <Button
                    fullWidth
                    className="flex items-center gap-2 justify-center"
                  >
                    Voir le profil
                  </Button>
                </Link>
                <Button
                  fullWidth
                  className="flex items-center gap-2 justify-center"
                  variant="danger"
                  onClick={() => {
                    dispatch(logout());
                    closeMobile();
                  }}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button fullWidth onClick={closeMobile}>
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button fullWidth variant="outline" onClick={closeMobile}>
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

