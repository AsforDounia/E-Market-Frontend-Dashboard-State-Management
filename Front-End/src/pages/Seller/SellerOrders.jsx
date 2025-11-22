import React, { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '../../services/orderService';
import { toast } from 'react-toastify';
import SellerNav from './SellerNav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useSelector } from 'react-redux';
import { Eye, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrdersTable = ({ orders, handleStatusChange }) => {
    if (orders.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Aucune commande trouvée.</p>
                <p className="text-sm text-gray-400">Les commandes de vos produits apparaîtront ici.</p>
            </div>
        );
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order._id}>
                        <TableCell className="font-mono text-xs">{order._id.slice(-8).toUpperCase()}</TableCell>
                        <TableCell>{order.userId?.fullname || 'Client inconnu'}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{order.totalAmount?.toFixed(2)} €</TableCell>
                        <TableCell>
                            <Select
                                defaultValue={order.status}
                                onValueChange={(value) => handleStatusChange(order._id, value)}
                            >
                                <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="processing">En traitement</SelectItem>
                                    <SelectItem value="shipped">Expédié</SelectItem>
                                    <SelectItem value="delivered">Livré</SelectItem>
                                    <SelectItem value="cancelled">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right">
                            <Link to={`/orders/${order._id}`}>
                                <Button size="sm" variant="outline">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Détails
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [metadata, setMetadata] = useState(null);
    const { user } = useSelector((state) => state.auth);

    const fetchOrders = async (page) => {
        try {
            setLoading(true);
            // Assuming we can filter orders by sellerId or the backend handles it for seller role
            const filters = {
                page,
                limit: 10,
                // sellerId: user._id // Uncomment if backend requires explicit sellerId
            };
            const data = await getOrders(filters);
            // If the API returns all orders, we might need to filter client side if backend doesn't support seller filtering yet
            // But for now let's assume it returns relevant orders
            setOrders(data.data.orders || []);
            setMetadata(data.metadata);
        } catch (err) {
            toast.error("Erreur lors du chargement des commandes.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchOrders(currentPage);
        }
    }, [currentPage, user]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrder(orderId, { status: newStatus });
            toast.success("Statut de la commande mis à jour");
            fetchOrders(currentPage);
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const handlePageChange = (page) => {
        if (metadata && page > 0 && page <= metadata.totalPages) {
            setCurrentPage(page);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SellerNav />
            <div className="container mx-auto px-5 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
                    <p className="text-gray-600 mt-1">Suivez et gérez les commandes de vos produits</p>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <OrdersTable orders={orders} handleStatusChange={handleStatusChange} />
                        )}

                        {metadata && metadata.totalPages > 1 && (
                            <div className="p-4 border-t">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                                disabled={!metadata.hasPreviousPage}
                                            />
                                        </PaginationItem>
                                        {[...Array(metadata.totalPages).keys()].map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                                                    isActive={currentPage === page + 1}
                                                >
                                                    {page + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                                disabled={!metadata.hasNextPage}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SellerOrders;
