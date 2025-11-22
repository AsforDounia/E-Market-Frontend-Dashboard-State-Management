import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerNav from "./SellerNav";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { FiPackage, FiShoppingBag, FiTag, FiPlus, FiClock } from "react-icons/fi";

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    // Mock statistics - replace with actual API calls
    const stats = {
        totalProducts: 0,
        pendingProducts: 0,
        totalSales: 0,
        activeCoupons: 0,
    };

    const quickActions = [
        {
            title: "Ajouter un produit",
            description: "Créer un nouveau produit",
            icon: FiPlus,
            link: "/products/create",
            color: "bg-blue-600 hover:bg-blue-700",
        },
        {
            title: "Créer un coupon",
            description: "Nouveau code promo",
            icon: FiTag,
            link: "/seller/coupons",
            color: "bg-green-600 hover:bg-green-700",
        },
        {
            title: "Voir les commandes",
            description: "Gérer vos commandes",
            icon: FiShoppingBag,
            link: "/seller/orders",
            color: "bg-purple-600 hover:bg-purple-700",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <SellerNav />
            <div className="container mx-auto px-5 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Bienvenue, {user?.fullname}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Gérez vos produits, commandes et coupons depuis votre tableau de bord
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Produits</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiPackage className="text-blue-600 text-2xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">En attente</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.pendingProducts}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <FiClock className="text-yellow-600 text-2xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Ventes</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalSales}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiShoppingBag className="text-green-600 text-2xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Coupons Actifs</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.activeCoupons}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiTag className="text-purple-600 text-2xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {quickActions.map((action, index) => (
                                <Link key={index} to={action.link}>
                                    <Button
                                        className={`w-full h-auto py-6 flex flex-col items-center gap-3 ${action.color} text-white`}
                                    >
                                        <action.icon className="text-3xl" />
                                        <div className="text-center">
                                            <p className="font-semibold">{action.title}</p>
                                            <p className="text-sm opacity-90">{action.description}</p>
                                        </div>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Getting Started Guide */}
                <Card>
                    <CardHeader>
                        <CardTitle>Guide de démarrage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Badge className="bg-blue-600 text-white">1</Badge>
                                <div>
                                    <h3 className="font-semibold mb-1">Ajoutez vos produits</h3>
                                    <p className="text-sm text-gray-600">
                                        Commencez par ajouter vos produits avec des descriptions détaillées et des images de qualité.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Badge className="bg-blue-600 text-white">2</Badge>
                                <div>
                                    <h3 className="font-semibold mb-1">Attendez la validation</h3>
                                    <p className="text-sm text-gray-600">
                                        Les administrateurs vérifieront vos produits avant leur publication.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Badge className="bg-blue-600 text-white">3</Badge>
                                <div>
                                    <h3 className="font-semibold mb-1">Gérez vos commandes</h3>
                                    <p className="text-sm text-gray-600">
                                        Suivez et traitez les commandes de vos clients depuis votre tableau de bord.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SellerDashboard;
