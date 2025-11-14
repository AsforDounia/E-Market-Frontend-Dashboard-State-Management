import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, StarRating } from "./common";
import logo from "../assets/images/e-market-logo.jpeg";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideshowInterval = useRef(null);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api/v2", "");

  const imageUrls =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls.map((img) => `${baseUrl}${img.imageUrl}`)
      : [logo];

  useEffect(() => {
    if (isHovered) {
      slideshowInterval.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }, 1500);
    } else {
      clearInterval(slideshowInterval.current);
      setCurrentImageIndex(0);
    }

    return () => clearInterval(slideshowInterval.current);
  }, [isHovered, imageUrls.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderStockIndicator = (product) => {
    const stockQuantity = product.stock || 0;
    if (stockQuantity === 0) {
      return (
        <Badge variant="danger" dot>
          Rupture de stock
        </Badge>
      );
    }
    if (stockQuantity > 0 && stockQuantity <= 10) {
      return (
        <Badge variant="warning" dot>
          Stock limité ({stockQuantity} restants)
        </Badge>
      );
    }
    return (
      <Badge variant="success" dot>
        En stock ({stockQuantity} disponibles)
      </Badge>
    );
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product.title);
    // Add your cart logic here
  };

  const isInStock = product.stock > 0;
  const averageRating = product.rating?.average || product.averageRating || 0;

  return (
<Card
      padding="none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block relative group overflow-hidden"
      >
        <div className="relative w-full h-64">
          {imageUrls.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${index === currentImageIndex ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-110" : ""}`}
              loading="lazy"
              crossOrigin="anonymous"
            />
          ))}
        </div>
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Épuisé</span>
          </div>
        )}
      </Link>

      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.title}
          </h3>
        </Link>

        <StarRating rating={averageRating} showValue />

        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {product.price.toFixed(2)}€
          </span>
        </div>

        {renderStockIndicator(product)}

        <Button
          fullWidth
          onClick={() => handleAddToCart(product)}
          disabled={!isInStock}
          variant={isInStock ? "primary" : "secondary"}
          className="mt-3"
        >
          {isInStock ? "🛒 Ajouter au panier" : "Indisponible"}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
