import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../../services/reviewService";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X, Trash2, Flag, Search, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/common";

const AdminReviews = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin-reviews", page, statusFilter, search],
        queryFn: () =>
            reviewService.getAllReviews({
                page,
                limit: 10,
                status: statusFilter === "all" ? undefined : statusFilter === "reported" ? undefined : statusFilter,
                isReported: statusFilter === "reported" ? true : undefined,
                search,
            }),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ reviewId, status }) =>
            reviewService.updateReviewStatus(reviewId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-reviews"]);
        },
    });

    const deleteReviewMutation = useMutation({
        mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-reviews"]);
        },
    });

    const handleStatusUpdate = (reviewId, status) => {
        updateStatusMutation.mutate({ reviewId, status });
    };

    const handleDelete = (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            deleteReviewMutation.mutate(reviewId);
        }
    };

    const getStatusBadge = (status, isReported) => {
        if (isReported) return <Badge variant="destructive">Reported</Badge>;
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">Pending</Badge>;
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Review Moderation</CardTitle>
                    <CardDescription>Manage and moderate user reviews.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-4 w-full md:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Reviews</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="reported">Reported</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search reviews..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 w-full md:w-[300px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>Failed to load reviews: {error.message}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Review</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            Loading reviews...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data?.data?.reviews?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No reviews found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.data?.reviews.map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={review.userId?.avatarUrl} />
                                                    <AvatarFallback>{review.userId?.fullname?.charAt(0) || "?"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{review.userId?.fullname || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{review.userId?.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                {review.productId?.imageUrls?.[0] && (
                                                    <img
                                                        src={review.productId.imageUrls[0]}
                                                        alt={review.productId.title}
                                                        className="h-8 w-8 object-cover rounded"
                                                    />
                                                )}
                                                <span className="truncate text-sm" title={review.productId?.title}>
                                                    {review.productId?.title || "Unknown Product"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <div className="flex flex-col gap-1">
                                                <StarRating rating={review.rating} size="sm" />
                                                <p className="text-sm truncate" title={review.comment}>
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(review.status, review.isReported)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {review.status !== "approved" && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleStatusUpdate(review._id, "approved")}
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {review.status !== "rejected" && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                        onClick={() => handleStatusUpdate(review._id, "rejected")}
                                                        title="Reject"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(review._id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination could be added here if needed, using data.data.pagination */}
            {data?.data?.pagination?.pages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                        Page {page} of {data.data.pagination.pages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(data.data.pagination.pages, p + 1))}
                        disabled={page === data.data.pagination.pages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
