import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { isSeller } = useRole();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tableau de bord Vendeur
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Bienvenue, {user?.fullname}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Mes produits</h3>
              <p className="text-blue-700">Gérer vos produits</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Mes ventes</h3>
              <p className="text-green-700">Suivre vos commandes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;