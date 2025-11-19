import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  LogoWithText,
} from "../common";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FcHome } from "react-icons/fc";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname,
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              <LogoWithText />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              <AiOutlineShoppingCart className="w-6 h-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
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
                  {location.pathname === "/profile" ? (
                    <DropdownItem
                      icon={<FcHome className="w-5 h-5" />}
                      onClick={() => (window.location.href = "/")}
                    >
                      Accueil
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      icon={<AiOutlineUser className="w-5 h-5" />}
                      onClick={() => (window.location.href = "/profile")}
                    >
                      Mon Profil
                    </DropdownItem>
                  )}
                  <div className="border-t border-gray-200 my-1"></div>

                  <DropdownItem
                    icon={<AiOutlineLogout className="w-5 h-5" />}
                    onClick={() => (window.location.href = "/logout")}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Déconnexion
                  </DropdownItem>
                </Dropdown>
              </>
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
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
