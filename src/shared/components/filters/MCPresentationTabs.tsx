import { TabsList, TabsTrigger } from "@/shared/ui/tabs-alternative";
import { LayoutGrid, List } from "lucide-react";

export function MCPresentationTabs({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (val: string) => void;
}) {
  return (
    <TabsList className="rounded-full bg-bg-btn-secondary/50 py-5  px-1.2  border border-primary/20 gap-1">
      <TabsTrigger
        value="cards"
        className="rounded-full px-3 border border-primary/20 bg-bg-btn-secondary  text-primary transition-colors duration-200
          data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-lg"
        onClick={() => onValueChange("cards")}
        data-state={value === "cards" ? "active" : undefined}
      >
        <LayoutGrid className="h-4 w-4 mr-1.5 text-base  lg:text-md " />
        Cards
      </TabsTrigger>
      <TabsTrigger
        value="table"
        className="rounded-full px-3 border border-primary/20 bg-bg-btn-secondary text-primary transition-colors duration-200
          data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-lg"
        onClick={() => onValueChange("table")}
        data-state={value === "table" ? "active" : undefined}
      >
        <List className="h-4 w-4 mr-1.5 text-base lg:text-md " />
        Tabla
      </TabsTrigger>
    </TabsList>
  );
}
