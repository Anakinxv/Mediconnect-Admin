import { Sheet, SheetContent, SheetClose } from "@/shared/ui/sheet";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
interface MCSheetProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MCSheetProfile({ open, onOpenChange }: MCSheetProfileProps) {
  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={
          isMobile
            ? "inset-y-0 my-2.5 flex items-center justify-center h-[calc(100%-20px)] w-[calc(100vw-10px)] ml-[10px] rounded-l-4xl border-accent"
            : "w-1/2 border-accent inset-y-0 my-2.5 flex items-center justify-center h-[calc(100%-20px)] rounded-l-4xl"
        }
      >
        <div className="grid grid-cols-[35%_65%] h-full w-full">
          <aside className="w-full h-full rounded-l-4xl bg-accent/50 border-r-3 border-accent p-0 m-0 ">
            sss
          </aside>
          <main className="w-full h-full ">
            <div className="flex items-center justify-between p-2 border-b border-border">
              <h1>Información General</h1>
              <SheetClose asChild>
                <button
                  className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-accent/70 focus:bg-accent active:scale-95 transition-all duration-200"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
          </main>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MCSheetProfile;
