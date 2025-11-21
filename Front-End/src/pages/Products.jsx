import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "../components/common"; // Keep custom pagination for now
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
    if (error) {
      toast.error(error.message || "Erreur lors du chargement des produits");
    }
  }, [error]);

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
    <div className="min-h-screen bg-gray-50">
      {(selectedCategory || categoryFromUrl) && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-5">
            <h1 className="text-5xl font-bold mb-2">{selectedCategory || categoryFromUrl}</h1>
            <p className="text-blue-100 text-lg">Découvrez notre sélection</p>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-5 py-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="hidden lg:flex gap-4">
              <Select value={selectedCategory || "all"} onValueChange={(value) => { setSelectedCategory(value === "all" ? "" : value); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Prix min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }} className="w-28" />
              <Input type="number" placeholder="Prix max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }} className="w-28" />
              <div className="flex items-center space-x-2">
                <Checkbox id="inStock" checked={inStock} onCheckedChange={(checked) => { setInStock(checked); setCurrentPage(1); }} />
                <label htmlFor="inStock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">En stock</label>
              </div>
            </div>
            <div className="lg:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline"><FiFilter className="w-5 h-5" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filtres</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Select value={selectedCategory || "all"} onValueChange={(value) => { setSelectedCategory(value === "all" ? "" : value); setCurrentPage(1); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Prix min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }} />
                    <Input type="number" placeholder="Prix max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }} />
                    <div className="flex items-center space-x-2">
                      <Checkbox id="inStockMobile" checked={inStock} onCheckedChange={(checked) => { setInStock(checked); setCurrentPage(1); }} />
                      <label htmlFor="inStockMobile" className="text-sm font-medium">En stock</label>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Button variant="ghost" onClick={handleResetFilters} title="Réinitialiser les filtres"><FiRefreshCw /></Button>
          </div>
          <div className="hidden lg:flex items-center justify-between mt-4">
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => { const [newSortBy, newOrder] = value.split("-"); setSortBy(newSortBy); setSortOrder(newOrder); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Plus récent</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating-desc">Note</SelectItem>
                </SelectContent>
              </Select>
            <p className="text-sm text-gray-500">{metadata.total || 0} résultats</p>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-5 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: metadata.pageSize || 8 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
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
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres.</p>
                <Button onClick={handleResetFilters}>Réinitialiser les filtres</Button>
              </div>
            )}

            {!loading && metadata?.totalPages > 1 && (
              <Pagination
                currentPage={metadata.currentPage}
                totalPages={metadata.totalPages}
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
