import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
    };

    handleLogout();
  }, [logout]);

  return null;
};

export default Logout;
