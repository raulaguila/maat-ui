"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { DropdownSelect, DropdownSelectContent, DropdownSelectItem, DropdownSelectTrigger, DropdownSelectValue } from "./dropdown-select.js";
import { useFamilyLabels } from "./labels.js";
import { cn } from "./cn.js";

export type ChoiceOption = { value: string; label: string; description?: string; icon?: ReactNode };
export const SEARCHABLE_CHOICE_THRESHOLD = 6;

/** Keep short menus compact; use the existing combobox behavior for longer lists. */
export function SearchableChoice({ options, value, onValueChange, placeholder, searchLabel, ...trigger }:
  Omit<ComponentProps<typeof Button>, "value" | "onChange" | "children" | "size"> & {
    size?: "sm" | "default"; options: ChoiceOption[]; value: string | null; onValueChange: (value: string) => void;
    placeholder?: string; searchLabel: string;
  }) {
  const { noChoices = "Nenhuma opção encontrada." } = useFamilyLabels();
  const uid = useId();
  if (options.length <= SEARCHABLE_CHOICE_THRESHOLD) return <DropdownSelect value={value} onValueChange={onValueChange} items={Object.fromEntries(options.map(o => [o.value, o.label]))}>
    <DropdownSelectTrigger {...trigger}><DropdownSelectValue placeholder={placeholder} /></DropdownSelectTrigger>
    <DropdownSelectContent>{options.map(o => <DropdownSelectItem key={o.value} value={o.value} label={o.label} description={o.description}>{o.icon}{o.label}</DropdownSelectItem>)}</DropdownSelectContent>
  </DropdownSelect>;
  const label = (id: string) => options.find(o => o.value === id)?.label ?? id;
  return <Combobox.Root items={options.map(o => o.value)} value={value} onValueChange={next => { if (next !== null) onValueChange(next); }} itemToStringLabel={label}>
    <Combobox.Trigger {...trigger} render={<Button variant="outline" />} className={cn("min-w-0 max-w-full justify-between", trigger.className)}>
      <span className="min-w-0 flex-1 truncate text-left">{value ? label(value) : placeholder}</span><ChevronDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
    </Combobox.Trigger>
    <Combobox.Portal><Combobox.Positioner sideOffset={4} align="start" className="z-50">
      <Combobox.Popup className="flex max-h-[min(420px,var(--available-height))] w-[max(260px,var(--anchor-width))] max-w-[calc(100vw-32px)] flex-col rounded-lg bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-foreground/10">
        <Combobox.Input render={<Input />} aria-label={searchLabel} placeholder={searchLabel} className="mb-2 min-h-11 shrink-0" />
        <Combobox.Empty className="p-3 text-sm text-muted-foreground empty:hidden">{noChoices}</Combobox.Empty>
        <Combobox.List className="min-h-0 overflow-y-auto overscroll-contain">
          {(id: string) => {
            const option = options.find(o => o.value === id)!;
            const index = options.indexOf(option);
            return <Combobox.Item key={id} value={id} aria-label={option.label} aria-describedby={option.description ? `${uid}-${index}` : undefined} className="flex min-h-11 cursor-default items-start gap-2 rounded-md px-2 py-2 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground">
              <span className="w-4 shrink-0"><Combobox.ItemIndicator><Check className="size-4" /></Combobox.ItemIndicator></span>
              <span className="min-w-0 flex-1 wrap-anywhere"><span className="flex items-center gap-2">{option.icon}{option.label}</span>{option.description && <span id={`${uid}-${index}`} className="mt-1 block text-xs text-muted-foreground">{option.description}</span>}</span>
            </Combobox.Item>;
          }}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Positioner></Combobox.Portal>
  </Combobox.Root>;
}
