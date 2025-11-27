import React, { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateQuantity, removeFromCart } from "../../store/cartSlice";
import { applyCoupon, removeCoupon } from "../../store/couponSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "../ui/sheet";
import { Badge } from "../ui/badge";
import logo from "../../assets/images/e-market-logo.jpeg";
import { API_URL } from "../../utils/env";

const CartSidebar = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { appliedCoupon, error: couponError, loading: couponLoading } = useSelector((state) => state.coupon);



  const baseUrl = API_URL.replace("/api/v2", "");

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

  const handleCheckoutClick = () => {
    setIsOpen(false);
  };

  let discount = 0;
  if (appliedCoupon && totalAmount > appliedCoupon.minAmount) {
    if (appliedCoupon.type === 'percentage') {
      discount = (totalAmount * appliedCoupon.value) / 100;
    } else {
      discount = appliedCoupon.value;
    }
  }

  const finalTotal = totalAmount - discount;

  const getImageUrl = (images) => {
    if (!Array.isArray(images) || images.length === 0) return logo;
    let imageUrl = images.find(img => img && img.isPrimary && img.imageUrl)?.imageUrl || images[0]?.imageUrl;
    if (!imageUrl) return logo;
    return imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <AiOutlineShoppingCart className="w-6 h-6" />
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs text-gray-500">Panier</span>
            <span className="text-sm font-semibold">
              {finalTotal.toFixed(2)} €
            </span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col rounded-l-lg">
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">
              Votre panier est vide.
            </p>
          ) : (
            cartItems.map((item) => (
              <Card key={item._id} className="mb-4">
                <CardContent className="flex items-center justify-between p-4">
                  <img
                    src={getImageUrl(item.imageUrls)}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex flex-col flex-grow ml-4">
                    <span className="text-sm font-medium text-gray-800">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      >
                        <FiMinus size={12} />
                      </Button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      >
                        <FiPlus size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                      {(item.quantity * item.price).toFixed(2)} €
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-600 mt-2 h-6 w-6"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <SheetFooter className="p-4 border-t">
          <div className="px-4 pt-4 pb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-semibold">{totalAmount.toFixed(2)} €</span>
            </div>
            {!appliedCoupon ? (
              <div className="mt-4">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                  Code promo
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="coupon"
                    id="coupon"
                    placeholder="Entrez votre code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "..." : "Appliquer"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between">
                <Badge className="bg-green-50 text-green-700 border border-green-700">
                  Coupon "{appliedCoupon.code}" appliqué !
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={handleRemoveCoupon}
                  title="Supprimer le coupon"
                >
                  <FiTrash2 size={16} />
                </Button>
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
            <Button asChild className="w-full text-center mt-6" onClick={handleCheckoutClick}>
              <Link to="/checkout">
                Passer la commande
              </Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
