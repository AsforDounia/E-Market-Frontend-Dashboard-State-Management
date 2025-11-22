import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Menu, Home, ShoppingBag, User, Box, PlusCircle, LogOut, LogIn, UserPlus, Settings, ShoppingCart, Tag, Users, Lock, Package, Store } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname + location.hash === to;

  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-lg px-3 py-2 border border-gray-200", // Lighter border
          isActive && "bg-muted text-foreground",
          className
        )}
      >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {children}
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');
  const isAdminDashboard = location.pathname.startsWith('/admin');
  const isSellerDashboard = location.pathname.startsWith('/seller');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white rounded-r-lg">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="py-4 px-4">
          <nav className="flex flex-col space-y-2">
            <NavItem to="/" icon={Home}>Home</NavItem>
            <NavItem to="/products" icon={ShoppingBag}>Products</NavItem>

            {isAuthenticated && (
              <>
                <Accordion type="single" collapsible defaultValue={isProfilePage ? "profile" : ""} className="w-full">
                  <AccordionItem value="profile">
                    <AccordionTrigger
                      onClick={() => navigate('/profile')}
                      className={cn(
                        "w-full justify-between text-lg font-medium hover:no-underline p-2 rounded-md border border-gray-200",
                        isProfilePage && "bg-muted text-foreground"
                      )}
                    >
                      <div className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Profile
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-1 pl-6 pt-2">
                        <NavItem to="/profile#profile" icon={User}>Mon Profil</NavItem>
                        <NavItem to="/profile#orders" icon={Package}>Mes Commandes</NavItem>
                        <NavItem to="/profile#security" icon={Lock}>Sécurité</NavItem>
                      </div>                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <NavItem to="/products/create" icon={PlusCircle}>Create Product</NavItem>
                <NavItem to="/checkout" icon={ShoppingCart}>Checkout</NavItem>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Accordion type="single" collapsible defaultValue={isAdminDashboard ? "admin" : ""} className="w-full">
                <AccordionItem value="admin">
                  <AccordionTrigger
                    onClick={() => navigate('/admin/dashboard')}
                    className={cn(
                      "w-full text-lg font-medium hover:no-underline p-2 rounded-md border border-gray-200",
                      "flex justify-between items-center",
                      isAdminDashboard && "bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Admin
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-1 pl-6 pt-2">
                      <NavItem to="/admin/products" icon={Box}>Products</NavItem>
                      <NavItem to="/admin/users" icon={Users}>Users</NavItem>
                      <NavItem to="/admin/coupons" icon={Tag}>Coupons</NavItem>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {isAuthenticated && user?.role === 'seller' && (
              <Accordion type="single" collapsible defaultValue={isSellerDashboard ? "seller" : ""} className="w-full">
                <AccordionItem value="seller">
                  <AccordionTrigger
                    onClick={() => navigate('/seller/dashboard')}
                    className={cn(
                      "w-full text-lg font-medium hover:no-underline p-2 rounded-md border border-gray-200",
                      "flex justify-between items-center",
                      isSellerDashboard && "bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <Store className="mr-2 h-5 w-5" />
                      Seller
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-1 pl-6 pt-2">
                      <NavItem to="/seller/products" icon={Box}>Products</NavItem>
                      <NavItem to="/seller/orders" icon={ShoppingCart}>Orders</NavItem>
                      <NavItem to="/seller/coupons" icon={Tag}>Coupons</NavItem>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {!isAuthenticated && (
              <>
                <NavItem to="/login" icon={LogIn}>Login</NavItem>
                <NavItem to="/register" icon={UserPlus}>Register</NavItem>
              </>
            )}

            {isAuthenticated && (
              <NavItem to="/logout" icon={LogOut}>Logout</NavItem>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
