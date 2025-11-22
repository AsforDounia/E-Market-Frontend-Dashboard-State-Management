import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../store/authSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Store } from "lucide-react"; // Import icons

// Validation schema
const registerSchema = yup.object().shape({
  fullname: yup.string().min(2, "Nom complet requis (min. 2 caractères)").required("Nom complet requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup.string().min(8, "8 caractères minimum").required("Mot de passe requis"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Les mots de passe ne correspondent pas").required("Confirmation du mot de passe requise"),
  role: yup.string().oneOf(["user", "seller"], "Rôle invalide").required("Rôle requis"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
    defaultValues: { role: "user" },
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button variant="outline" onClick={() => navigate("/login")}>Connexion</Button>
            <Button variant="default">Inscription</Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Je m'inscris en tant que</Label>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <div className="flex items-center space-x-2 p-2 border rounded-md">
                                <RadioGroupItem value="user" id="user" />
                                <Label htmlFor="user" className="flex items-center gap-2">
                                    <User className="h-4 w-4" /> Acheteur
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 border rounded-md">
                                <RadioGroupItem value="seller" id="seller" />
                                <Label htmlFor="seller" className="flex items-center gap-2">
                                    <Store className="h-4 w-4" /> Vendeur
                                </Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                <p className="text-sm text-red-500 mt-1">{errors.role?.message}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="fullname">Nom complet</Label>
              <Input id="fullname" {...register("fullname")} />
              <p className="text-sm text-red-500 mt-1">{errors.fullname?.message}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" {...register("password")} />
              <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword?.message}</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Vous avez déjà un compte?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
