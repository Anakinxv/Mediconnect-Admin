import { Route, Routes as Router, BrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import AuthLayout from "@/layout/AuthLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import Login from "@/features/auth/pages/Login";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import PasswordSuccessPage from "@/features/auth/pages/PasswordSuccessPage";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";
import PatientsPage from "@/features/users/pages/PatientsPage";
import DarkLayout from "@/layout/DarkLayout";
import DoctorsPage from "@/features/users/pages/DoctorsPage";
import CenterPage from "@/features/users/pages/CenterPage";
function AppRouter() {
  return (
    <BrowserRouter>
      <Router>
        <Route path={ROUTES.LOGIN} index element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route
            path={ROUTES.PASSWORD_SUCCESS}
            element={<PasswordSuccessPage />}
          />
        </Route>
        <Route element={<DarkLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={ROUTES.PATIENTS} element={<PatientsPage />} />
            <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
            <Route path={ROUTES.CENTERS} element={<CenterPage />} />
          </Route>
        </Route>
      </Router>
    </BrowserRouter>
  );
}

export default AppRouter;
