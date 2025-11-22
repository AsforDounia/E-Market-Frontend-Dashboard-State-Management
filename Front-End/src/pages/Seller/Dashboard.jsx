import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerNav from "./SellerNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, Tag, Plus, Clock, TrendingUp, DollarSign } from "lucide-react";

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    // Mock statistics - replace with actual API calls
    const stats = [
        {
            label: "Total Produits",
            value: "0",
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            label: "En attente",
            value: "0",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
        {
            label: "Total Ventes",
            value: "0",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: "Coupons Actifs",
            value: "0",
            icon: Tag,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
    ];

    const quickActions = [
        {
            title: "Ajouter un produit",
            description: "Créer un nouveau produit",
            icon: Plus,
            link: "/products/create",
            variant: "default",
            className: "bg-blue-600 hover:bg-blue-700",
        },
        {
            title: "Créer un coupon",
            description: "Nouveau code promo",
            icon: Tag,
            link: "/seller/coupons",
            variant: "secondary",
            className: "bg-green-600 hover:bg-green-700 text-white",
        },
        {
            title: "Voir les commandes",
            description: "Gérer vos commandes",
            icon: ShoppingBag,
            link: "/seller/orders",
            variant: "outline",
            className: "bg-purple-600 hover:bg-purple-700 text-white border-none",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <SellerNav />
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Bienvenue, {user?.fullname}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gérez vos produits, commandes et coupons depuis votre tableau de bord
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Actions Rapides</CardTitle>
                            <CardDescription>Raccourcis pour les tâches fréquentes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {quickActions.map((action, index) => (
                                    <Link key={index} to={action.link}>
                                        <Button
                                            variant={action.variant}
                                            className={`w-full h-auto py-6 flex flex-col items-center gap-3 ${action.className}`}
                                        >
                                            <action.icon className="h-8 w-8" />
                                            <div className="text-center">
                                                <p className="font-semibold text-base">{action.title}</p>
                                                <p className="text-xs opacity-90 font-normal">{action.description}</p>
                                            </div>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Getting Started Guide */}
                    <Card className="col-span-1 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Guide de démarrage</CardTitle>
                            <CardDescription>Étapes pour réussir vos ventes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Badge variant="default" className="h-8 w-8 rounded-full flex items-center justify-center text-sm">1</Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Ajoutez vos produits</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Créez des fiches produits détaillées avec des images de qualité.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Badge variant="secondary" className="h-8 w-8 rounded-full flex items-center justify-center text-sm bg-gray-200 text-gray-900">2</Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Attendez la validation</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Nos équipes vérifieront vos produits avant leur mise en ligne.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center text-sm border-gray-300">3</Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Gérez vos commandes</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Suivez vos ventes et expédiez vos commandes rapidement.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
