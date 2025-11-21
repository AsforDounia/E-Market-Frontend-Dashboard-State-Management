import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FcHome } from "react-icons/fc";
import { AiOutlineLogout } from "react-icons/ai";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={() => navigate(-1)} />
        <div className="relative max-w-md w-full">
          <Alert>
            <AlertTitle>Accès non autorisé</AlertTitle>
            <AlertDescription>
              Vous êtes déjà authentifié ! Déconnectez-vous pour accéder à cette page.
            </AlertDescription>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => navigate("/")}><FcHome className="mr-2" /> Accueil</Button>
              <Button variant="destructive" onClick={() => navigate("/logout")}><AiOutlineLogout className="mr-2" /> Déconnexion</Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return children;
};

export default PublicRoute;
