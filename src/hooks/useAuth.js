import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isProfileComplete = () => {
    return user?.isProfileComplete || false;
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout: handleLogout,
    hasRole,
    isAdmin,
    isProfileComplete,
  };
};
