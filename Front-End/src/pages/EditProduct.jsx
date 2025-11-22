import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/categoriesSlice";
import { getProductById, updateProduct } from "../services/productService";
import { X, Upload, Loader2, ArrowLeft } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = {
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryIds: [],
};

const EditProduct = () => {
    const { id } = useParams();
    const [form, setForm] = useState(initialState);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        items: categories,
        loading: catLoading,
        fetched,
    } = useSelector(
        (state) =>
            state.categories || {
                items: [],
                loading: false,
                error: null,
                fetched: false,
            },
    );
    const categoryList = Array.isArray(categories) ? categories : [];

    useEffect(() => {
        if (!fetched) {
            dispatch(fetchCategories());
        }
    }, [dispatch, fetched]);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setFetching(true);
                const data = await getProductById(id);
                const product = data.data.product || data.data;

                setForm({
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    categoryIds: product.categories ? product.categories.map(c => typeof c === 'object' ? c._id : c) : [],
                });
                setExistingImages(product.imageUrls || []);
            } catch (err) {
                setError("Failed to load product details");
                console.error(err);
            } finally {
                setFetching(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files || []);
        let errorMsg = null;

        if (files.length + existingImages.length > 5) {
            errorMsg = "You can only have up to 5 images total.";
        } else {
            setImages(files);

            imagePreviews.forEach((url) => URL.revokeObjectURL(url));

            const previews = files.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
        }

        if (errorMsg) setError(errorMsg);
        else setError(null);
    };

    const removeNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (value) => {
        if (value && !form.categoryIds.includes(value)) {
            setForm((prev) => ({
                ...prev,
                categoryIds: [...prev.categoryIds, value],
            }));
        }
    };

    const removeCategory = (categoryId) => {
        setForm((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.filter((id) => id !== categoryId),
        }));
    };

    const validate = () => {
        if (!form.title.trim()) return "Title is required";
        if (!form.description.trim()) return "Description is required";
        if (!form.price || Number(form.price) <= 0)
            return "Price must be greater than 0";
        if (form.stock === "" || Number(form.stock) < 0)
            return "Stock must be 0 or more";
        if (images.length === 0 && existingImages.length === 0) return "At least one image is required";
        if (images.length + existingImages.length > 5) return "Maximum 5 images allowed";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("price", Number(form.price));
            formData.append("stock", Number(form.stock));

            formData.append("categoryIds", JSON.stringify(form.categoryIds));

            images.forEach((image) => {
                formData.append("images", image);
            });

            existingImages.forEach((url) => {
                formData.append("imageUrls[]", url);
            });

            await updateProduct(id, formData);

            setSuccess("Product updated successfully");
            setTimeout(() => {
                navigate("/seller/products");
            }, 1500);

        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err.message ||
                "Failed to update product";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto py-10 px-4">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => navigate("/seller/products")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>Update your product details, price, and inventory.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="mb-6 bg-green-50 text-green-900 border-green-200">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Product Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g., Wireless Headphones"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={5}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your product..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (€)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Categories</Label>
                            <Select onValueChange={handleCategoryChange} disabled={catLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryList.map((c) => (
                                        <SelectItem key={c._id || c.id} value={c._id || c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {form.categoryIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.categoryIds.map((id) => {
                                        const category = categoryList.find((c) => (c._id || c.id) === id);
                                        if (!category) return null;
                                        return (
                                            <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1">
                                                {category.name}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                                    onClick={() => removeCategory(id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="images">Product Images (Max 5)</Label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                                {/* Existing Images */}
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative group aspect-square">
                                        <img
                                            src={url}
                                            alt={`Existing ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg border border-border"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeExistingImage(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}

                                {/* New Image Previews */}
                                {imagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative group aspect-square">
                                        <img
                                            src={preview}
                                            alt={`New Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg border border-green-500/50"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeNewImage(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                {(existingImages.length + images.length < 5) && (
                                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors aspect-square">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-xs text-muted-foreground">Upload</span>
                                        </div>
                                        <input
                                            id="images"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImages}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/seller/products")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Updating..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProduct;
