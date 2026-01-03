import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import MCButton from "./forms/MCButton";

interface MCSheetProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MCSheetProfile({ open, onOpenChange }: MCSheetProfileProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl  rounded-l-4xl  border-accent  ">
        <div className="grid grid-cols-[35%_65%]  h-full w-full">
          <aside className="w-full h-full rounded-l-4xl bg-accent/50 border-r-3 border-accent p-0 m-0 ">
            sss
          </aside>
          <main className="w-full h-full "> waoo</main>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MCSheetProfile;
