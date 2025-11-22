import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { LogoWithText } from '../common';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import CartSidebar from '../common/CartSidebar';
import { FcHome, FcShop } from 'react-icons/fc';
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, UserPlus, Home } from "lucide-react"; // Added Home

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
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="block">
                    <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                      <AvatarImage src={user?.avatarUrl} alt={user?.fullname} />
                      <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              ) : (
                <>
                  {isAuthPage ? (
                    <Link to="/">
                      <Button size="md" className="flex items-center gap-2 px-4 py-2">
                        <Home className="w-5 h-5" />
                        Accueil
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost" size="md" className="flex items-center gap-2 px-4 py-2">
                          <LogIn className="w-5 h-5" />
                          Connexion
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button size="md" className="flex items-center gap-2 px-4 py-2">
                          <UserPlus className="w-5 h-5" />
                          Inscription
                        </Button>
                      </Link>
                    </>
                  )}
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

