import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import { toast } from 'react-toastify';
import SellerNav from './SellerNav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useSelector } from 'react-redux';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const ProductsTable = ({ products, handleDelete }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore de produits.</p>
                <Link to="/products/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter votre premier produit
                    </Button>
                </Link>
            </div>
        );
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product._id}>
                        <TableCell>
                            <Avatar className="h-12 w-12 rounded-lg">
                                <AvatarImage src={product.imageUrls?.[0]} alt={product.title} />
                                <AvatarFallback className="rounded-lg">{product.title?.[0]}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>{product.price.toFixed(2)} €</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                            <Badge variant={
                                product.validationStatus === 'approved' ? 'default' :
                                    product.validationStatus === 'rejected' ? 'destructive' : 'secondary'
                            }>
                                {product.validationStatus === 'approved' ? 'Validé' :
                                    product.validationStatus === 'rejected' ? 'Rejeté' : 'En attente'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Link to={`/products/edit/${product._id}`}>
                                    <Button size="icon" variant="ghost">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <button
                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent any parent link navigation
                                        console.log("Standard button clicked for:", product._id);
                                        // alert(`Deleting product: ${product._id}`); // Visual feedback
                                        handleDelete(product._id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [metadata, setMetadata] = useState(null);
    const { user } = useSelector((state) => state.auth);

    const fetchProducts = async (page) => {
        try {
            setLoading(true);
            // Assuming the API filters by seller automatically or we pass sellerId
            // If the backend doesn't filter by logged-in user for this endpoint, we might need to pass sellerId
            // But usually /products filters by query params. Let's assume we need to pass sellerId if it's a public endpoint
            // OR there is a specific endpoint. Based on productService, it's generic.
            // Let's try passing sellerId in filters.
            const userId = user?._id || user?.id;
            const filters = {
                page,
                seller: userId,
                limit: 10
            };
            const data = await getProducts(filters);
            setProducts(data.data.products);
            setMetadata(data.metadata);
        } catch (err) {
            toast.error("Erreur lors du chargement de vos produits.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userId = user?._id || user?.id;
        console.log("SellerProducts useEffect - User:", user);
        if (userId) {
            console.log("Fetching products for seller:", userId);
            fetchProducts(currentPage);
        } else {
            console.log("User ID missing, skipping fetch");
        }
    }, [currentPage, user]);

    const handleDelete = async (id) => {
        console.log("handleDelete called with id:", id);
        // Temporary removal of confirm to test if it blocks
        // if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        console.log("Proceeding with deletion for id:", id);
        try {
            // Optimistic update
            setProducts(prev => prev.filter(p => p._id !== id));
            const response = await deleteProduct(id);
            console.log("Delete response:", response);
            toast.success("Produit supprimé avec succès");
            fetchProducts(currentPage);
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Erreur lors de la suppression du produit");
            // Revert if failed
            fetchProducts(currentPage);
        }
        // }
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mes Produits</h1>
                        <p className="text-gray-600 mt-1">Gérez votre catalogue de produits</p>
                    </div>
                    <Link to="/products/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau produit
                        </Button>
                    </Link>
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
                            <ProductsTable products={products} handleDelete={handleDelete} />
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

export default SellerProducts;
