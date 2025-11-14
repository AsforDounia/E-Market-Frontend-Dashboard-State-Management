import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import Alert from "./Alert";
import { FcHome } from "react-icons/fc";
import { AiOutlineLogout } from "react-icons/ai";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [closeAlert, setCloseAlert] = useState(false);
  
  useEffect(() => {
    if (closeAlert) {
      navigate(-1, { replace: true });
    }
  }, [closeAlert, navigate]);
  
  const handleClose = () => {
    setCloseAlert(true);
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
        <div className="relative max-w-md w-full -mt-38">
          <Alert
            type="warning"
            message="Vous êtes déjà authentifié ! Déconnectez-vous pour accéder aux pages d'inscription ou de connexion."
            links={[
              {
                label: "Accueil",
                to: "/",
                icon: <FcHome className="w-5 h-5 inline mr-1" />,
                variant: "primary",
                size: 'sm'
              },
              {
                label: "Déconnexion",
                to: "/logout",
                icon: <AiOutlineLogout className="w-5 h-5 inline mr-1" />,
                variant: "danger",
              },
            ]}
            onClose={handleClose}
          />
        </div>
      </div>
    );
  }

  return children;
};

export default PublicRoute;