"use client";

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";
import { cn } from "./cn.js";

type Selection = {
  value: string | null;
  onValueChange: (value: string) => void;
  items?: Record<string, ReactNode>;
  disabled?: boolean;
};
const SelectionContext = createContext<Selection | null>(null);

function useSelection() {
  const selection = useContext(SelectionContext);
  if (!selection) throw new Error("DropdownSelect components require DropdownSelect");
  return selection;
}

/** Controlled single-choice menu; selections stay in the caller's form state. */
export function DropdownSelect({ children, ...selection }: Selection & { children: ReactNode }) {
  return <SelectionContext value={selection}><DropdownMenu>{children}</DropdownMenu></SelectionContext>;
}

export function DropdownSelectTrigger({ children, className, size = "default", disabled, ...props }:
  ComponentProps<typeof DropdownMenuTrigger> & { size?: "sm" | "default" }) {
  const selection = useSelection();
  return <DropdownMenuTrigger
    {...props}
    data-slot="dropdown-select-trigger"
    disabled={selection.disabled || disabled}
    render={<Button variant="outline" size={size} />}
    className={cn("min-w-0 max-w-full justify-between border-input dark:bg-[color-mix(in_oklab,var(--input-fill)_30%,transparent)]", className)}
  >
    {children}
    <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
  </DropdownMenuTrigger>;
}

export function DropdownSelectValue({ children, placeholder, className, ...props }:
  ComponentProps<"span"> & { placeholder?: ReactNode }) {
  const { value, items } = useSelection();
  return <span {...props} className={cn("block min-w-0 flex-1 truncate text-left", className)}>
    {children ?? (value == null ? placeholder : items?.[value] ?? (value || placeholder))}
  </span>;
}

export function DropdownSelectContent({ children, className, ...props }: ComponentProps<typeof DropdownMenuContent>) {
  const { value, onValueChange, disabled } = useSelection();
  return <DropdownMenuContent {...props} className={cn("max-w-[calc(100vw-2rem)]", className)}>
    <DropdownMenuRadioGroup value={value} onValueChange={onValueChange} disabled={disabled}>
      {children}
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>;
}

export function DropdownSelectItem({ children, description, className, ...props }:
  ComponentProps<typeof DropdownMenuRadioItem> & { description?: string }) {
  const id = useId();
  const hasDescription = !!description?.trim();
  return <DropdownMenuRadioItem
    aria-labelledby={hasDescription ? `${id}-label` : undefined}
    aria-describedby={hasDescription ? `${id}-description` : undefined}
    {...props}
    closeOnClick
    className={cn("min-w-0 wrap-anywhere", hasDescription && "items-start py-2", className)}
  >
    <span className="min-w-0 flex-1">
      <span id={hasDescription ? `${id}-label` : undefined} className={cn("flex gap-2", hasDescription && "font-medium")}>{children}</span>
      {hasDescription && <span id={`${id}-description`} className="mt-1 block text-xs leading-relaxed whitespace-pre-line text-muted-foreground">{description}</span>}
    </span>
  </DropdownMenuRadioItem>;
}
