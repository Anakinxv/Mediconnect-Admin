import { Badge } from "@/shared/ui/badge";
import { useTranslation } from "react-i18next";

type UserStatus = "approved" | "rejected" | "pending";

const statusStyles: Record<UserStatus, string> = {
  approved: "bg-[#2E7D32]/15 border-transparent text-[#2E7D32]",
  rejected: "bg-[#C62828]/15 border-transparent text-[#C62828]",
  pending: "bg-[#C77A1F]/15 border-transparent text-[#C77A1F]",
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const { t } = useTranslation("common");

  return (
    <Badge className={`${statusStyles[status]} font-medium px-3 py-1`}>
      {t(`userStatus.${status}`)}
    </Badge>
  );
}

export type { UserStatus };
