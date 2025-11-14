import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  AiOutlineUser, 
  AiOutlineEdit,
  AiOutlineCamera,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineLock,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import api from '../services/api';
import useFetch from '../hooks/useFetch';
import { 
  Alert, 
  Badge, 
  Button, 
  Input, 
  PasswordInput, 
  Tabs, 
  Card,
  LoadingSpinner, 
  Avatar
} from '../components/common';

// Validation schemas
const profileSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(2, 'Nom complet requis (min. 2 caractères)')
    .required('Nom complet requis'),
  email: yup
    .string()
    .email('Email invalide')
    .required('Email requis'),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Mot de passe actuel requis'),
  newPassword: yup
    .string()
    .min(6, '6 caractères minimum')
    .required('Nouveau mot de passe requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
});

const Profile = () => {
  const loaderData = useLoaderData();
  const { user, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState(null);

  // Use loader data for initial orders, then useFetch for updates
  const shouldFetchOrders = activeTab === 'orders' && user;
  const {
    data: ordersData,
    loading: loadingOrders,
    error: ordersError
  } = useFetch(shouldFetchOrders ? 'orders' : null);

  const orders = ordersData?.data?.orders || loaderData?.orders?.data?.orders || [];

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullname: user?.fullname || '',
      email: user?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      resetProfile({
        fullname: user.fullname || '',
        email: user.email || '',
      });
    }
  }, [user, resetProfile]);

  // Show orders error if any
  useEffect(() => {
    if (ordersError && activeTab === 'orders') {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des commandes' });
    }
  }, [ordersError, activeTab]);

  
  const onSubmitProfile = async (data) => {
    try {
      const response = await api.put('/users/profile', {
        fullname: data.fullname,
        email: data.email,
      });

      // Update user context with new data
      if (response.data?.data?.user) {
        updateUser(response.data.data.user);
      }

      setMessage({
        type: 'success',
        text: 'Profil mis à jour avec succès'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
      });
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      await api.put('/users/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setMessage({
        type: 'success',
        text: 'Mot de passe modifié avec succès'
      });
      
      // Reset the password form after successful update
      resetPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de la modification du mot de passe' 
      });
    }
    };


  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'En attente' },
      processing: { variant: 'info', label: 'En cours' },
      shipped: { variant: 'primary', label: 'Expédié' },
      delivered: { variant: 'success', label: 'Livré' },
      cancelled: { variant: 'danger', label: 'Annulé' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authLoading && !loaderData) {
    return <LoadingSpinner fullScreen size="xl" text="Chargement du profil..." />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { label: 'Mon Profil', value: 'profile', icon: <AiOutlineUser className="w-5 h-5" /> },
    { label: 'Mes Commandes', value: 'orders', icon: <AiOutlineShoppingCart className="w-5 h-5" /> },
    { label: 'Sécurité', value: 'security', icon: <AiOutlineLock className="w-5 h-5" /> },
  ];

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { variant: 'info', label: '🛍️ Acheteur', icon: '🛍️' },
      seller: { variant: 'primary', label: '🏪 Vendeur', icon: '🏪' },
      admin: { variant: 'danger', label: '👑 Administrateur', icon: '👑' },
    };

    const config = roleConfig[role] || roleConfig.user;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6" padding="lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar avatarUrl={user?.avatarUrl} fullname={user?.fullname} size="w-24 h-24" />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <AiOutlineCamera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <LoadingSpinner size="sm" text="" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullname}</h1>
              <p className="text-gray-600 mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>
        </Card>

        {/* Message Alert */}
        {message && (
          <Alert 
            type={message.type} 
            message={message.text}
            onClose={() => setMessage(null)}
            className="mb-6"
          />
        )}

        {/* Tabs */}
        <Card padding="none">
          <Tabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="border-b"
          />

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                  
                </div>

                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <Input
                      label="Nom complet"
                      type="text"
                      disabled={!isEditing}
                      error={profileErrors.fullname?.message}
                      className={!isEditing ? ' cursor-not-allowed' : ''}
                      {...registerProfile('fullname')}
                    />

                    {/* Email */}
                    <Input
                      label="Email"
                      type="email"
                      disabled={!isEditing}
                      error={profileErrors.email?.message}
                      className={!isEditing ? ' cursor-not-allowed' : ''}
                      {...registerProfile('email')}
                    />
                  </div>
                  <div className='w-full'>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} size="md" className='flex items-center w-full justify-center'>
                        <AiOutlineEdit className="w-5 h-5 mr-2" />
                        Modifier
                      </Button>
                    )}
                    {isEditing && (
                      <div className="flex gap-3 w-full">
                        <Button
                          type="submit"
                          loading={isSubmittingProfile}
                          variant="primary"
                          className='flex items-center w-1/2 justify-center'
                        >
                          <AiOutlineSave className="w-5 h-5 mr-2" />
                          Enregistrer
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className='flex items-center w-1/2 justify-center'
                          onClick={() => {
                            setIsEditing(false);
                            resetProfile();
                          }}
                        >
                          <AiOutlineClose className="w-5 h-5 mr-2" />
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>

                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Commandes</h2>
                
                {loadingOrders ? (
                  <LoadingSpinner size="lg" text="Chargement des commandes..." />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <AiOutlineShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande</p>
                    <Button onClick={() => navigate('/products')}>
                      Découvrir nos produits
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order._id} hover className="border-2 border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Commande #{order.orderNumber || order._id.slice(-6)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="mt-3 md:mt-0">
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              {order.items?.length || 0} article(s)
                            </p>
                            <p className="text-xl font-bold text-blue-600 mt-1">
                              {order.totalPrice?.toFixed(2)}€
                            </p>
                          </div>
                          <Button
                            onClick={() => navigate(`/order/${order._id}`)}
                            size="md"
                          >
                            Voir détails
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Changer le mot de passe</h2>
                
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              
                  {/* Current Password */}
                  <PasswordInput
                    label="Mot de passe actuel"
                    error={passwordErrors.currentPassword?.message}
                    required
                    {...registerPassword('currentPassword')}
                  />

                  {/* New Password */}
                  <PasswordInput
                    label="Nouveau mot de passe"
                    error={passwordErrors.newPassword?.message}
                    required
                    {...registerPassword('newPassword')}
                  />

                  {/* Confirm Password */}
                  <PasswordInput
                    label="Confirmer le nouveau mot de passe"
                    error={passwordErrors.confirmPassword?.message}
                    required
                    {...registerPassword('confirmPassword')}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    loading={isSubmittingPassword}
                  >
                    Changer le mot de passe
                  </Button>
                
                </form>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;