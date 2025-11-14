import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../store/authSlice";
import { Alert, Button, Input, PasswordInput, Tabs } from "../components/common";

// Validation schema
const registerSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(2, "Nom complet requis (min. 2 caractères)")
    .required("Nom complet requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup
    .string()
    .min(8, "8 caractères minimum")
    .required("Mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Les mots de passe ne correspondent pas")
    .required("Confirmation du mot de passe requise"),
  role: yup
    .string()
    .oneOf(["user", "seller"], "Rôle invalide")
    .required("Rôle requis"),
});

const Register = () => {
  const [activeTab, setActiveTab] = useState("register");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const formContainerRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      role: "user",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const switchTab = (value) => {
    if (value === "login") {
      navigate("/login");
    }
  };


  useEffect(() => {
    if (error && formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }
  }, [error]);


  const tabs = [
    { label: "Connexion", value: "login" },
    { label: "Inscription", value: "register" },
  ];

  return (
    <div className="min-h-max max-h-max bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2 h-[78.3vh] min-h-[78.3vh] max-h-[78.3vh]">
        {/* Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex flex-col justify-center hidden md:flex">
          <h2 className="text-3xl font-bold my-4 leading-tight">
            Rejoignez E-Market aujourd'hui
          </h2>
          <p className="text-blue-100 mb-10 leading-relaxed">
            Créez votre compte et profitez d'une expérience d'achat unique.
          </p>

          <div className="space-y-4">
            {["Inscription rapide et gratuite", "Accès à des milliers de produits", "Programme de fidélité"].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✓</span>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Register Form */}
        <div ref={formContainerRef}  className="p-12 max-h-[82vh] overflow-y-auto pt-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h1>
            <p className="text-gray-600 text-sm">
              Créez votre compte E-Market
            </p>
          </div>

          <div className="flex flex-col justify-center">
            {/* Tab Switcher */}
            <Tabs 
              tabs={tabs}
              activeTab={activeTab}
              onChange={switchTab}
              className="mb-8"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Show error message */}
              {error && (
                <Alert type="error" message={error} />
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Je m'inscris en tant que <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === "user"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="user"
                      {...register("role")}
                      className="hidden"
                    />
                    <span className="text-3xl mb-2">🛍️</span>
                    <span className="font-semibold text-gray-900">Acheteur</span>
                    <span className="text-xs text-gray-500 text-center mt-1">
                      Pour acheter des produits
                    </span>
                  </label>

                  <label
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === "seller"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="seller"
                      {...register("role")}
                      className="hidden"
                    />
                    <span className="text-3xl mb-2">🏪</span>
                    <span className="font-semibold text-gray-900">Vendeur</span>
                    <span className="text-xs text-gray-500 text-center mt-1">
                      Pour vendre des produits
                    </span>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.role.message}
                  </p>
                )}
              </div>
              {/* Full Name */}
              <Input
                label="Nom complet"
                type="text"
                id="fullname"
                placeholder="John Doe"
                error={errors.fullname?.message}
                required
                {...register("fullname")}
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                id="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                required
                {...register("email")}
              />

              {/* Password */}
              <PasswordInput
                label="Mot de passe"
                id="password"
                placeholder="••••••••"
                error={errors.password?.message}
                required
                {...register("password")}
              />

              {/* Confirm Password */}
              <PasswordInput
                label="Confirmer le mot de passe"
                id="confirmPassword"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                required
                {...register("confirmPassword")}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={loading || isSubmitting}
                size="lg"
              >
                S'inscrire
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Vous avez déjà un compte?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;