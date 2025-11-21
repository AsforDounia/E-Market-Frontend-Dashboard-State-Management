import { Card } from '../common';

const CouponStats = ({ coupons }) => {
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.isActive).length;
  const expiredCoupons = coupons.filter(c => !c.isActive).length;

  const stats = [
    {
      title: 'Total des coupons',
      value: totalCoupons,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Coupons actifs',
      value: activeCoupons,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Coupons expirés',
      value: expiredCoupons,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
              <div className={`w-6 h-6 ${stat.color} rounded`}></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className={`text-2xl font-semibold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CouponStats;