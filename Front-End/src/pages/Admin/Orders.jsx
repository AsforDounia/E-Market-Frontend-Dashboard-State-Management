import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, selectAllOrders, selectOrdersStatus, selectOrdersError } from '../../store/ordersSlice';
import { toast } from 'react-toastify';
import AdminNav from './AdminNav';
import api from '../../services/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ORDER_STATUS_CONFIG = {
    pending: { variant: "secondary", label: "En attente" },
    paid: { variant: "default", label: "Payée" },
    shipped: { variant: "outline", label: "Expédiée" },
    delivered: { variant: "outline", label: "Livrée" },
    cancelled: { variant: "destructive", label: "Annulée" },
};

const OrdersTable = ({ orders, handleUpdateStatus, navigate }) => {
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        await handleUpdateStatus(orderId, newStatus);
        setUpdatingOrderId(null);
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande trouvée</p>
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
                {orders.map((order) => {
                    const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.pending;
                    return (
                        <TableRow key={order._id}>
                            <TableCell className="font-mono text-xs">
                                #{order._id}
                            </TableCell>
                            <TableCell>{order.userId?.fullname || order.userId?.email || 'N/A'}</TableCell>
                            <TableCell>
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell className="font-semibold">
                                {order.total?.toFixed(2)}€
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusConfig.variant}>
                                    {statusConfig.label}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <div className="flex items-center justify-end gap-2">
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) => handleStatusChange(order._id, value)}
                                        disabled={updatingOrderId === order._id || order.status === 'cancelled' || order.status === 'delivered'}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">En attente</SelectItem>
                                            <SelectItem value="paid">Payée</SelectItem>
                                            <SelectItem value="shipped">Expédiée</SelectItem>
                                            <SelectItem value="delivered">Livrée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/order/${order._id}`)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const AdminOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(selectAllOrders);
    const status = useSelector(selectOrdersStatus);
    const error = useSelector(selectOrdersError);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const params = activeTab === 'all' ? {} : { status: activeTab };
        dispatch(fetchOrders(params));
    }, [dispatch, activeTab]);

    useEffect(() => {
        if (error) {
            toast.error('Erreur lors du chargement des commandes');
        }
    }, [error]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            toast.success('Statut de la commande mis à jour');
            // Refresh orders
            const params = activeTab === 'all' ? {} : { status: activeTab };
            dispatch(fetchOrders(params));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
        }
    };

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            );
        }
        return <OrdersTable orders={orders} handleUpdateStatus={handleUpdateStatus} navigate={navigate} />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <AdminNav />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Gestion des Commandes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">Toutes</TabsTrigger>
                            <TabsTrigger value="pending">En attente</TabsTrigger>
                            <TabsTrigger value="paid">Payées</TabsTrigger>
                            <TabsTrigger value="shipped">Expédiées</TabsTrigger>
                            <TabsTrigger value="delivered">Livrées</TabsTrigger>
                            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-4">
                            {renderContent()}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrders;
