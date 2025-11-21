import { useState, useEffect } from "react";
import { Button, Modal, Alert, LoadingSpinner } from "../../components/common";
import CouponForm from "../../components/admin/CouponForm";
import CouponList from "../../components/admin/CouponList";
import CouponStats from "../../components/admin/CouponStats";
import { couponService } from "../../services/couponService";
import { AiOutlinePlus, AiOutlineFilter } from "react-icons/ai";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getAllCoupons();
      setCoupons(response.data.data.coupons || []);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Erreur lors du chargement des coupons",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      setFormLoading(true);
      await couponService.createCoupon(couponData);
      setAlert({
        type: "success",
        message: "Coupon créé avec succès",
      });
      setShowForm(false);
      fetchCoupons();
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Erreur lors de la création du coupon",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCoupon = async (couponData) => {
    try {
      setFormLoading(true);
      await couponService.updateCoupon(editingCoupon._id, couponData);
      setAlert({
        type: "success",
        message: "Coupon modifié avec succès",
      });
      setShowForm(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Erreur lors de la modification du coupon",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await couponService.updateCoupon(coupon._id, {
        isActive: !coupon.isActive,
      });
      setAlert({
        type: "success",
        message: `Coupon ${
          coupon.isActive ? "désactivé" : "activé"
        } avec succès`,
      });
      fetchCoupons();
    } catch (error) {
      setAlert({
        type: "error",
        message: "Erreur lors de la modification du statut",
      });
    }
  };

  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coupon ?"))
      return;

    try {
      await couponService.deleteCoupon(coupon._id);
      setAlert({
        type: "success",
        message: "Coupon supprimé avec succès",
      });
      fetchCoupons();
    } catch (error) {
      setAlert({
        type: "error",
        message: "Erreur lors de la suppression du coupon",
      });
    }
  };

  const handleViewStats = (coupon) => {
    setAlert({
      type: "info",
      message: `Statistiques pour le coupon ${coupon.code} - Fonctionnalité à venir`,
    });
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === "active") return coupon.isActive;
    if (filter === "expired") return !coupon.isActive;
    return true;
  });

  const openEditForm = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Coupons
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <AiOutlinePlus className="w-5 h-5" />
            Nouveau Coupon
          </Button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-6"
          />
        )}

        <CouponStats coupons={coupons} />

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <AiOutlineFilter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les coupons</option>
                <option value="active">Coupons actifs</option>
                <option value="expired">Coupons expirés</option>
              </select>
            </div>
          </div>

          <CouponList
            coupons={filteredCoupons}
            onEdit={openEditForm}
            onDelete={handleDeleteCoupon}
            onToggleStatus={handleToggleStatus}
            onViewStats={handleViewStats}
          />
        </div>

        <Modal
          isOpen={showForm}
          onClose={closeForm}
          title={
            editingCoupon ? "Modifier le coupon" : "Créer un nouveau coupon"
          }
        >
          <CouponForm
            onSubmit={editingCoupon ? handleEditCoupon : handleCreateCoupon}
            initialData={editingCoupon}
            loading={formLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CouponManagement;
