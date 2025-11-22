import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, payForOrder } from "../store/ordersSlice";
import { applyCoupon, removeCoupon } from "../store/couponSlice";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "react-toastify";

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
    } else {
      discount = appliedCoupon.value;
    }
  }

  const finalTotal = totalAmount - discount;

  useEffect(() => {
    if (currentOrder?.status === 'paid') {
      toast.success("Votre paiement a été accepté ! Vous allez être redirigé.");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  }, [currentOrder, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (couponError) {
      toast.error(couponError);
    }
  }, [error, couponError]);

  const isOrderCreated = currentOrder && currentOrder.status === 'pending';
  const isPaymentSuccess = currentOrder && currentOrder.status === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
        </div>

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
                <Button className="bg-gray-900 text-white hover:bg-gray-700">Découvrir les produits</Button>
              </Link>
            </div>
          </div>
        ) : (
          !isPaymentSuccess && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className={`lg:col-span-2 ${isOrderCreated ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleShippingInfoChange}
                        placeholder="John Doe"
                        disabled={isOrderCreated}
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        placeholder="123 rue de la Paix"
                        disabled={isOrderCreated}
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                        placeholder="Paris"
                        disabled={isOrderCreated}
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingInfoChange}
                        placeholder="75001"
                        disabled={isOrderCreated}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Résumé de la commande</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                        <Label
                          htmlFor="coupon"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Code promo
                        </Label>
                        <div className="mt-1 flex gap-2 rounded-md shadow-sm">
                          <Input
                            type="text"
                            name="coupon"
                            id="coupon"
                            placeholder="Entrez votre code promo"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <Button
                            type="button"
                            className="bg-gray-900 text-white hover:bg-gray-700"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading}
                          >
                            {couponLoading ? "..." : "Appliquer"}
                          </Button>
                        </div>
                      </div>
                    )}
                    {appliedCoupon && (
                      <div className="mt-4 flex items-center">
                        <Badge className="bg-green-50 text-green-700 border border-green-700 px-2 py-1 rounded-md">
                          Coupon "{appliedCoupon.code}" appliqué !
                        </Badge>
                        {!isOrderCreated && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:bg-red-50 ml-2 cursor-pointer"
                            title="Supprimer le coupon"
                          >
                            <FiTrash2 size={16} />
                          </Button>
                        )}
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
                        className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-700"
                        onClick={handleCheckout}
                        disabled={loading}
                      >
                        {loading ? "Création..." : "Passer la commande"}
                      </Button>
                    ) : (
                      <Button
                        className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-700"
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading ? "Paiement..." : "Payer maintenant"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Checkout;