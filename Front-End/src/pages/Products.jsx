import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import ProductCard from "../components/ProductCard";
import {
  Alert,
  Button,
  Pagination,
  ProductCardSkeleton,
} from "../components/common";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiRefreshCw,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiCheckSquare,
} from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Products = () => {
  const dispatch = useDispatch();
  const { products, metadata, loading, error } = useSelector(
    (state) => state.products,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category") || "";

  useEffect(() => {
    const filters = {
      page: currentPage,
      category: selectedCategory || categoryFromUrl,
      search: searchTerm,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      order: sortOrder,
    };
    dispatch(fetchProducts(filters));
  }, [
    dispatch,
    currentPage,
    selectedCategory,
    categoryFromUrl,
    searchTerm,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Categories - you can fetch these from your API or pass as props
  const categories = [
    "Électronique",
    "Vêtements",
    "Maison",
    "Sports",
    "Livres",
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);

    if (location.search) {
      navigate("/products", { replace: true });
    }
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    inStock,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Category */}
      {(selectedCategory || categoryFromUrl) && (
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-5 relative z-10">
            <h1 className="text-5xl font-bold mb-2">
              {selectedCategory || categoryFromUrl}
            </h1>
            <p className="text-blue-100 text-lg">Découvrez notre sélection</p>
          </div>
        </div>
      )}

      {/* Modern Search and Filters Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-5">
          {filtersOpen ? (
            <div className="py-4">
              {/* Search Bar with Toggle and Reset Buttons */}
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="flex-1 relative group">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="Rechercher des produits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-12 h-12 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-base"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
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

                  <div className="hidden lg:grid grid-cols-6 gap-3">
                    {/* Category */}
                    <div className="relative">
                      <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium w-full"
                      >
                        <option value="">Toutes les catégories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Min Price */}
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Prix min"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium w-full"
                        min="0"
                      />
                    </div>

                    {/* Max Price */}
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Prix max"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium w-full"
                        min="0"
                      />
                    </div>

                    {/* Sort */}
                    <div className="relative col-span-2">
                      <FiTrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [newSortBy, newOrder] =
                            e.target.value.split("-");
                          setSortBy(newSortBy);
                          setSortOrder(newOrder);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm font-medium w-full"
                      >
                        <option value="date-desc">Plus récent</option>
                        <option value="price-asc">Prix croissant</option>
                        <option value="price-desc">Prix décroissant</option>
                        <option value="rating-desc">Note</option>
                      </select>
                    </div>

                    {/* Stock Toggle */}
                    <label
                      className={`flex items-center justify-center gap-2 px-4 h-12 rounded-xl cursor-pointer transition-all text-sm font-medium
                        ${inStock ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"}`}
                    >
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => {
                          setInStock(e.target.checked);
                          setCurrentPage(1);
                        }}
                        className="hidden" // Hide the native checkbox
                      />
                      <FiCheckSquare
                        className={`w-5 h-5 ${inStock ? "text-white" : "text-gray-400"}`}
                      />
                      <span>En stock</span>
                    </label>
                  </div>

                  {/* Mobile Filters */}
                  {showMobileFilters && (
                    <div className="lg:hidden grid grid-cols-2 gap-3 mt-4 animate-fadeIn">
                      <div className="relative col-span-2">
                        <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          value={selectedCategory}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all w-full"
                        >
                          <option value="">Toutes les catégories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Prix min"
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all w-full"
                          min="0"
                        />
                      </div>

                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Prix max"
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all w-full"
                          min="0"
                        />
                      </div>

                      <div className="relative col-span-2">
                        <FiTrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          value={`${sortBy}-${sortOrder}`}
                          onChange={(e) => {
                            const [newSortBy, newOrder] =
                              e.target.value.split("-");
                            setSortBy(newSortBy);
                            setSortOrder(newOrder);
                            setCurrentPage(1);
                          }}
                          className="pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all w-full"
                        >
                          <option value="date-desc">Plus récent</option>
                          <option value="price-asc">Prix croissant</option>
                          <option value="price-desc">Prix décroissant</option>
                          <option value="rating-desc">Note</option>
                        </select>
                      </div>

                      <label
                        className={`col-span-2 flex items-center justify-center gap-2 px-4 h-12 rounded-xl cursor-pointer transition-all
                          ${inStock ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"}`}
                      >
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => {
                            setInStock(e.target.checked);
                            setCurrentPage(1);
                          }}
                          className="hidden" // Hide the native checkbox
                        />
                        <FiCheckSquare
                          className={`w-5 h-5 ${inStock ? "text-white" : "text-gray-400"}`}
                        />
                        <span className="text-sm font-medium">
                          En stock uniquement
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Collapse and Reset Buttons */}
                <div className="flex flex-col gap-3">
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
                    className={`h-[52px] w-[52px] ${activeFiltersCount > 0 ? "cursor-not-allowed " : "cursor-not-allowed "}`}
                    title="Réinitialiser les filtres"
                  >
                    <FiRefreshCw />
                  </Button>
                </div>
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
      <section className="container mx-auto px-5 py-10">
        {error && (
          <Alert
            type="error"
            message={`Erreur lors du chargement des produits: ${error}`}
          />
        )}

        {/* Results Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            {!loading && (
              <h2 className="text-2xl font-bold text-gray-800">
                {metadata.total || 0} produit
                {(metadata.total || 0) > 1 ? "s" : ""}
              </h2>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: metadata.limit || 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-white rounded-3xl shadow-xl">
                  <div className="text-7xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Nous n'avons trouvé aucun produit correspondant à vos
                    critères. Essayez de modifier vos filtres.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
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
                className="mt-12"
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Products;
