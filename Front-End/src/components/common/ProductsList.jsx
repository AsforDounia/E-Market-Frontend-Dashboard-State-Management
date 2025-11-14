import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineFire } from 'react-icons/ai';
import logo from '../../assets/images/e-market-logo.jpeg';
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsError,
} from '../../slices/productsSlice';
import { Button, Card, Badge, LoadingSpinner, StarRating } from './index';

const ProductsList = ({ limit = 6, sortBy, products: productsProp, metadata, onAddToCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storeProducts = useSelector(selectAllProducts) || [];
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  // If products are passed in via props, don't fetch in this component.
  useEffect(() => {
    if (productsProp) return;
    // forward optional sortBy param to the slice
    const params = { limit };
    if (sortBy) params.sortBy = sortBy;
    dispatch(fetchProducts(params));
  }, [dispatch, limit, sortBy, productsProp]);

  const productsLoading = status === 'loading';
  const productsError = status === 'failed' ? error : null;

  // Choose products: prefer props, otherwise use store products. When using props, show all passed products.
  const products = productsProp ?? storeProducts;
  const featuredProducts = useMemo(() => (productsProp ? products : products.slice(0, limit)), [products, productsProp, limit]);

  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v2', '') : '';

  const getProductImage = (imageUrls) => {
    console.log('Image URLs:', imageUrls);
    try {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) return logo;
      const primaryImage = imageUrls.find((img) => img.isPrimary);
      const imageUrl = primaryImage?.imageUrl || imageUrls[0]?.imageUrl;
      return `${baseUrl}${imageUrl}`;
    } catch {
      return logo;
    }
  };

  // decide empty-state: if backend metadata explicitly reports total === 0,
  // prefer that over any possibly-stale products array.
  const backendSaysNoResults = typeof metadata?.total === 'number' && metadata.total === 0;

  return (
    <section>
        {productsLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Chargement des produits..." />
          </div>
        ) : productsError ? (
          <p className="text-red-500 text-center">Erreur lors du chargement des produits.</p>
        ) : backendSaysNoResults ? (
          <p className="text-gray-500 text-center">Aucun produit disponible</p>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const isInStock = (product.stock ?? 0) > 0;
              const averageRating = product?.rating?.average ?? product?.rating ?? 0;

              return (
                <Card key={product._id} hover padding="none">
                  <Link to={`/product/${product.slug}`}>
                    <div className="relative overflow-hidden group">
                      <img
                        src={getProductImage(product.imageUrls)}
                        alt={`Image de ${product.title}`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                      {!isInStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="danger" size="lg">
                            Rupture de stock
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>

                    <StarRating rating={averageRating} showValue />

                    <div className="flex items-baseline gap-2 mt-3 mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}€
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        fullWidth
                        onClick={() => onAddToCart ? onAddToCart(product) : navigate(`/product/${product.slug}`)}
                        disabled={!isInStock}
                        variant={isInStock ? 'primary' : 'secondary'}
                        className="mt-3"
                      >
                        {isInStock ? '🛒 Ajouter au panier' : 'Indisponible'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Aucun produit disponible</p>
        )}
    </section>
  );
};

export default ProductsList;
