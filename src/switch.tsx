"use client";

import * as React from "react";
import { cn } from "./cn.js";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** A minimal thumb-track switch built on a <button> — no Radix dependency. */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "peer inline-flex min-h-6 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-full pointer-coarse:min-h-11 pointer-coarse:min-w-11 max-md:min-h-11 max-md:min-w-11",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className={cn("inline-flex h-5 w-9 items-center rounded-full border-2 border-transparent transition-colors", checked ? "bg-primary" : "bg-input")}>
          <span
            className={cn(
              "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
              checked ? "translate-x-4" : "translate-x-0",
            )}
          />
        </span>
      </button>
    );
  },
);
Switch.displayName = "Switch";
