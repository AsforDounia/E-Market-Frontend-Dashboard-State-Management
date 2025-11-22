import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  AiOutlineUser,
  AiOutlineEdit,
  AiOutlineCamera,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineLock,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Loader2 } from "lucide-react";
import api from "../services/api";
import { toast } from "react-toastify";
import { updateUser } from "../store/authSlice";
import { getOrders } from "../store/ordersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Validation schemas
const profileSchema = yup.object().shape({
  fullname: yup.string().min(2, "Nom complet requis (min. 2 caractères)").required("Nom complet requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Mot de passe actuel requis"),
  newPassword: yup.string().min(6, "6 caractères minimum").required("Nouveau mot de passe requis"),
  confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], "Les mots de passe ne correspondent pas").required("Confirmation du mot de passe requise"),
});

const Profile = () => {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { orders, loading: loadingOrders, error: ordersError } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, [location]);

  useEffect(() => {
    if (ordersError) {
      toast.error("Erreur lors du chargement des commandes");
    }
  }, [ordersError]);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { fullname: user?.fullname || "", email: user?.email || "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({ fullname: user.fullname || "", email: user.email || "" });
    }
  }, [user, resetProfile]);

  const onSubmitProfile = async (data) => {
    try {
      const response = await api.put("/users/profile", data);
      if (response.data?.data?.user) {
        dispatch(updateUser(response.data.data.user));
      }
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      await api.put("/users/profile/password", data);
      toast.success("Mot de passe modifié avec succès");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la modification du mot de passe");
    }
  };

  const handleFetchOrders = () => {
    dispatch(getOrders());
  }

  const handleImageUpload = async (e) => {
    console.log('handleImageUpload called', e);
    const file = e.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      toast.error('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      console.log('Starting upload...');
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('avatar', file);

      console.log('Sending request to /users/profile/avatar');
      const response = await api.put('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Upload response:', response);
      if (response.data?.data?.user) {
        dispatch(updateUser(response.data.data.user));
        toast.success('Photo de profil mise à jour avec succès');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la photo');
    } finally {
      setUploadingImage(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) {
    navigate("/login");
    return null;
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { variant: "secondary", label: "🛍️ Acheteur" },
      seller: { variant: "default", label: "🏪 Vendeur" },
      admin: { variant: "destructive", label: "👑 Administrateur" },
    };
    const config = roleConfig[role] || roleConfig.user;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "En attente" },
      paid: { variant: "default", label: "Payée" },
      shipped: { variant: "outline", label: "Expédiée" },
      delivered: { variant: "success", label: "Livrée" },
      cancelled: { variant: "destructive", label: "Annulée" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={user?.avatarUrl ? `http://localhost:3001${user.avatarUrl}` : undefined}
                    alt={user?.fullname}
                  />
                  <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <AiOutlineCamera className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullname}</h1>
                <p className="text-gray-600 mb-3">{user.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 h-auto rounded-md bg-muted">
            <TabsTrigger value="profile"><AiOutlineUser className="w-5 h-5 mr-2" /> Mon Profil</TabsTrigger>
            <TabsTrigger value="orders" onClick={handleFetchOrders}><AiOutlineShoppingCart className="w-5 h-5 mr-2" /> Mes Commandes</TabsTrigger>
            <TabsTrigger value="security"><AiOutlineLock className="w-5 h-5 mr-2" /> Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="py-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label htmlFor="fullname">Nom complet</Label>
                      <Input id="fullname" type="text" disabled={!isEditing} {...registerProfile("fullname")} />
                      <p className="text-sm text-red-500 mt-1">{profileErrors.fullname?.message}</p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" disabled={!isEditing} {...registerProfile("email")} />
                      <p className="text-sm text-red-500 mt-1">{profileErrors.email?.message}</p>
                    </div>
                  </div>
                  <div className="w-full">
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} className="w-full">
                        <AiOutlineEdit className="w-5 h-5 mr-2" /> Modifier
                      </Button>
                    )}
                    {isEditing && (
                      <div className="flex gap-3 w-full">
                        <Button type="submit" disabled={isSubmittingProfile} className="w-1/2">
                          <AiOutlineSave className="w-5 h-5 mr-2" /> Enregistrer
                        </Button>
                        <Button type="button" variant="outline" className="w-1/2" onClick={() => { setIsEditing(false); resetProfile(); }}>
                          <AiOutlineClose className="w-5 h-5 mr-2" /> Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="py-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <AiOutlineShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande</p>
                    <Button onClick={() => navigate("/products")}>Découvrir nos produits</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Commande</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.total?.toFixed(2)}€</TableCell>
                          <TableCell>
                            <Button variant="outline" onClick={() => navigate(`/profile/order/${order._id}`)}>Voir</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="py-6">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-8">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                    <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword?.message}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                    <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword?.message}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />
                    <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword?.message}</p>
                  </div>
                  <Button type="submit" disabled={isSubmittingPassword} className="w-full">
                    Changer le mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
