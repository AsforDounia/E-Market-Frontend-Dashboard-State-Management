import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, payForOrder } from "../store/ordersSlice";
import { applyCoupon, removeCoupon } from "../store/couponSlice";
import { FiShoppingCart } from "react-icons/fi";
import { Button, Alert, Input } from "../components/common";

const Checkout = () => {
  const [couponCode, setCouponCode] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { loading, error, currentOrder } = useSelector((state) => state.orders);
  const { appliedCoupon, error: couponError, loading: couponLoading } = useSelector((state) => state.coupon);

  const handleShippingInfoChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    dispatch(createOrder({ 
      couponCodes: appliedCoupon ? [appliedCoupon.code] : [],
      shippingInfo,
      cartItems: cartItems.map(item => ({ productId: item._id, quantity: item.quantity }))
    }));
  };
  
  const handlePayment = () => {
    if (currentOrder?.orderId) {
      dispatch(payForOrder(currentOrder.orderId));
    }
  };

  const handleApplyCoupon = () => {
    dispatch(applyCoupon(couponCode));
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  let discount = 0;
  if (appliedCoupon && totalAmount > appliedCoupon.minAmount) {
    if (appliedCoupon.type === 'percentage') {
      discount = (totalAmount * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else {
      discount = appliedCoupon.value;
    }
  }

  const finalTotal = totalAmount - discount;

  useEffect(() => {
    if (currentOrder?.status === 'paid') {
      // Order was successful and paid
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  }, [currentOrder, navigate]);
  
  const isOrderCreated = currentOrder && currentOrder.status === 'pending';
  const isPaymentSuccess = currentOrder && currentOrder.status === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
        </div>

        {isPaymentSuccess && (
          <Alert
            type="success"
            message="Votre paiement a été accepté ! Vous allez être redirigé."
          />
        )}
        {error && <Alert type="error" message={error} />}
        {couponError && <Alert type="error" message={couponError} />}

        {!currentOrder && cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl">
              <FiShoppingCart className="text-7xl mb-4 mx-auto text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-gray-500 mb-6">
                Parcourez nos produits pour trouver votre bonheur.
              </p>
              <Link to="/products">
                <Button variant="primary">Découvrir les produits</Button>
              </Link>
            </div>
          </div>
        ) : (
          !isPaymentSuccess && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Information */}
              <div className={`lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 ${isOrderCreated ? 'opacity-50' : ''}`}>
                <h2 className="text-2xl font-bold border-b pb-4 mb-4">
                  Informations de livraison
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Nom complet"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingInfoChange}
                    placeholder="John Doe"
                    disabled={isOrderCreated}
                  />
                  <Input
                    label="Adresse"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    placeholder="123 rue de la Paix"
                    disabled={isOrderCreated}
                  />
                  <Input
                    label="Ville"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingInfoChange}
                    placeholder="Paris"
                    disabled={isOrderCreated}
                  />
                  <Input
                    label="Code postal"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingInfoChange}
                    placeholder="75001"
                    disabled={isOrderCreated}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold border-b pb-4 mb-4">
                    Résumé de la commande
                  </h2>
                   <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">
                      {totalAmount.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold">Gratuite</span>
                  </div>
                  {!appliedCoupon && !isOrderCreated && (
                    <div className="mt-4">
                      <label
                        htmlFor="coupon"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Code promo
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="coupon"
                          id="coupon"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          placeholder="Entrez votre code promo"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          type="button"
                          className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? "..." : "Appliquer"}
                        </button>
                      </div>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">Coupon "{appliedCoupon.code}" appliqué !</p>
                      {!isOrderCreated && <button onClick={handleRemoveCoupon} className="text-sm text-red-500">Supprimer</button>}
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 mt-4">
                      <span className="text-gray-600">Réduction</span>
                      <span className="font-semibold">- {discount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)} €</span>
                  </div>
                  
                  {!isOrderCreated ? (
                    <Button
                      variant="primary"
                      className="w-full mt-6"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      {loading ? "Création..." : "Passer la commande"}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-full mt-6"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? "Paiement..." : "Payer maintenant"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Checkout;