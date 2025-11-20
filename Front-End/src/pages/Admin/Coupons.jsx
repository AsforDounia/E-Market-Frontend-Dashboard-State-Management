import React, { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/couponService';
import Loader from '../../components/common/Loader';
import { Button, Input } from '../../components/common';
import AdminNav from './AdminNav';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: '', minAmount: '', maxDiscount: '', expiresAt: '', isActive: true, usageLimit: '' });
    const [editingCouponId, setEditingCouponId] = useState(null);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getAllCoupons();
            setCoupons(data.data.coupons);
        } catch (err) {
            setError('Failed to fetch coupons.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCoupon((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            await createCoupon(newCoupon);
            setNewCoupon({ code: '', type: 'percentage', value: '', minAmount: '', maxDiscount: '', expiresAt: '', isActive: true, usageLimit: '' });
            fetchCoupons();
        } catch (err) {
            setError('Failed to create coupon.');
        }
    };

    const handleUpdateCoupon = async (id) => {
        try {
            await updateCoupon(id, newCoupon);
            setEditingCouponId(null);
            setNewCoupon({ code: '', type: 'percentage', value: '', minAmount: '', maxDiscount: '', expiresAt: '', isActive: true, usageLimit: '' });
            fetchCoupons();
        } catch (err) {
            setError('Failed to update coupon.');
        }
    };

    const handleDeleteCoupon = async (id) => {
        try {
            await deleteCoupon(id);
            fetchCoupons();
        } catch (err) {
            setError('Failed to delete coupon.');
        }
    };

    const startEditing = (coupon) => {
        setEditingCouponId(coupon._id);
        setNewCoupon({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minAmount: coupon.minAmount,
            maxDiscount: coupon.maxDiscount,
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '', // Format for input type="date"
            isActive: coupon.isActive,
            usageLimit: coupon.usageLimit || '',
        });
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <AdminNav />

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">{editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                <form onSubmit={editingCouponId ? () => handleUpdateCoupon(editingCouponId) : handleCreateCoupon} className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code</label>
                        <Input
                            type="text"
                            id="code"
                            name="code"
                            value={newCoupon.code}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={newCoupon.type}
                            onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Discount Value</label>
                        <Input
                            type="number"
                            id="value"
                            name="value"
                            value={newCoupon.value}
                            onChange={handleInputChange}
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">Minimum Amount</label>
                        <Input
                            type="number"
                            id="minAmount"
                            name="minAmount"
                            value={newCoupon.minAmount}
                            onChange={handleInputChange}
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700">Maximum Discount</label>
                        <Input
                            type="number"
                            id="maxDiscount"
                            name="maxDiscount"
                            value={newCoupon.maxDiscount}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Usage Limit</label>
                        <Input
                            type="number"
                            id="usageLimit"
                            name="usageLimit"
                            value={newCoupon.usageLimit}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                        <Input
                            type="date"
                            id="expiresAt"
                            name="expiresAt"
                            value={newCoupon.expiresAt}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={newCoupon.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active</label>
                    </div>
                    <Button type="submit">{editingCouponId ? 'Update Coupon' : 'Create Coupon'}</Button>
                    {editingCouponId && <Button type="button" variant="secondary" onClick={() => { setEditingCouponId(null); setNewCoupon({ code: '', type: 'percentage', value: '', minAmount: '', maxDiscount: '', expiresAt: '', isActive: true, usageLimit: '' }); }}>Cancel</Button>}
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">All Coupons</h2>
                {coupons.length === 0 ? (
                    <p>No coupons found.</p>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Code</th>
                                <th className="py-2">Discount</th>
                                <th className="py-2">Min Amount</th>
                                <th className="py-2">Max Discount</th>
                                <th className="py-2">Usage Limit</th>
                                <th className="py-2">Expires At</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="text-center">
                                    <td className="py-2">{coupon.code}</td>
                                    <td className="py-2">
                                        {coupon.value}{coupon.type === 'percentage' ? '%' : '$'} ({coupon.type})
                                    </td>
                                    <td className="py-2">${coupon.minAmount}</td>
                                    <td className="py-2">
                                        {coupon.maxDiscount ? `$${coupon.maxDiscount}` : 'N/A'}
                                    </td>
                                    <td className="py-2">
                                        {coupon.usageLimit ? coupon.usageLimit : 'Unlimited'}
                                    </td>
                                    <td className="py-2">
                                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="py-2">
                                        {coupon.isActive ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-2">
                                        <Button onClick={() => startEditing(coupon)} size="sm" className="mr-2">Edit</Button>
                                        <Button onClick={() => handleDeleteCoupon(coupon._id)} size="sm" variant="danger_outline">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
