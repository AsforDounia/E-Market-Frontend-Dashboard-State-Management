import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Upload, X, Package } from "lucide-react";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { fetchCategories } from "../store/categoriesSlice";

const initialState = {
  title: "",
  description: "",
  price: "",
  stock: "",
  categoryIds: [],
};

const CreateProduct = () => {
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    items: categories,
    loading: catLoading,
    error: catError,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    let errorMsg = null;

    if (files.length > 5) {
      errorMsg =
        "You can only upload up to 5 images. The first 5 have been selected.";
      setImages(files.slice(0, 5));
    } else {
      setImages(files);
    }

    setError(errorMsg);

    // Clean up old previews before creating new ones
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    // Create new preview URLs
    const previews = (errorMsg ? files.slice(0, 5) : files).map((file) =>
      URL.createObjectURL(file),
    );
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCategory(selectedId);

    if (selectedId && !form.categoryIds.includes(selectedId)) {
      setForm((prev) => ({
        ...prev,
        categoryIds: [...prev.categoryIds, selectedId],
      }));
    }
    // Reset dropdown after selection to allow adding another
    setTimeout(() => setSelectedCategory(""), 0);
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
    if (images.length === 0) return "At least one image is required";
    if (images.length > 5) return "Maximum 5 images allowed";
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

      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product created successfully");
      setForm(initialState);

      const responseData = res?.data?.data || res?.data;
      const product = responseData?.product || responseData;

      if (product?._id || product?.id) {
        navigate(`/product/${product._id || product.id}`);
      } else {
        navigate("/products");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create product";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-8 w-8" />
          Create Product
        </h1>
        <p className="text-muted-foreground mt-2">
          Add a new product to your inventory
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter the basic details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Write a detailed description of your product"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="stock">
                  Stock <span className="text-destructive">*</span>
                </Label>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Select categories for your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {catError && (
              <Alert variant="destructive">
                <AlertDescription>{catError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="categorySelect">Add Category</Label>
              <select
                id="categorySelect"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleCategoryChange}
                disabled={catLoading}
                value={selectedCategory}
              >
                <option value="">
                  {catLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categoryList.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {Array.isArray(form.categoryIds) && form.categoryIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.categoryIds.map((id) => {
                  const category = categoryList.find(
                    (c) => (c._id || c.id) === id,
                  );
                  if (!category) return null;
                  return (
                    <Badge key={id} variant="secondary" className="gap-1">
                      {category.name}
                      <button
                        type="button"
                        onClick={() => removeCategory(id)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload up to 5 images for your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">
                Images <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum 5 images. Supported formats: JPG, PNG, WebP
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Creating..." : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
