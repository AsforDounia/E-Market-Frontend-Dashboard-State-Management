import React, { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/couponService';
import Loader from '../../components/common/Loader';
import { Button, Input } from '../../components/common';
import AdminNav from './AdminNav';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expirationDate: '' });
    const [editingCouponId, setEditingCouponId] = useState(null);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getAllCoupons();
            setCoupons(data.data);
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
        const { name, value } = e.target;
        setNewCoupon((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            await createCoupon(newCoupon);
            setNewCoupon({ code: '', discount: '', expirationDate: '' });
            fetchCoupons();
        } catch (err) {
            setError('Failed to create coupon.');
        }
    };

    const handleUpdateCoupon = async (id) => {
        try {
            await updateCoupon(id, newCoupon);
            setEditingCouponId(null);
            setNewCoupon({ code: '', discount: '', expirationDate: '' });
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
        setEditingCouponId(coupon.id);
        setNewCoupon({
            code: coupon.code,
            discount: coupon.discount,
            expirationDate: coupon.expirationDate.split('T')[0], // Format for input type="date"
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
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
                        <Input
                            type="number"
                            id="discount"
                            name="discount"
                            value={newCoupon.discount}
                            onChange={handleInputChange}
                            required
                            min="1"
                            max="100"
                        />
                    </div>
                    <div>
                        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                        <Input
                            type="date"
                            id="expirationDate"
                            name="expirationDate"
                            value={newCoupon.expirationDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <Button type="submit">{editingCouponId ? 'Update Coupon' : 'Create Coupon'}</Button>
                    {editingCouponId && <Button type="button" variant="secondary" onClick={() => { setEditingCouponId(null); setNewCoupon({ code: '', discount: '', expirationDate: '' }); }}>Cancel</Button>}
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
                                <th className="py-2">Expiration Date</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="text-center">
                                    <td className="py-2">{coupon.code}</td>
                                    <td className="py-2">{coupon.discount}%</td>
                                    <td className="py-2">{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                                    <td className="py-2">
                                        <Button onClick={() => startEditing(coupon)} size="sm" className="mr-2">Edit</Button>
                                        <Button onClick={() => handleDeleteCoupon(coupon.id)} size="sm" variant="danger_outline">Delete</Button>
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
