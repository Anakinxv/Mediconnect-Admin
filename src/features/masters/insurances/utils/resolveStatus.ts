import type { InsuranceInterface } from "../hooks/useInsurance";

export const resolveStatus = (s: InsuranceInterface): "active" | "inactive" => {
  const raw = (s.status ?? s.estado ?? "").toLowerCase();
  return raw === "active" || raw === "activo" ? "active" : "inactive";
};
