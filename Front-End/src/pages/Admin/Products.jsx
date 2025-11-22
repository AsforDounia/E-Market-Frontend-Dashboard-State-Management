import React, { useState, useEffect } from 'react';
import { getProducts as getAllProducts, validateProduct, rejectProduct, deleteProduct } from '../../services/productService';
import { toast } from 'react-toastify';
import AdminNav from './AdminNav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const ProductsTable = ({ products, handleAction }) => {
    if (products.length === 0) {
        return <p>No products in this category.</p>;
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product._id}>
                        <TableCell>
                            <Avatar>
                                <AvatarImage src={product.imageUrls?.[0]} alt={product.title} />
                                <AvatarFallback>{product.title?.[0]}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.sellerId?.fullname || 'N/A'}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.validationStatus}</TableCell>
                        <TableCell className="text-right space-x-2">
                            {product.validationStatus === 'pending' && (
                                <>
                                    <Button onClick={() => handleAction(validateProduct, product._id, 'Product validated.', 'Failed to validate product.')} size="sm">Validate</Button>
                                    <Button onClick={() => handleAction(rejectProduct, product._id, 'Product rejected.', 'Failed to reject product.')} size="sm" variant="destructive">Reject</Button>
                                </>
                            )}
                            <Button onClick={() => handleAction(deleteProduct, product._id, 'Product deleted.', 'Failed to delete product.')} size="sm" variant="outline">Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [metadata, setMetadata] = useState(null);

    const fetchProducts = async (status, page) => {
        try {
            setLoading(true);
            const filters = status === 'all' ? { page } : { validationStatus: status, page };
            const data = await getAllProducts(filters);
            console.log("Fetched products data:", data); // Debugging line
            setProducts(data.data.products);
            setMetadata(data.metadata);
        } catch (err) {
            toast.error(`Failed to fetch ${status} products.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(activeTab, currentPage);
    }, [activeTab, currentPage]);

    const handleAction = async (action, id, successMessage, errorMessage) => {
        try {
            await action(id);
            toast.success(successMessage);
            fetchProducts(activeTab, currentPage);
        } catch (err) {
            toast.error(errorMessage);
        }
    };
    
    const handlePageChange = (page) => {
        if(page > 0 && page <= metadata.totalPages) {
            setCurrentPage(page);
        }
    }

    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            );
        }
        return <ProductsTable products={products} handleAction={handleAction} />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <AdminNav />
            <Card>
                <CardHeader>
                    <CardTitle>Product Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentPage(1); }} className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="approved">Approved</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-4">
                            {renderContent()}
                        </TabsContent>
                    </Tabs>
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
                                    <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} disabled={!metadata.hasNextPage}/>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProducts;
