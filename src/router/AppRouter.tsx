import { Route, Routes as Router, BrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";

import Login from "@/features/auth/pages/Login";
function AppRouter() {
  return (
    <BrowserRouter>
      <Router>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Router>
    </BrowserRouter>
  );
}

export default AppRouter;
