import { Link } from "react-router-dom";
import { Button } from "../components/common";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Page non trouvée
        </h2>
        <p className="mt-2 text-gray-600">
          La page que vous recherchez n'existe pas.
        </p>
        <Link to="/">
          <Button size="lg" className="mt-6">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
