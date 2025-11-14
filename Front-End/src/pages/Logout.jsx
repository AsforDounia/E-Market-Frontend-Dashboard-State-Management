import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await dispatch(logout());
      navigate("/");
    };

    handleLogout();
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
