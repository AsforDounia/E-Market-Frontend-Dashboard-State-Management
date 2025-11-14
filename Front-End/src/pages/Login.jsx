import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import {
  Alert,
  Button,
  Input,
  PasswordInput,
  Tabs,
} from "../components/common";

// Validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup
    .string()
    .min(6, "Minimum 6 caractères")
    .required("Mot de passe requis"),
});

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const formContainerRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const switchTab = (value) => {
    if (value === "register") {
      navigate("/register");
    }
  };

  const tabs = [
    { label: "Connexion", value: "login" },
    { label: "Inscription", value: "register" },
  ];

  useEffect(() => {
    if (error && formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }
  }, [error]);
  return (
    <div className="min-h-max max-h-max bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2 max-h-[78.3vh]">
        {/* Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex flex-col justify-center hidden md:flex">
          <h2 className="text-3xl font-bold my-4 leading-tight">
            Bienvenue sur votre marketplace préférée
          </h2>
          <p className="text-blue-100 mb-10 leading-relaxed">
            Achetez et vendez en toute sécurité. Des milliers de produits vous
            attendent.
          </p>

          <div className="space-y-4">
            {[
              "Paiement 100% sécurisé",
              "Livraison rapide",
              "Support client 24/7",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✓</span>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div
          ref={formContainerRef}
          className="p-12 overflow-y-auto pt-6 max-h-[82vh]"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
            <p className="text-gray-600 text-sm">
              Accédez à votre compte E-Market
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
              {error && <Alert type="error" message={error} />}

              {/* Email Field */}
              <Input
                label="Email"
                type="email"
                id="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                required
                {...register("email")}
              />

              {/* Password Field */}
              <PasswordInput
                label="Mot de passe"
                id="password"
                error={errors.password?.message}
                required
                {...register("password")}
              />

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={loading || isSubmitting}
                size="lg"
              >
                Se connecter
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
