import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { updateQuantity, removeFromCart } from "../../store/cartSlice";
import { applyCoupon, removeCoupon } from "../../store/couponSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "./Button";
import logo from "../../assets/images/e-market-logo.jpeg";

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();

  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { appliedCoupon, error: couponError, loading: couponLoading } = useSelector((state) => state.coupon);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api/v2", "");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleApplyCoupon = () => {
    dispatch(applyCoupon(couponCode));
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };
  
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
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

  const getImageUrl = (images) => {
    if (!Array.isArray(images) || images.length === 0) return logo;

    let imageUrl;

    const primaryImage = images.find((img) => img && img.isPrimary && img.imageUrl);
    if (primaryImage) {
        imageUrl = primaryImage.imageUrl;
    } else if (images[0] && images[0].imageUrl) {
        imageUrl = images[0].imageUrl;
    } else {
        return logo;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${baseUrl}${imageUrl}`;
  };

  return (
    <>
      {/* --- Trigger Button --- */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="flex items-center gap-2"
      >
        <AiOutlineShoppingCart className="w-6 h-6" />
        <div className="hidden md:flex flex-col items-start">
          <span className="text-xs text-gray-500">Panier</span>
          <span className="text-sm font-semibold">
            {finalTotal.toFixed(2)} €
          </span>
        </div>
      </Button>

      {/* --- Overlay --- */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 transition-opacity z-50"
        ></div>
      )}

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 h-full ${isOpen ? "w-96 -right-4" : "w-0 -right-4"}  bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Votre Panier</h2>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">
              Votre panier est vide.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between mb-4 border-b pb-3"
              >
                <img
                  src={getImageUrl(item.imageUrls)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><FiMinus size={12} /></button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><FiPlus size={12} /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">
                    {(item.quantity * item.price).toFixed(2)} €
                  </span>
                  <button onClick={() => handleRemoveFromCart(item._id)} className="text-gray-400 hover:text-red-600 mt-2"><FiTrash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-5">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-semibold">
              {totalAmount.toFixed(2)} €
            </span>
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
          {couponError && <p className="text-sm text-red-500 mt-2">{couponError}</p>}
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
            as={Link}
            to="/checkout"
            onClick={() => setIsOpen(false)}
            fullWidth
            className="text-center mt-6"
          >
            Passer la commande
          </Button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
