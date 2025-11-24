import React, { useEffect, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import {
  fetchOrders,
  selectAllOrders,
  selectOrdersStatus,
  selectOrdersError,
  selectOrdersPage,
  selectOrdersTotal,
} from "../store/ordersSlice";
import {
  Badge,
  Button,
  Card,
  LoadingSpinner,
  Alert,
  Pagination,
} from "../components/common";
import {
  AiOutlineShoppingCart,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineEye,
  AiOutlineInbox,
  AiOutlineFilter,
} from "react-icons/ai";
import { FaTruck, FaBoxOpen } from "react-icons/fa";

// Order status configuration
const ORDER_STATUS_CONFIG = {
  pending: {
    variant: "warning",
    label: "En attente",
    icon: <AiOutlineClockCircle className="w-4 h-4" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  paid: {
    variant: "info",
    label: "Payé",
    icon: <FaBoxOpen className="w-4 h-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  shipped: {
    variant: "primary",
    label: "Expédié",
    icon: <FaTruck className="w-4 h-4" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  delivered: {
    variant: "success",
    label: "Livré",
    icon: <AiOutlineCheckCircle className="w-4 h-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  cancelled: {
    variant: "danger",
    label: "Annulé",
    icon: <AiOutlineCloseCircle className="w-4 h-4" />,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

const FILTER_OPTIONS = [
  { value: "all", label: "Toutes les commandes", icon: <AiOutlineInbox /> },
  { value: "pending", label: "En attente", icon: <AiOutlineClockCircle /> },
  { value: "paid", label: "En cours", icon: <FaBoxOpen /> },
  { value: "shipped", label: "Expédiées", icon: <FaTruck /> },
  { value: "delivered", label: "Livrées", icon: <AiOutlineCheckCircle /> },
  { value: "cancelled", label: "Annulées", icon: <AiOutlineCloseCircle /> },
];

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loaderData = useLoaderData();
  const { user } = useAuth();

  // Redux state
  const ordersFromStore = useSelector(selectAllOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);
  const currentPage = useSelector(selectOrdersPage);
  const totalOrders = useSelector(selectOrdersTotal);

  // Local state
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Use loader data initially, then Redux
  const orders =
    ordersFromStore.length > 0
      ? ordersFromStore
      : loaderData?.data?.orders || [];

  // Fetch orders on mount and when filters change
  useEffect(() => {
    if (user) {
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (selectedFilter !== "all") {
        params.status = selectedFilter;
      }

      if (sortBy === "newest") {
        params.sortBy = "-createdAt";
      } else if (sortBy === "oldest") {
        params.sortBy = "createdAt";
      } else if (sortBy === "highest") {
        params.sortBy = "-totalPrice";
      } else if (sortBy === "lowest") {
        params.sortBy = "totalPrice";
      }

      dispatch(fetchOrders(params));
    }
  }, [dispatch, user, currentPage, selectedFilter, sortBy]);

  // Filter orders locally if needed
  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(
      fetchOrders({
        page,
        limit: 10,
        status: selectedFilter !== "all" ? selectedFilter : undefined,
      })
    );
  };

  // Get status badge
  const getOrderStatusBadge = (status) => {
    const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <section className="container mx-auto">
        <div className="container">
          <div className="text-center">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 max-w-7xl mx-auto px-5">
              <Card
                hover
                className="text-center cursor-pointer group"
                onClick={() => setSelectedFilter("all")}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                  <AiOutlineShoppingCart />
                </div>
                <div className="text-gray-600 text-sm mt-1 font-bold">
                  Total : {stats.total}
                </div>
              </Card>
              <Card
                hover
                className="text-center cursor-pointer group"
                onClick={() => setSelectedFilter("pending")}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                  <AiOutlineClockCircle />
                </div>
                <div className="text-gray-600 text-sm mt-1 font-bold">
                  En attente : {stats.pending}
                </div>
              </Card>
              <Card
                hover
                className="text-center cursor-pointer group"
                onClick={() => setSelectedFilter("paid")}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                  <FaBoxOpen />
                </div>
                <div className="text-gray-600 text-sm mt-1 font-bold">
                  En cours : {stats.paid}
                </div>
              </Card>
              <Card
                hover
                className="text-center cursor-pointer group"
                onClick={() => setSelectedFilter("delivered")}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                  <AiOutlineCheckCircle />
                </div>
                <div className="text-gray-600 text-sm mt-1 font-bold">
                  Livrées : {stats.delivered}
                </div>
              </Card>
              <Card
                hover
                className="text-center cursor-pointer group"
                onClick={() => setSelectedFilter("cancelled")}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                  <AiOutlineCloseCircle />
                </div>
                <div className="text-gray-600 text-sm mt-1 font-bold">
                  Annulées : {stats.cancelled}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-5">
          {/* Filters and Sort */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full">
                <AiOutlineFilter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Filtrer:</span>
                <div className="flex flex-wrap justify-between w-full">
                  {FILTER_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={
                        selectedFilter === option.value
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setSelectedFilter(option.value)}
                      className="flex items-center gap-1"
                    >
                      {option.icon}
                      {option.label}
                    </Button>
                  ))}
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Trier:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">Plus récentes</option>
                      <option value="oldest">Plus anciennes</option>
                      <option value="highest">Prix décroissant</option>
                      <option value="lowest">Prix croissant</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              message={
                error?.message || "Erreur lors du chargement des commandes"
              }
              className="mb-6"
            />
          )}

          {/* Loading State */}
          {status === "loading" && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="xl" text="Chargement des commandes..." />
            </div>
          )}

          {/* Empty State */}
          {status !== "loading" && filteredOrders.length === 0 && (
            <div className="text-center">
              <div className="inline-block p-6 sm:p-8 bg-white rounded-3xl shadow-xl">
                <div className="text-6xl sm:text-7xl mb-3">📦</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto text-sm sm:text-base">
                  {selectedFilter === "all"
                    ? "Vous n'avez pas encore passé de commande"
                    : `Aucune commande avec le statut "${FILTER_OPTIONS.find((f) => f.value === selectedFilter)
                      ?.label
                    }"`}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {selectedFilter !== "all" && (
                    <Button
                      onClick={() => setSelectedFilter("all")}
                      variant="secondary"
                      size="lg"
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate("/products")}
                    size="lg"
                    className="flex items-center justify-center gap-2"
                  >
                    <AiOutlineShoppingCart className="w-5 h-5" />
                    Découvrir nos produits
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          {status !== "loading" && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig =
                  ORDER_STATUS_CONFIG[order.status] ||
                  ORDER_STATUS_CONFIG.pending;

                return (
                  <Card
                    key={order._id}
                    hover
                    className="group border-l-4 transition-all duration-300 hover:shadow-xl relative"
                    style={{
                      borderLeftColor: statusConfig.color.replace("text-", ""),
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              Commande #
                              {order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {order.itemCount} produit(s)
                            </p>
                          </div>
                          {getOrderStatusBadge(order.status)}
                        </div>

                        {/* Order Details */}
                        <div className="">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="font-bold text-blue-600 text-lg">
                              {order.total?.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions — Show on Hover */}
                    </div>
                    <div className="hidden group-hover:flex lg:flex-col gap-2 transition-all absolute min-w-full min-h-full h-full top-0 left-0">
                      <Button
                        onClick={() => navigate(`/order/${order._id}`)}
                        variant="primaryLight"
                        className="flex items-center justify-center gap-2 min-h-full min-w-full hover:bg-black bg-black"
                        fullWidth
                      >
                        <AiOutlineEye className="w-4 h-4" />
                        Voir détails
                      </Button>

                      {order.status === "delivered" && (
                        <Button
                          variant="secondary"
                          className="flex items-center justify-center gap-2"
                          fullWidth
                        >
                          Laisser un avis
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && totalOrders > 10 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalOrders / 10)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Orders;
