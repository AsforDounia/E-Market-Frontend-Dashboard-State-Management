import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import logo from '../assets/images/e-market-logo.jpeg';
import { Alert, Badge, Button, Card, LoadingSpinner, Pagination, StarRating } from '../components/common';
import { FiSearch, FiX, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus, selectProductsError } from '../slices/productsSlice';
import { IoClose } from 'react-icons/io5';

const Products = () => {
  const loaderData = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(loaderData?.data?.products || []);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category') || '';

  // Redux hooks
  const dispatch = useDispatch();
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  // Build API URL with all filters
  const category = selectedCategory || categoryFromUrl;
  const search = searchTerm;
  const order = sortOrder;
  
  const apiUrl = `products?page=${currentPage}&category=${category}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&inStock=${inStock}&sortBy=${sortBy}&order=${order}`;
  
  const { data = loaderData, loading, error } = useFetch(apiUrl);
  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v2', '') : '';

  useEffect(() => {
    if (data?.data?.products) {
      setProducts(data.data.products);
    } else if (loaderData?.data?.products) {
      setProducts(loaderData.data.products);
    } else {
      setProducts([]);
    }
  }, [data, loaderData]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Sync currentPage with API metadata if available
  useEffect(() => {
    if (data?.metadata?.currentPage) {
      setCurrentPage(data.metadata.currentPage);
    }
  }, [data?.metadata]);

  const metadata = data?.metadata || loaderData?.metadata || {};

  const { data: categoriesData } = useFetch('categories');
  console.log(categoriesData);
  const categories = categoriesData?.data?.categories?.map(cat => cat.name) || [];

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);

    if (location.search) {
      navigate('/products', { replace: true });
    }
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    inStock
  ].filter(Boolean).length;

  const renderStockIndicator = (product) => {
    const stockQuantity = product.stock || 0;
    if (stockQuantity === 0) {
      return <Badge variant="danger" dot>Rupture de stock</Badge>;
    }
    if (stockQuantity > 0 && stockQuantity <= 10) {
      return <Badge variant="warning" dot>Stock limité ({stockQuantity} restants)</Badge>;
    }
    return <Badge variant="success" dot>En stock ({stockQuantity} disponibles)</Badge>;
  };

  const getProductImage = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return logo;
    const primaryImage = imageUrls.find((img) => img.isPrimary);
    const imageUrl = primaryImage ? primaryImage.imageUrl : imageUrls[0].imageUrl;
    return baseUrl ? `${baseUrl}${imageUrl}` : imageUrl;
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product.title);
    // Add your cart logic here
  };

  if (status === 'loading') return <div>Chargement des produits…</div>;
  if (status === 'failed') return <div>Erreur: {error?.message || JSON.stringify(error)}</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Category */}
      {(selectedCategory || categoryFromUrl) && (
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-12 sm:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-5 relative z-10">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2">
              {selectedCategory || categoryFromUrl}
            </h1>
            <p className="text-blue-100 text-sm sm:text-lg">Découvrez notre sélection</p>
          </div>
        </div>
      )}

      {/* Modern Search and Filters Bar */}
 {/* Modern Search and Filters Bar */}
<div className="z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
  <div className="container max-w-screen-xl mx-auto px-5 py-4">
    {filtersOpen ? (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Search Bar */}
        <div className="flex-1 w-full">
          <div className="flex gap-3 items-center mb-4">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-5 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <FiFilter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:grid grid-cols-6 gap-3">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="">📦 Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="💰 Prix min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium"
              min="0"
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="💰 Prix max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium"
              min="0"
            />

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newOrder);
                setCurrentPage(1);
              }}
              className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="date-desc">🕐 Plus récent</option>
              <option value="price-asc">💵 Prix croissant</option>
              <option value="price-desc">💵 Prix décroissant</option>
              <option value="rating-desc">⭐ Note</option>
            </select>

            {/* Stock Toggle */}
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => {
                  setInStock(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">✓ En stock</span>
            </label>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden grid grid-cols-2 gap-3 mt-4 animate-fadeIn">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="">📦 Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="💰 Prix min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                min="0"
              />

              <input
                type="number"
                placeholder="💰 Prix max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                min="0"
              />

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newOrder);
                  setCurrentPage(1);
                }}
                className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="date-desc">🕐 Plus récent</option>
                <option value="price-asc">💵 Prix croissant</option>
                <option value="price-desc">💵 Prix décroissant</option>
                <option value="rating-desc">⭐ Note</option>
              </select>

              <label className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => {
                    setInStock(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">✓ En stock uniquement</span>
              </label>
            </div>
          )}
        </div>

        {/* Collapse and Reset Buttons */}
        <div className="min-h-full flex flex-col gap-4">
          <Button
            variant="secondary"
            onClick={() => setFiltersOpen(false)}
            className="h-[52px] w-[52px]"
            title="Masquer les filtres"
          >
            <FaChevronUp />
          </Button>
          <Button
            variant="secondary"
            onClick={handleResetFilters}
            className={`h-[52px] w-[52px] ${activeFiltersCount > 0 ? 'cursor-not-allowed' : ''}`}
            title="Réinitialiser les filtres"
          >
            <FiRefreshCw />
          </Button>
        </div>
      </div>
    ) : (
      /* Collapsed State */
      <div className="py-2">
        <Button
          variant="secondary"
          onClick={() => setFiltersOpen(true)}
          className="w-full flex items-center justify-between"
        >
          <span>Ouvrir la recherche et les filtres</span>
          <FaChevronDown />
        </Button>
      </div>
    )}
  </div>
</div>


      {/* Products Section */}
      <section className="container max-w-screen-xl mx-auto px-5 py-12">
        {error && (
          <Alert 
            type="error" 
            message={`Erreur lors du chargement des produits: ${error}`}
          />
        )}

        {/* Results Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            {!loading && (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {metadata.total || 0} produit{(metadata.total || 0) > 1 ? 's' : ''}
              </h2>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Chargement des produits..." />
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const isInStock = (product.stock || 0) > 0;
                  const averageRating = product.rating?.average || product.averageRating || 0;

                  return (
                    <Card key={product._id} hover padding="none">
                      <Link to={`/product/${product.slug}`} className="block relative group overflow-hidden">
                        <img
                          src={getProductImage(product.imageUrls)}
                          alt={product.title}
                          className="w-full h-48 sm:h-56 md:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          crossOrigin="anonymous"
                        />
                        {!isInStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Épuisé</span>
                          </div>
                        )}
                      </Link>

                      <div className="p-4 sm:p-5">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="text-md sm:text-lg font-semibold mb-1 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                            {product.title}
                          </h3>
                        </Link>

                        <StarRating rating={averageRating} showValue />

                        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {(typeof product.price === 'number' ? product.price : parseFloat(product.price || 0)).toFixed(2)}€
                          </span>
                        </div>

                        {renderStockIndicator(product)}

                        <Button
                          fullWidth
                          onClick={() => handleAddToCart(product)}
                          disabled={!isInStock}
                          variant={isInStock ? 'primary' : 'secondary'}
                          className="mt-3"
                        >
                          {isInStock ? '🛒 Ajouter au panier' : 'Indisponible'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20">
                <div className="inline-block p-6 sm:p-8 bg-white rounded-3xl shadow-xl">
                  <div className="text-6xl sm:text-7xl mb-3">🔍</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto text-sm sm:text-base">
                    Nous n'avons trouvé aucun produit correspondant à vos critères. Essayez de modifier vos filtres.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && metadata?.totalPages > 1 && (
              <Pagination
                currentPage={metadata.currentPage}
                totalPages={metadata.totalPages}
                hasNextPage={metadata.hasNextPage}
                hasPreviousPage={metadata.hasPreviousPage}
                onPageChange={setCurrentPage}
                className="mt-8 sm:mt-12"
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Products;