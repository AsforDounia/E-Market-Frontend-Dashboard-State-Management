import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./common";
import logo from "../assets/images/e-market-logo.jpeg";
import { API_URL } from "../utils/env";
const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideshowInterval = useRef(null);
  const dispatch = useDispatch();

  const baseUrl = API_URL.replace("/api/v2", "");

  const imageUrls =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls.map((img) => new URL(img, new URL(API_URL).origin).href)
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

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const renderStockIndicator = (stock) => {
    if (stock === 0) return <Badge variant="destructive">Rupture de stock</Badge>;
    if (stock <= 10) return <Badge variant="secondary">Stock limité ({stock} restants)</Badge>;
    return <Badge variant="outline">En stock ({stock} disponibles)</Badge>;
  };

  const handleAddToCart = () => dispatch(addToCart({ product, quantity: 1 }));

  const isInStock = product.stock > 0;
  const averageRating = product.rating?.average || product.averageRating || 0;

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="overflow-hidden"
    >
      <Link to={`/product/${product._id}`} className="block relative group">
        <div className="relative w-full h-64">
          {imageUrls.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
            />
          ))}
        </div>
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Épuisé</span>
          </div>
        )}
      </Link>
      <CardHeader>
        <Link to={`/product/${product._id}`}>
          <CardTitle className="hover:text-primary transition-colors line-clamp-2 h-14">{product.title}</CardTitle>
        </Link>
        <StarRating rating={averageRating} showValue />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold">{product.price.toFixed(2)}€</span>
        </div>
        <div className="mt-2">{renderStockIndicator(product.stock)}</div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className="w-full"
        >
          {isInStock ? "🛒 Ajouter au panier" : "Indisponible"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
