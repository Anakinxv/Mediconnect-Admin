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
import AccountOverviewPage from "@/features/account/settings/pages/AccountOverviewPage";
import VerifyIdentityPage from "@/features/account/settings/pages/VerifyIdentityPage";
import ChangeEmailPage from "@/features/account/settings/pages/ChangeEmailPage";

import ChangePasswordPage from "@/features/account/settings/pages/ChangePasswordPage";

import ViewDetailsPage from "@/features/users/pages/ViewDetailsPage";
import SpecialitiesPage from "@/features/masters/specialties/pages/SpecialitiesPage";
import InsuranceTypesPage from "@/features/masters/insuranceTypes/pages/InsuranceTypesPage";
import HealthCenterTypesPage from "@/features/masters/healthCenterTypes/pages/HealthCenterTypesPage";
import MedicalInsurancesPage from "@/features/masters/insurances/pages/MedicalInsurancesPage";
import AllergiesPage from "@/features/masters/allergies/pages/AllergiesPage";
import ProtectedRoute from "./ProtectedRoute";

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
        {/* PROTECTED TODAS LAS RUTAS DEL DASHBOARD */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DarkLayout />}>
            <Route element={<DashboardLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={ROUTES.PATIENTS} element={<PatientsPage />} />
              <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
              <Route path={ROUTES.CENTERS} element={<CenterPage />} />
              <Route
                path={ROUTES.DOCTOR_DETAILS}
                element={<ViewDetailsPage isDoctor />}
              />
              <Route
                path={ROUTES.CENTER_DETAILS}
                element={<ViewDetailsPage isDoctor={false} />}
              />
              <Route
                path={ROUTES.HEALTH_CENTER_TYPE}
                element={<HealthCenterTypesPage />}
              />
              <Route
                path={ROUTES.MEDICAL_INSURANCES}
                element={<MedicalInsurancesPage />}
              />
              <Route path={ROUTES.SPECIALTIES} element={<SpecialitiesPage />} />
              <Route
                path={ROUTES.INSURANCE_TYPE}
                element={<InsuranceTypesPage />}
              />
              <Route path={ROUTES.ALLERGIES} element={<AllergiesPage />} />
              <Route path={ROUTES.SETTINGS} element={<AccountOverviewPage />} />
              <Route
                path={ROUTES.SETTINGS_VERIFY_IDENTITY}
                element={<VerifyIdentityPage />}
              />
              <Route
                path={ROUTES.SETTINGS_CHANGE_EMAIL}
                element={<ChangeEmailPage />}
              />

              <Route
                path={ROUTES.SETTINGS_CHANGE_PASSWORD}
                element={<ChangePasswordPage />}
              />
            </Route>
          </Route>
        </Route>
      </Router>
    </BrowserRouter>
  );
}

export default AppRouter;
