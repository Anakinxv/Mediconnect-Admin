import { Badge } from "@/shared/ui/badge";

type UserStatus = "approved" | "rejected" | "pending";

const statusStyles: Record<UserStatus, string> = {
  approved: "bg-[#2E7D32]/15 border-transparent text-[#2E7D32]",
  rejected: "bg-[#C62828]/15 border-transparent text-[#C62828]",
  pending: "bg-[#C77A1F]/15 border-transparent text-[#C77A1F]",
};

const statusLabels: Record<UserStatus, string> = {
  approved: "Aprobado",
  rejected: "Rechazado",
  pending: "Pendiente",
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return (
    <Badge className={`${statusStyles[status]} font-medium px-3 py-1`}>
      {statusLabels[status]}
    </Badge>
  );
}

export type { UserStatus };
