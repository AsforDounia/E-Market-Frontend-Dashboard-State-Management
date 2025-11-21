import { Badge, Button } from '../common';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';

const CouponList = ({ coupons, onEdit, onDelete, onToggleStatus, onViewStats }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  const getStatusBadge = (coupon) => {
    if (coupon.isActive) return <Badge variant="success">Actif</Badge>;
    return <Badge variant="danger">Expiré</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valeur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coupons.map((coupon) => (
            <tr key={coupon._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {coupon.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coupon.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coupon.value}{coupon.type === 'percentage' ? '%' : '€'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(coupon.expiresAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(coupon)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewStats(coupon)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <AiOutlineEye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(coupon)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <AiOutlineEdit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(coupon)}
                  className={coupon.isActive ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                >
                  {coupon.isActive ? 'Désactiver' : 'Activer'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(coupon)}
                  className="text-red-600 hover:text-red-900"
                >
                  <AiOutlineDelete className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponList;