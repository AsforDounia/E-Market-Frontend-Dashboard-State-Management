import { useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api/v2", "");

  
  // Disable scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

const getImageUrl = (images) => {
  if (!images || images.length === 0) return logo;
  
  const primaryImage = images.find(img => img.isPrimary);
  const imageUrl = primaryImage ? primaryImage.imageUrl : images[0].imageUrl;

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${baseUrl}${imageUrl}`;
};
  
  
  return (
    <>
      {/* --- Trigger Button --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
      >
        <AiOutlineShoppingCart className="w-6 h-6" />
        <div className="hidden md:flex flex-col items-start">
          <span className="text-xs text-gray-500">Panier</span>
          <span className="text-sm font-semibold">{cartTotal.toFixed(2)} €</span>
        </div>
      </button>

      {/* --- Overlay --- */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 transition-opacity z-50"
        ></div>
      )}

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 h-full ${isOpen ? 'w-80 -right-4' : 'w-0 -right-4'}  bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Votre Panier</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
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
                <img src={getImageUrl(item.imageUrls)} alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{item.title}</span>
                  <span className="text-xs text-gray-500">
                    {item.quantity} × {item.price.toFixed(2)} €
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  {(item.quantity * item.price).toFixed(2)} €
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm">Total :</span>
            <span className="text-lg font-semibold">{cartTotal.toFixed(2)} €</span>
          </div>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
          >
            Voir le panier
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
