import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Menu, Home, ShoppingBag, User, Box, PlusCircle, LogOut, LogIn, UserPlus, Settings, ShoppingCart, Tag, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Button
        variant="outline" // Changed to outline for more pop
        className={cn(
          "justify-start text-lg", // Removed w-full
          isActive && "bg-muted text-foreground"
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
  const isAdminDashboard = location.pathname.startsWith('/admin');

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
          <nav className="flex flex-col space-y-1">
            <NavItem to="/" icon={Home}>Home</NavItem>
            <NavItem to="/products" icon={ShoppingBag}>Products</NavItem>

            {isAuthenticated && (
              <>
                <NavItem to="/profile" icon={User}>Profile</NavItem>
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
                      "w-full text-lg font-medium hover:no-underline p-2 rounded-md",
                      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
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
                    <div className="flex flex-col space-y-1 pl-6">
                      <NavItem to="/admin/products" icon={Box}>Products</NavItem>
                      <NavItem to="/admin/users" icon={Users}>Users</NavItem>
                      <NavItem to="/admin/coupons" icon={Tag}>Coupons</NavItem>
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
