import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash2 } from "lucide-react";
import { addToCart } from "../store/cartSlice";
import useFetch from "../hooks/useFetch";
import useReviews from "../hooks/useReviews";
import logo from "../assets/images/e-market-logo.jpeg";
import ReviewForm from "../components/ReviewForm";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { StarRating, LoadingSpinner } from "../components/common";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useFetch(`products/${id}`);
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews, deleteReview, isDeleting } = useReviews(id);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (data?.data?.product) {
      setProduct(data.data.product);
      const images = data.data.product.imageUrls || [];
      if (images.length > 0) {
        setSelectedImage(new URL(images[0], new URL(import.meta.env.VITE_API_URL).origin).href);
      } else {
        setSelectedImage(logo);
      }
    }
  }, [data]);

  const handleQuantityChange = (action) => {
    if (action === "increment" && quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    dispatch(addToCart({ product, quantity }));
  };

  const handleDeleteReview = async (reviewId) => {
    console.log("handleDeleteReview called with id:", reviewId);
    // if (window.confirm("Êtes-vous sûr de vouloir supprimer votre avis ?")) {
    console.log("Proceeding with review deletion");
    try {
      await deleteReview(reviewId);
      console.log("Review deleted successfully");
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review: " + error.message);
    }
    // }
  };

  const renderStockBadge = () => {
    const stock = product?.stock || 0;

    if (stock === 0) {
      return (
        <Badge variant="destructive" className="text-base px-4 py-1">
          Rupture de stock
        </Badge>
      );
    }
    if (stock > 0 && stock <= 10) {
      return (
        <Badge variant="outline" className="text-base px-4 py-1 border-yellow-500 text-yellow-700">
          Stock limité - {stock} restants
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-base px-4 py-1 border-green-500 text-green-700">
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
        <Alert variant="destructive">
          <AlertDescription>Erreur: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <Alert>
          <AlertDescription>Produit non trouvé</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isInStock = product.stock > 0;
  const reviews = reviewsData?.data?.reviews || [];
  const averageRating = reviewsData?.data?.averageRating || 0;
  const reviewCount = reviews.length;
  const images = product.imageUrls || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-5 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card className="mb-4">
              <CardContent className="p-4">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-96 object-contain"
                  crossOrigin="anonymous"
                />
              </CardContent>
            </Card>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(new URL(img, new URL(import.meta.env.VITE_API_URL).origin).href)
                    }
                    className={`border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors ${selectedImage === new URL(img, new URL(import.meta.env.VITE_API_URL).origin).href
                      ? "border-blue-600"
                      : "border-gray-300"
                      }`}
                  >
                    <img
                      src={new URL(img, new URL(import.meta.env.VITE_API_URL).origin).href}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      crossOrigin="anonymous"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={averageRating} showValue size="lg" />
              <span className="text-gray-600">
                ({reviewCount} {reviewCount === 1 ? "avis" : "avis"})
              </span>
            </div>

            <div className="mb-6">{renderStockBadge()}</div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue-600">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-gray-500 text-lg">TTC</span>
              </div>
            </div>

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

            {isInStock && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quantité:
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
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
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                {isInStock ? (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier
                  </>
                ) : (
                  "Produit indisponible"
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations produit</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-gray-600">Référence</dt>
                <dd className="text-gray-900 font-medium">{product._id.slice(-8).toUpperCase()}</dd>
                <dt className="text-gray-600">Date d'ajout</dt>
                <dd className="text-gray-900 font-medium">
                  {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </dd>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="py-6">
            {user ? (
              <Card className="mb-8 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Donner votre avis</CardTitle>
                  <CardDescription>
                    Partagez votre expérience avec ce produit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewForm productId={id} onSuccess={refetchReviews} />
                </CardContent>
              </Card>
            ) : (
              <Alert className="mb-8 border-blue-200 bg-blue-50">
                <AlertDescription className="text-center text-base">
                  <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    Connectez-vous
                  </Link>{" "}
                  pour laisser un avis sur ce produit.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Avis clients
              </h3>
              {reviewCount > 0 && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <StarRating rating={averageRating} showValue size="md" />
                  <span className="font-medium">
                    {averageRating.toFixed(1)} sur 5
                  </span>
                  <span>•</span>
                  <span>
                    Basé sur {reviewCount} {reviewCount === 1 ? "avis" : "avis"}
                  </span>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingSpinner size="md" />
                <p className="text-gray-500">Chargement des avis...</p>
              </div>
            ) : reviewCount > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={review.userId?.avatarUrl}
                              alt={review.userId?.fullname}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                              {review.userId?.fullname?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold text-gray-900 text-lg">
                                {review.userId?.fullname || "Utilisateur"}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                Acheteur vérifié
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <StarRating rating={review.rating} size="sm" />
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {user && (user._id === review.userId?._id || user.id === review.userId?._id) && (
                          <button
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("Standard delete review button clicked for:", review._id);
                              handleDeleteReview(review._id);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-16">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium mb-1">
                    Aucun avis pour le moment
                  </p>
                  <p className="text-gray-400 text-sm">
                    Soyez le premier à donner votre avis sur ce produit
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;