import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import logo from '../assets/images/e-market.png';
import {
  Badge,
  Button,
  Card,
  LoadingSpinner,
  StarRating,
} from '../components/common';
import ProductsList from '../components/common/ProductsList';
import {
  AiOutlineShoppingCart,
  AiOutlineFire,
  AiOutlineStar,
  AiOutlineRocket,
  AiOutlineSafety,
  AiOutlineCustomerService,
  AiOutlineLaptop,
  AiOutlineBook,
  AiOutlineHeart,
  AiOutlineHome,
} from 'react-icons/ai';
import { FaTshirt, FaFootballBall } from 'react-icons/fa';
import { MdLocalFlorist } from 'react-icons/md';

// Move static constants outside component (better performance)
const FEATURES = [
  {
    icon: <AiOutlineRocket className="w-8 h-8" />,
    title: 'Livraison Rapide',
    description: 'Recevez vos commandes en 24-48h',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: <AiOutlineSafety className="w-8 h-8" />,
    title: 'Paiement Sécurisé',
    description: 'Transactions 100% sécurisées',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: <AiOutlineCustomerService className="w-8 h-8" />,
    title: 'Support 24/7',
    description: 'Une équipe à votre écoute',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: <AiOutlineStar className="w-8 h-8" />,
    title: 'Qualité Garantie',
    description: 'Produits vérifiés et certifiés',
    gradient: 'from-orange-500 to-orange-600',
  },
];

const CATEGORY_ICONS = {
  Clothing: {
    icon: <FaTshirt className="w-7 h-7" />,
    color: 'bg-pink-100 text-pink-600',
  },
  Sports: {
    icon: <FaFootballBall className="w-7 h-7" />,
    color: 'bg-green-100 text-green-600',
  },
  'Home & Garden': {
    icon: <MdLocalFlorist className="w-7 h-7" />,
    color: 'bg-yellow-100 text-yellow-600',
  },
  Electronics: {
    icon: <AiOutlineLaptop className="w-7 h-7" />,
    color: 'bg-blue-100 text-blue-600',
  },
  Books: {
    icon: <AiOutlineBook className="w-7 h-7" />,
    color: 'bg-purple-100 text-purple-600',
  },
  Beauty: {
    icon: <AiOutlineHeart className="w-7 h-7" />,
    color: 'bg-rose-100 text-rose-600',
  },
};

const randomColors = [
  'bg-pink-100 text-pink-600',
  'bg-green-100 text-green-600',
  'bg-blue-100 text-blue-600',
  'bg-yellow-100 text-yellow-600',
  'bg-purple-100 text-purple-600',
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useFetch('products?limit=8&sortBy=rating');

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch('categories');

  const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v2', '');

  // Safe product fetch
  useEffect(() => {
    if (productsData?.data?.products?.length) {
      setFeaturedProducts(productsData.data.products);
    }
  }, [productsData]);

  // Safe categories fetch
  useEffect(() => {
    if (categoriesData?.data?.categories?.length) {
      setCategories(categoriesData.data.categories);
    }
  }, [categoriesData]);

  // Safe image handling
  const getProductImage = (imageUrls) => {
    try {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) return logo;
      const primaryImage = imageUrls.find((img) => img.isPrimary);
      const imageUrl = primaryImage?.imageUrl || imageUrls[0]?.imageUrl;
      return `${baseUrl}${imageUrl}`;
    } catch {
      return logo;
    }
  };

  // Handle Add to Cart
  const handleAddToCart = useCallback((product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find((item) => item._id === product._id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.title} ajouté au panier`);
    } else {
      alert(`${product.title} est déjà dans le panier`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌈 Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container max-w-screen-xl mx-auto px-5 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Bienvenue sur <span className="text-yellow-300">E-Market</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Découvrez des milliers de produits de qualité à des prix
                imbattables. Achetez et vendez en toute confiance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/products')}
                  variant="light"
                  className="flex justify-center items-center"
                >
                  <AiOutlineShoppingCart className="w-5 h-5 mr-2" />
                  Voir les produits
                </Button>
                {!user && (
                  <Button
                    size="lg"
                    variant="gradient"
                    onClick={() => navigate('/register')}
                    // className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    S'inscrire gratuitement
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-blue-200 text-sm">Produits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5K+</div>
                  <div className="text-blue-200 text-sm">Clients satisfaits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">1K+</div>
                  <div className="text-blue-200 text-sm">Vendeurs</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
                <img
                  src={logo}
                  alt="E-Market logo"
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💎 Features Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-screen-xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🗂️ Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-screen-xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explorer par catégorie
            </h2>
            <p className="text-gray-600 text-lg">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>

          {categoriesLoading ? (
            <LoadingSpinner size="lg" text="Chargement des catégories..." />
          ) : categoriesError ? (
            <p className="text-red-500 text-center">
              Erreur lors du chargement des catégories.
            </p>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => {
                const config =
                  CATEGORY_ICONS[category.name] || {
                    icon: <AiOutlineHome className="w-7 h-7" />,
                    color: randomColors[index % randomColors.length],
                };

                return (
                  <Card
                    key={index}
                    hover
                    className="text-center cursor-pointer group"
                    onClick={() =>
                      navigate(`/products?category=${category.name}`)
                    }
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-3 rounded-full ${config.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}
                    >
                      {config.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Aucune catégorie trouvée
            </p>
          )}
        </div>
      </section>

      {/* 🔥 Featured Products Section — now uses Redux-backed ProductsList */}
      <section className="py-16 bg-white">
        <div className="container max-w-screen-xl mx-auto px-5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <AiOutlineFire className="text-orange-500" />
                Produits populaires
              </h2>
              <p className="text-gray-600 text-lg">Les meilleures ventes du moment</p>
            </div>
            <Button onClick={() => navigate('/products')}>Voir tout</Button>
          </div>

          {/* Render products from Redux (ProductsList dispatches fetchProducts) */}
          <ProductsList limit={8} sortBy="rating" />
        </div>
      </section>


      {/* 🚀 CTA Section */}
      {/* {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container max-w-screen-xl mx-auto px-5 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à commencer?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs satisfaits et profitez
              d'une expérience d'achat unique
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Créer un compte
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Se connecter
              </Button>
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
};

export default Home;
