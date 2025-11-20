import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { createOrder } from "../store/ordersSlice";
import { applyCoupon, removeCoupon } from "../store/couponSlice";
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { Button, Alert } from "../components/common";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { loading, error, currentOrder } = useSelector((state) => state.orders);
  const { appliedCoupon, error: couponError, loading: couponLoading } = useSelector((state) => state.coupon);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleCheckout = () => {
    dispatch(createOrder({ couponCodes: appliedCoupon ? [appliedCoupon.code] : [] }));
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
    if (currentOrder) {
      // Order was successful
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  }, [currentOrder, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Votre Panier</h1>
          {cartItems.length > 0 && (
            <Button variant="danger" onClick={() => dispatch(clearCart())}>
              Vider le panier
            </Button>
          )}
        </div>

        {currentOrder && (
          <Alert
            type="success"
            message="Votre commande a été passée avec succès ! Vous allez être redirigé."
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
          !currentOrder &&
          cartItems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center py-4 border-b last:border-b-0"
                  >
                    <img
                      src={
                        item.imageUrls[0]
                          ? new URL(
                              item.imageUrls[0],
                              new URL(import.meta.env.VITE_API_URL).origin,
                            ).href
                          : "https://via.placeholder.com/150"
                      }
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-6"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{item.category}</p>
                      <p className="font-semibold text-blue-600 mt-1">
                        {item.price.toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                          className="p-2 text-gray-500 hover:text-red-500"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                          className="p-2 text-gray-500 hover:text-green-500"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <p className="font-bold w-24 text-right">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-gray-400 hover:text-red-600 p-2"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
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
                  {!appliedCoupon ? (
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
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">Coupon "{appliedCoupon.code}" appliqué !</p>
                      <button onClick={handleRemoveCoupon} className="text-sm text-red-500">Supprimer</button>
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
                  <Button
                    variant="primary"
                    className="w-full mt-6"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Traitement..." : "Passer la commande"}
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Cart;