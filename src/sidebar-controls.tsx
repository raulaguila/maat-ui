"use client";
import { cn } from "./cn.js";
import { useId, type ReactNode } from "react";
import { ChevronDown, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export function SidebarGroup({ label, compact, open, onToggle, children }: {
  label: string; compact: boolean; open: boolean; onToggle: () => void; children: ReactNode;
}) {
  const id = useId();
  const button = <button type="button" className={compact ? "rail-item rail-admin-toggle" : "rail-admin-toggle"}
    aria-label={label} aria-expanded={open} aria-controls={id} onClick={onToggle}>
    <Settings className="rail-admin-icon size-4" aria-hidden />
    {!compact && <><span className="rail-nav-label">{label}</span><ChevronDown className="rail-admin-chevron size-3.5" aria-hidden /></>}
  </button>;
  return <div role="group" aria-label={label} className="rail-nav-section">
    {compact ? <Tooltip><TooltipTrigger render={button} /><TooltipContent side="right">{label}</TooltipContent></Tooltip> : button}
    <div id={id} hidden={!open} className="rail-admin-links">{children}</div>
  </div>;
}
export function SidebarDrawer({ id, title, description, open, onOpenChange, finalFocus, desktop = false, children }: {
  id: string; title: string; description: string; open: boolean; onOpenChange: (open: boolean) => void;
  finalFocus: () => HTMLElement | null; desktop?: boolean; children: ReactNode;
}) {
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent id={id} data-mobile-drawer finalFocus={finalFocus} side="left"
      className={cn("flex flex-col gap-0 p-0 data-[side=left]:w-[min(18rem,calc(100vw-2rem))] data-[side=left]:sm:max-w-72", !desktop && "lg:hidden")}>
      <SheetHeader className="sr-only"><SheetTitle>{title}</SheetTitle><SheetDescription>{description}</SheetDescription></SheetHeader>
      {children}
    </SheetContent>
  </Sheet>;
}
