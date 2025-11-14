import { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await loginService(credentials);

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setLoading(false);

      return navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      setLoading(false);
      throw err;
    }
  };


  const register = async (userData) => {
      try {
        setError(null);
        setLoading(true);
        
        // Appeler l'API d'inscription
        const response = await registerService(userData);
        
        // Stocker le token et les infos utilisateur
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }

        setLoading(false);

        return navigate("/products");
      } catch (err) {
        const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                            'Erreur lors de l\'inscription';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    };


  // Fonction de déconnexion
  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };



  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };


  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};