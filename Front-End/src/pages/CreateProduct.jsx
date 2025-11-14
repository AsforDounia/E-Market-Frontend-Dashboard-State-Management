import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
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
    setSelectedCategory(selectedId); // Control the select input

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

      form.categoryIds.forEach((id) => {
        formData.append("categoryIds[]", id);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product created successfully");
      setForm(initialState); // Reset form

      const responseData = res?.data?.data || res?.data;
      const product = responseData?.product || responseData;

      if (product?.slug) {
        navigate(`/product/${product.slug}`);
      } else if (product?._id || product?.id) {
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
      // Cleanup preview URLs on unmount is handled by the useEffect return
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert type="success">{success}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product title"
          required
        />

        <div>
          <label
            className="block text-sm font-semibold text-gray-900 mb-2"
            htmlFor="description"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 border-gray-200 focus:border-blue-500"
            placeholder="Write a detailed description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        {catError && <Alert type="error">{catError}</Alert>}

        <div>
          <label
            className="block text-sm font-semibold text-gray-900 mb-2"
            htmlFor="categorySelect"
          >
            Categories
          </label>
          <select
            id="categorySelect"
            className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 border-gray-200 focus:border-blue-500"
            onChange={handleCategoryChange}
            disabled={catLoading}
            value={selectedCategory}
          >
            <option value="">
              {catLoading ? "Loading categories..." : "Add a category"}
            </option>
            {categoryList.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {Array.isArray(form.categoryIds) && form.categoryIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.categoryIds.map((id) => {
                const category = categoryList.find(
                  (c) => (c._id || c.id) === id,
                );
                if (!category) return null;
                return (
                  <div
                    key={id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{category.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(id)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-gray-900 mb-2"
            htmlFor="images"
          >
            Product Images <span className="text-red-500">*</span>
            <span className="text-sm font-normal text-gray-600 ml-2">
              (Max 5 images)
            </span>
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 border-gray-200 focus:border-blue-500"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="secondary"
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
