import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  cancelOrder,
  selectCurrentOrder,
  selectOrdersStatus,
  selectOrdersError,
} from "../slices/orderSlice";
import {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  Alert,
} from "../components/common";
import {
  AiOutlineArrowLeft,
  AiOutlineShoppingCart,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineCalendar,
  AiOutlineTag,
} from "react-icons/ai";
import { FaTruck, FaBoxOpen, FaReceipt } from "react-icons/fa";
import { getFullImageUrl } from "../utils/image";

// Order status configuration
const ORDER_STATUS_CONFIG = {
  pending: {
    variant: "warning",
    label: "En attente",
    icon: <AiOutlineClockCircle className="w-5 h-5" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  paid: {
    variant: "info",
    label: "Payé",
    icon: <FaBoxOpen className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  shipped: {
    variant: "primary",
    label: "Expédié",
    icon: <FaTruck className="w-5 h-5" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  delivered: {
    variant: "success",
    label: "Livré",
    icon: <AiOutlineCheckCircle className="w-5 h-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  cancelled: {
    variant: "danger",
    label: "Annulé",
    icon: <AiOutlineCloseCircle className="w-5 h-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useSelector(selectCurrentOrder);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);

  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelAlert, setCancelAlert] = React.useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  // Debug: log the order data
  useEffect(() => {
    if (order) {
      console.log("Order data:", order);
    }
  }, [order]);

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

  // Get status configuration
  const getStatusConfig = (status) => {
    return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
  };

  // Calculate item count
  const getItemCount = () => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }

    setIsCancelling(true);
    setCancelAlert(null);
    try {
      await dispatch(cancelOrder(id)).unwrap();
      // Refetch the order to get the updated status
      await dispatch(fetchOrderById(id)).unwrap();
      setCancelAlert({ type: "success", message: "Commande annulée avec succès" });
    } catch (err) {
      setCancelAlert({ 
        type: "error", 
        message: err?.message || "Erreur lors de l'annulation de la commande" 
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Chargement de la commande..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <Alert
          type="error"
          message={error?.message || "Erreur lors du chargement de la commande"}
        />
        <div className="mt-4">
          <Button onClick={() => navigate("/orders")} variant="secondary" className="flex items-center">
            <AiOutlineArrowLeft className="w-4 h-4 mr-2" />
            Retour aux commandes
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <Alert type="warning" message="Commande non trouvée" />
        <div className="mt-4">
          <Button onClick={() => navigate("/orders")} variant="secondary" className="flex items-center">
            <AiOutlineArrowLeft className="w-4 h-4 mr-2" />
            Retour aux commandes
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/orders")}
            variant="secondary"
            size="sm"
            className="mb-4 flex items-center justify-center"
          >
            <AiOutlineArrowLeft className="w-4 h-4 mr-2" />
            Retour aux commandes
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Commande #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <AiOutlineCalendar className="w-4 h-4" />
                Passée le {formatDate(order.createdAt)}
              </p>
              {itemCount > 0 && (
                <p className="text-gray-600 mt-1">
                  {itemCount} article{itemCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-xl ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}
            >
              <span className={statusConfig.color}>{statusConfig.icon}</span>
              <span className={`font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Cancel Alert */}
        {cancelAlert && (
          <div className="mb-6">
            <Alert
              type={cancelAlert.type}
              message={cancelAlert.message}
              onClose={() => setCancelAlert(null)}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <AiOutlineShoppingCart className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Articles commandés</h2>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Product Image */}
                      {item.productId?.primaryImage && (
                        <div className="w-24 h-24 shrink-0">
                          <img
                            src={getFullImageUrl(item.productId.primaryImage)}
                            alt={item.productId?.title || "Produit"}
                            className="w-full h-full object-cover rounded-lg"
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1">
                        {item.productId?.title && (
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.productId.title}
                          </h3>
                        )}
                        {item.quantity && (
                          <p className="text-sm text-gray-600 mb-2">
                            Quantité: {item.quantity}
                          </p>
                        )}
                        {item.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Prix unitaire: {item.price.toFixed(2)}€
                            </span>
                            <span className="font-bold text-blue-600">
                              {(item.price * item.quantity).toFixed(2)}€
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Order Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <AiOutlineCalendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Historique de la commande</h2>
                </div>

                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => {
                    const historyConfig = getStatusConfig(history.status);
                    return (
                      <div key={index} className="flex gap-4">
                        <div
                          className={`w-10 h-10 shrink-0 rounded-full ${historyConfig.bgColor} flex items-center justify-center`}
                        >
                          <span className={historyConfig.color}>
                            {historyConfig.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{historyConfig.label}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(history.date)}
                          </p>
                          {history.note && (
                            <p className="text-sm text-gray-500 mt-1">
                              {history.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <FaReceipt className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">Récapitulatif</h2>
              </div>

              <div className="space-y-3">
                {order.subtotal !== undefined && (
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{order.subtotal.toFixed(2)}€</span>
                  </div>
                )}

                {order.discount !== undefined && order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{order.discount.toFixed(2)}€</span>
                  </div>
                )}

                {order.total !== undefined && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {order.total.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Coupons Applied */}
            {order.coupons && order.coupons.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <AiOutlineTag className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Coupons appliqués</h2>
                </div>

                <div className="space-y-3">
                  {order.coupons.map((coupon, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        {coupon.couponId?.code && (
                          <Badge variant="success" className="font-mono">
                            {coupon.couponId.code}
                          </Badge>
                        )}
                        {coupon.couponId?.type && coupon.couponId?.value && (
                          <span className="text-green-600 font-semibold">
                            {coupon.couponId.type === "percentage"
                              ? `-${coupon.couponId.value}%`
                              : `-${coupon.couponId.value}€`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {order.status === "delivered" && (
                <Button variant="primary" fullWidth>
                  Laisser un avis
                </Button>
              )}

              {order.status === "pending" && (
                <Button 
                  variant="danger" 
                  fullWidth 
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Annulation en cours..." : "Annuler la commande"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;