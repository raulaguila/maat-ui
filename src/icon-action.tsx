"use client";
import { Button } from "./button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export function IconAction({ label, target, className, disabled, expanded, shortcut, variant = "ghost", onClick, children }: { label: string; target?: string; className?: string; disabled?: boolean; /** For a toggle that shows or hides content. */ expanded?: boolean; shortcut?: string; variant?: "ghost" | "outline" | "destructive"; onClick?: React.MouseEventHandler<HTMLButtonElement>; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button type="button" variant={variant} size="icon-sm" className={className} aria-label={target ? `${label}: ${target}` : label} aria-expanded={expanded} aria-keyshortcuts={shortcut} disabled={disabled} onClick={onClick} />}>{children}</TooltipTrigger>
      <TooltipContent>{label}{shortcut && <kbd className="ml-1.5 font-mono opacity-70">{shortcut}</kbd>}</TooltipContent>
    </Tooltip>
  );
}
