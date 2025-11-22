import React, { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/couponService';
import { toast } from 'react-toastify';
import AdminNav from './AdminNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: '', minAmount: '', expiresAt: '', isActive: true, usageLimit: '' });
    const [editingCouponId, setEditingCouponId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [metadata, setMetadata] = useState(null);

    const fetchCoupons = async (page) => {
        try {
            setLoading(true);
            const data = await getAllCoupons({ page });
            setCoupons(data.data.coupons);
            setMetadata(data.metadata);
        } catch (err) {
            toast.error('Failed to fetch coupons.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons(currentPage);
    }, [currentPage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setNewCoupon((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name, checked) => {
        setNewCoupon((prev) => ({ ...prev, [name]: checked }));
    };

    const handleCreateOrUpdateCoupon = async (e) => {
        e.preventDefault();
        const action = editingCouponId ? updateCoupon : createCoupon;
        const id = editingCouponId || null;
        try {
            const couponData = {
                ...newCoupon,
                usageLimit: newCoupon.usageLimit === '' ? null : Number(newCoupon.usageLimit),
                minAmount: Number(newCoupon.minAmount),
                value: Number(newCoupon.value),
            };
            if (editingCouponId) {
                await updateCoupon(id, couponData);
            } else {
                await createCoupon(couponData);
            }
            toast.success(`Coupon ${editingCouponId ? 'updated' : 'created'} successfully.`);
            setNewCoupon({ code: '', type: 'percentage', value: '', minAmount: '', expiresAt: '', isActive: true, usageLimit: '' });
            setEditingCouponId(null);
            fetchCoupons(currentPage);
        } catch (err) {
            toast.error(`Failed to ${editingCouponId ? 'update' : 'create'} coupon.`);
        }
    };

    const handleDeleteCoupon = async (id) => {
        try {
            await deleteCoupon(id);
            toast.success('Coupon deleted.');
            fetchCoupons(currentPage);
        } catch (err) {
            toast.error('Failed to delete coupon.');
        }
    };

    const startEditing = (coupon) => {
        setEditingCouponId(coupon._id);
        setNewCoupon({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minAmount: coupon.minAmount,
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
            isActive: coupon.isActive,
            usageLimit: coupon.usageLimit || '',
        });
    };

    const cancelEditing = () => {
        setEditingCouponId(null);
        setNewCoupon({ code: '', type: 'percentage', value: '', minAmount: '', expiresAt: '', isActive: true, usageLimit: '' });
    }

    const handlePageChange = (page) => {
        if (page > 0 && page <= metadata.totalPages) {
            setCurrentPage(page);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <AdminNav />

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>{editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateOrUpdateCoupon} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="code">Coupon Code</Label>
                                <Input id="code" name="code" value={newCoupon.code} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" value={newCoupon.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="value">Discount Value</Label>
                                <Input id="value" name="value" type="number" value={newCoupon.value} onChange={handleInputChange} required min="0" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="minAmount">Minimum Amount</Label>
                                <Input id="minAmount" name="minAmount" type="number" value={newCoupon.minAmount} onChange={handleInputChange} required min="0" />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="usageLimit">Usage Limit</Label>
                                <Input id="usageLimit" name="usageLimit" type="number" value={newCoupon.usageLimit} onChange={handleInputChange} min="0" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="expiresAt">Expiration Date</Label>
                                <Input id="expiresAt" name="expiresAt" type="date" value={newCoupon.expiresAt} onChange={handleInputChange} required />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Checkbox id="isActive" name="isActive" checked={newCoupon.isActive} onCheckedChange={(checked) => handleCheckboxChange('isActive', checked)} />
                                <Label htmlFor="isActive">Is Active</Label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingCouponId && <Button type="button" variant="outline" onClick={cancelEditing}>Cancel</Button>}
                            <Button type="submit">{editingCouponId ? 'Update Coupon' : 'Create Coupon'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : coupons.length === 0 ? (
                        <p>No coupons found.</p>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Min Amount</TableHead>
                                        <TableHead>Expires At</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coupons.map((coupon) => (
                                        <TableRow key={coupon._id}>
                                            <TableCell>{coupon.code}</TableCell>
                                            <TableCell>{coupon.value}{coupon.type === 'percentage' ? '%' : '$'}</TableCell>
                                            <TableCell>${coupon.minAmount}</TableCell>
                                            <TableCell>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>
                                                {coupon.isActive ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button onClick={() => startEditing(coupon)} size="sm" variant="outline">Edit</Button>
                                                <Button onClick={() => handleDeleteCoupon(coupon._id)} size="sm" variant="destructive">Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {metadata && metadata.totalPages > 1 && (
                                <Pagination className="mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={!metadata.hasPreviousPage} />
                                        </PaginationItem>
                                        {[...Array(metadata.totalPages).keys()].map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink href="#" onClick={() => handlePageChange(page + 1)} isActive={currentPage === page + 1}>
                                                    {page + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} disabled={!metadata.hasNextPage} />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCoupons;
