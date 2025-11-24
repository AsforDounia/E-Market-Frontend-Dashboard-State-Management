import React, { useState, useEffect } from 'react';
import { getSellerCoupons, deleteCoupon, createCoupon } from '../../services/couponService';
import { toast } from 'react-toastify';
import SellerNav from './SellerNav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { PlusCircle, Tag, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CouponsTable = ({ coupons, handleDelete }) => {
    if (coupons.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Tag className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Aucun coupon trouvé.</p>
                <p className="text-sm text-gray-400">Créez des codes promo pour vos clients.</p>
            </div>
        );
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiresAt) < new Date();
                    return (
                        <TableRow key={coupon._id}>
                            <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                            <TableCell>{coupon.discountPercentage}%</TableCell>
                            <TableCell>{new Date(coupon.expiresAt).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>
                                <Badge variant={isExpired ? "secondary" : "default"}>
                                    {isExpired ? "Expiré" : "Actif"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(coupon._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const CreateCouponDialog = ({ onCouponCreated }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minAmount: '',
        maxDiscount: '',
        usageLimit: '',
        expiresAt: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                value: Number(formData.value),
                minAmount: formData.minAmount ? Number(formData.minAmount) : 0,
                maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
            };
            await createCoupon(payload);
            toast.success("Coupon créé avec succès");
            setOpen(false);
            setFormData({
                code: '',
                type: 'percentage',
                value: '',
                minAmount: '',
                maxDiscount: '',
                usageLimit: '',
                expiresAt: ''
            });
            onCouponCreated();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors de la création du coupon");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau coupon
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau coupon</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Code Promo</Label>
                        <Input
                            id="code"
                            placeholder="ex: ETE2025"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type de réduction</Label>
                        <select
                            id="type"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="percentage">Pourcentage (%)</option>
                            <option value="fixed">Montant fixe (€)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="value">Valeur {formData.type === 'percentage' ? '(%)' : '(€)'}</Label>
                        <Input
                            id="value"
                            type="number"
                            min="0"
                            max={formData.type === 'percentage' ? "100" : undefined}
                            placeholder={formData.type === 'percentage' ? "ex: 20" : "ex: 10"}
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minAmount">Montant min. (€)</Label>
                            <Input
                                id="minAmount"
                                type="number"
                                min="0"
                                placeholder="ex: 50"
                                value={formData.minAmount}
                                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxDiscount">Réduction max. (€)</Label>
                            <Input
                                id="maxDiscount"
                                type="number"
                                min="0"
                                placeholder="Optionnel"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="usageLimit">Limite d'utilisation</Label>
                        <Input
                            id="usageLimit"
                            type="number"
                            min="1"
                            placeholder="Optionnel (illimité par défaut)"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expiration">Date d'expiration</Label>
                        <Input
                            id="expiration"
                            type="date"
                            value={formData.expiresAt}
                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Création..." : "Créer le coupon"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const SellerCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getSellerCoupons();
            setCoupons(data.data || []);
        } catch (err) {
            toast.error("Erreur lors du chargement des coupons.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userId = user?._id || user?.id;
        if (userId) {
            fetchCoupons();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) {
            try {
                await deleteCoupon(id);
                toast.success("Coupon supprimé avec succès");
                fetchCoupons();
            } catch (err) {
                toast.error("Erreur lors de la suppression du coupon");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SellerNav />
            <div className="container mx-auto px-5 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mes Coupons</h1>
                        <p className="text-gray-600 mt-1">Gérez vos codes promotionnels</p>
                    </div>
                    <CreateCouponDialog onCouponCreated={fetchCoupons} />
                </div>

                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <CouponsTable coupons={coupons} handleDelete={handleDelete} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SellerCoupons;
