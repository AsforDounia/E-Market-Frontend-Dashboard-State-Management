import React, { useState, useEffect } from 'react';
import { getPendingProducts, validateProduct, rejectProduct, deleteProduct } from '../../services/productService';
import Loader from '../../components/common/Loader';
import { Button } from '../../components/common';
import AdminNav from './AdminNav';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingProducts = async () => {
        try {
            setLoading(true);
            const data = await getPendingProducts();
            setProducts(data.data.products);
        } catch (err) {
            setError('Failed to fetch pending products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const handleValidate = async (id) => {
        try {
            await validateProduct(id);
            fetchPendingProducts();
        } catch (err) {
            setError('Failed to validate product.');
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectProduct(id);
            fetchPendingProducts();
        } catch (err) {
            setError('Failed to reject product.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            fetchPendingProducts();
        } catch (err) {
            setError('Failed to delete product.');
        }
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
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Pending Products</h2>
                {products.length === 0 ? (
                    <p>No pending products.</p>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Seller</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="text-center">
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">{product.seller?.fullname}</td>
                                    <td className="py-2">${product.price}</td>
                                    <td className="py-2">
                                        <Button onClick={() => handleValidate(product.id)} size="sm" className="mr-2">Validate</Button>
                                        <Button onClick={() => handleReject(product.id)} size="sm" variant="danger" className="mr-2">Reject</Button>
                                        <Button onClick={() => handleDelete(product.id)} size="sm" variant="danger_outline">Delete</Button>
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

export default AdminProducts;
