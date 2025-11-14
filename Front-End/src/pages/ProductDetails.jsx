import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/images/e-market-logo.jpeg";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  LoadingSpinner,
  StarRating,
} from "../components/common";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useFetch(`products/slug/${slug}`);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api/v2", "");

  useEffect(() => {
    console.log(data);
    if (data?.data?.product) {
      setProduct(data.data.product);
      // Set primary image or first image as default
      const images = data.data.product.imageUrls || [];
      if (images.length > 0) {
        const primaryImage = images.find((img) => img.isPrimary) || images[0];
        setSelectedImage(`${baseUrl}${primaryImage.imageUrl}`);
      } else {
        setSelectedImage(logo);
      }
    }

    console.log(data);
  }, [data, baseUrl]);

  const handleQuantityChange = (action) => {
    if (action === "increment" && quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    setAddingToCart(true);
    setCartMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCartMessage({ type: "success", text: "Produit ajouté au panier !" });
        setQuantity(1);
      } else {
        setCartMessage({
          type: "error",
          text: result.message || "Erreur lors de l'ajout au panier",
        });
      }
    } catch (err) {
      setCartMessage({
        type: "error",
        text: "Erreur de connexion au serveur",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStockBadge = () => {
    const stock = product?.stock || 0;

    if (stock === 0) {
      return (
        <Badge variant="danger" size="lg">
          Rupture de stock
        </Badge>
      );
    }
    if (stock > 0 && stock <= 10) {
      return (
        <Badge variant="warning" size="lg">
          Stock limité - {stock} restants
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="lg">
        En stock - {stock} disponibles
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement du produit..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <Alert type="error" message={`Erreur: ${error}`} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <Alert type="warning" message="Produit non trouvé" />
      </div>
    );
  }

  const isInStock = product.stock > 0;
  const averageRating = product.rating.average || 0;
  const reviewCount = product.rating.count || 0;
  const images = product.imageUrls || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-5 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Accueil
              </Link>
            </li>

            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-blue-600">
                Produits
              </Link>
            </li>

            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <Card padding="sm" className="mb-4">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-96 object-contain"
                crossOrigin="anonymous"
              />
            </Card>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(`${baseUrl}${img.imageUrl}`)
                    }
                    className={`border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors ${
                      selectedImage === `${baseUrl}${img.imageUrl}`
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={`${baseUrl}${img.imageUrl}`}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      crossOrigin="anonymous"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={averageRating} showValue size="lg" />
              <span className="text-gray-600">
                ({reviewCount} {reviewCount === 1 ? "avis" : "avis"})
              </span>
            </div>

            {/* Stock Badge */}
            <div className="mb-6">{renderStockBadge()}</div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue-600">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-gray-500 text-lg">TTC</span>
              </div>
            </div>

            {/* Categories */}
            {product.categoryIds && product.categoryIds.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Catégories:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.categoryIds.map((category) => (
                    <Badge key={category._id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {isInStock && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quantité:
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                    className="w-12 h-12"
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Cart Message */}
            {cartMessage && (
              <Alert
                type={cartMessage.type}
                message={cartMessage.text}
                className="mb-4"
              />
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-3 mb-6">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={!isInStock || addingToCart}
              >
                {addingToCart
                  ? "Ajout en cours..."
                  : isInStock
                  ? "🛒 Ajouter au panier"
                  : "Produit indisponible"}
              </Button>
            </div>

            {/* Product Meta */}
            <Card variant="secondary" padding="md">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date d'ajout:</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab === "description"
                    ? "Description"
                    : `Avis (${reviewCount})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {reviewCount > 0 ? (
                  <div className="space-y-6">
                    {product.reviews?.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <Avatar 
                                avatarUrl={review.userId?.avatarUrl} 
                                fullname={review.userId?.fullname} 
                                size="md"
                                className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            />
                            <p className="font-semibold text-gray-900">
                              {review.userId?.fullname}
                            </p>
                            <StarRating rating={review.rating} />
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucun avis pour ce produit pour le moment.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
