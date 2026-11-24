"use client";

// Footer for server-paginated tables. Maps to the backend's ?limit&offset.
// Layout: "Linhas [10▾]  ·  21–30 de 142  ·  ‹ 3 / 15 ›"
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select.js";
import { cn } from "./cn.js";
import { useFamilyLabels } from "./labels.js";

const defaultSizes = [10, 25, 50, 100];

export function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizes = defaultSizes,
  className,
}: {
  page: number; // 1-based
  pageSize: number;
  totalItems: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  pageSizes?: readonly number[];
  className?: string;
}) {
  const labels = useFamilyLabels();
  if (totalItems === 0 || (page === 1 && totalItems <= pageSizes[0])) return null;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 border-t bg-muted px-3 py-2 text-xs text-muted-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span>{labels.rows}</span>
        <Select
          value={String(pageSize)}
          items={Object.fromEntries(pageSizes.map((n) => [String(n), String(n)]))}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger size="sm" className="w-20" aria-label={labels.rows}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="font-mono tabular-nums">
        {startIndex + 1}–{endIndex} {labels.of} {totalItems}
      </div>

      <div className="hidden flex-1 sm:block" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label={labels.previous}
          className={cn(
            "flex size-11 items-center md:size-[var(--control-h-sm)] justify-center rounded-md border",
            canPrev ? "hover:border-ring hover:text-foreground" : "cursor-not-allowed opacity-40",
          )}
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <span className="px-1 font-mono tabular-nums">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          aria-label={labels.next}
          className={cn(
            "flex size-11 items-center md:size-[var(--control-h-sm)] justify-center rounded-md border",
            canNext ? "hover:border-ring hover:text-foreground" : "cursor-not-allowed opacity-40",
          )}
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
