import React from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { cn } from "@/lib/utils";

type MCFilterPopoverProps = {
  children: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
  compact?: boolean; // nueva prop
};

export function MCFilterPopover({
  children,
  activeFiltersCount,
  onClearFilters,
  compact = false, // valor por defecto
}: MCFilterPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation("patient");

  return (
    <>
      {isMobile ? (
        <>
          <Button
            variant={`outline`}
            onClick={() => setOpen(true)}
            className={`flex w-full items-center text-primary px-4 py-3.5 text-base rounded-4xl border-primary/20 bg-bg-btn-secondary ${
              open
                ? "opacity ring-2 ring-accent/70 border-secondary"
                : "opacity-100"
            }`}
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
            {t("filters.popover.filters")}
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {open && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setOpen(false);
                }
              }}
            >
              <div
                className="w-[calc(100vw-2rem)] max-h-[80vh] bg-bg-secondary rounded-xl p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <h4 className="font-semibold text-foreground text-lg">
                      {t("filters.popover.title")}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpen(false)}
                      className="rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div
                    className="w-full overflow-y-auto max-h-[60vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {children}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border/50">
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearFilters();
                          setOpen(false);
                        }}
                      >
                        {t("filters.popover.clear")}
                      </Button>
                    )}
                    <Button
                      className="flex-1 rounded-full text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                      }}
                    >
                      {t("filters.popover.apply")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={`outline`}
              className={`flex w-full items-center text-primary px-4 py-3.5 text-base sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-5 lg:py-5 lg:text-md rounded-4xl border-primary/20 bg-bg-btn-secondary ${
                open
                  ? "opacity ring-2 ring-accent/70 border-secondary"
                  : "opacity-100"
              }`}
              aria-label="Abrir filtros"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              {t("filters.popover.filters")}
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "p-5 bg-bg-secondary shadow-lg z-50 border border-primary/20 rounded-2xl",
              compact
                ? "w-[220px] min-w-[220px] max-w-[220px]"
                : "w-auto min-w-[400px] md:min-w-[500px] lg:min-w-[600px] max-w-none",
              "max-h-[calc(100vh-8rem)] overflow-y-auto",
            )}
            align="end"
            side="bottom"
            sideOffset={8}
            avoidCollisions={false}
          >
            {/* Desktop content remains the same */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-lg">
                  {t("filters.popover.title")}
                </h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t("filters.popover.clear")}
                    onClick={onClearFilters}
                    className="transition-all duration-200 ease-in-out hover:bg-primary/10 active:scale-95 focus:ring-2 focus:ring-primary/30 rounded-full gap-1.5 text-sm px-3 py-2"
                  >
                    <X className="w-4 h-4" />
                    {t("filters.popover.clear")}
                  </Button>
                )}
              </div>

              <div className="w-full">{children}</div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
