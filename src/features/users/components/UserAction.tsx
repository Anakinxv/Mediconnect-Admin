import { Button } from "@/shared/ui/button";
import { Eye } from "lucide-react";

interface UserActionProps {
  onViewDetails: () => void;
}

function UserAction({ onViewDetails }: UserActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-bg-btn-secondary rounded-full transition-colors hover:bg-primary/10 active:bg-primary/20 group"
      onClick={onViewDetails}
    >
      <Eye className="h-4 w-4 text-primary group-hover:text-primary/80 group-active:text-primary/60" />
    </Button>
  );
}

export default UserAction;
