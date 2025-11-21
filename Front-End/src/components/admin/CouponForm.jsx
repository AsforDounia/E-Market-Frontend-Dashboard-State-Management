import { useState } from 'react';
import { Input, Button, Alert } from '../common';

const CouponForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    type: initialData?.type || 'percentage',
    value: initialData?.value || '',
    minAmount: initialData?.minAmount || 0,
    maxDiscount: initialData?.maxDiscount || '',
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : '',
    usageLimit: initialData?.usageLimit || '',
    isActive: initialData?.isActive ?? true
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.code || !formData.value || !formData.expiresAt) {
      setError('Code, valeur et date d\'expiration sont requis');
      return;
    }

    if (formData.type === 'percentage' && (formData.value < 1 || formData.value > 99)) {
      setError('Pour le type pourcentage, la valeur doit être entre 1 et 99');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Code du coupon"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="SAVE20"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de réduction
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Pourcentage</option>
            <option value="fixed">Montant fixe</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={`Valeur ${formData.type === 'percentage' ? '(%)' : '(€)'}`}
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          min={formData.type === 'percentage' ? 1 : 0}
          max={formData.type === 'percentage' ? 99 : undefined}
          required
        />
        
        <Input
          label="Montant minimum (€)"
          name="minAmount"
          type="number"
          value={formData.minAmount}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Réduction maximale (€)"
          name="maxDiscount"
          type="number"
          value={formData.maxDiscount}
          onChange={handleChange}
          min="0"
        />
        
        <Input
          label="Limite d'utilisation"
          name="usageLimit"
          type="number"
          value={formData.usageLimit}
          onChange={handleChange}
          min="1"
        />
      </div>

      <Input
        label="Date d'expiration"
        name="expiresAt"
        type="date"
        value={formData.expiresAt}
        onChange={handleChange}
        required
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Coupon actif
        </label>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {initialData ? 'Modifier' : 'Créer'} le coupon
      </Button>
    </form>
  );
};

export default CouponForm;