import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../services/userService';
import { toast } from 'react-toastify';
import AdminNav from './AdminNav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [metadata, setMetadata] = useState(null);

    const fetchUsers = async (page) => {
        try {
            setLoading(true);
            const data = await getAllUsers({ page });
            setUsers(data.data.users);
            setMetadata(data.metadata);
        } catch (err) {
            toast.error('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, role);
            toast.success('User role updated.');
            fetchUsers(currentPage);
        } catch (err) {
            toast.error('Failed to update user role.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            toast.success('User deleted.');
            fetchUsers(currentPage);
        } catch (err) {
            toast.error('Failed to delete user.');
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= metadata.totalPages) {
            setCurrentPage(page);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <AdminNav />
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.fullname}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Select value={user.role} onValueChange={(value) => handleRoleChange(user._id, value)}>
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">user</SelectItem>
                                                        <SelectItem value="seller">seller</SelectItem>
                                                        <SelectItem value="admin">admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button onClick={() => handleDelete(user._id)} size="sm" variant="destructive">Delete</Button>
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

export default AdminUsers;
