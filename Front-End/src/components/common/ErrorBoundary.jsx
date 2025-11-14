import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from './index';

const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{error.status}</h1>
          <p className="text-gray-600 mb-6">{error.statusText || error.data}</p>
          <Button onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Erreur</h1>
        <p className="text-gray-600 mb-6">Une erreur inattendue s'est produite</p>
        <Button onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;