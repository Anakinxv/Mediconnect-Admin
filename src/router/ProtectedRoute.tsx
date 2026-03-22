import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import api from "@/config/axios-client";

const ProtectedRoute = () => {
  const { accessToken, refreshToken, setAccessToken, setRefreshToken, logout } =
    useAppStore();

  const [isChecking, setIsChecking] = useState(!accessToken);

  useEffect(() => {
    // Si ya hay accessToken en memoria no hace falta verificar
    if (accessToken) {
      setIsChecking(false);
      return;
    }

    // Sin refreshToken no hay nada que intentar
    if (!refreshToken) {
      setIsChecking(false);
      return;
    }

    // accessToken perdido (F5) pero refreshToken sobrevivió en sessionStorage
    api
      .post("/auth/refresh-access-token", { refreshToken })
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
      })
      .catch(() => logout())
      .finally(() => setIsChecking(false));
  }, []);

  if (isChecking) {
    return null; // o tu componente <Spinner />
  }

  return accessToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
