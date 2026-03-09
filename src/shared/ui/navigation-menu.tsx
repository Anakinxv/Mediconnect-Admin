import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavigationMenuProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Root
> {
  viewport?: boolean;
}

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, viewport = true, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-viewport={viewport}
    className={cn(
      "group/navigation-menu relative z-10 flex max-w-max flex-1 items-center justify-center",
      className,
    )}
    {...props}
  >
    {children}
    {viewport && <NavigationMenuViewport />}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  // Unifica padding y altura con los links principales
  "group inline-flex h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Trigger
> {
  active?: boolean;
  hasActiveChild?: boolean; // <-- nuevo
}

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, active, hasActiveChild, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    data-active={active}
    className={cn(
      navigationMenuTriggerStyle(),
      "group",
      !active &&
        (hasActiveChild
          ? "hover:bg-accent/60 hover:text-accent-foreground"
          : "hover:bg-accent/70 hover:text-accent-foreground"),
      active && "bg-primary text-primary-foreground hover:bg-primary",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "relative top-[1px] ml-1 h-4 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180",
        active && "text-primary-foreground",
      )}
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "top-full left-0 w-48 mt-2 md:absolute z-50",
      "bg-card border border-border rounded-xl shadow-lg",
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
      "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
      "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in",
      "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
      "group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
      "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0",
      "group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
      "group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
      "overflow-hidden",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Link
> {
  active?: boolean;
  isChild?: boolean;
}

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ className, active, isChild, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    data-active={active}
    className={cn(
      "flex items-center gap-2 text-sm font-medium transition-colors focus:outline-none",

      // ───── CHILD ─────
      isChild &&
        cn(
          "rounded-lg px-3 py-2.5 text-secondary-foreground/80",
          "hover:bg-accent/60 hover:text-secondary-foreground",
          "focus:bg-accent",
          active && "bg-accent/50 text-",
        ),

      // ───── PARENT ─────
      !isChild &&
        cn(
          "rounded-full px-4 py-2 h-10 text-primary",
          "hover:bg-accent/70",
          !active && "hover:text-secondary-foreground",
          active && "bg-primary text-primary-foreground hover:bg-primary",
        ),

      className,
    )}
    {...props}
  />
));
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
