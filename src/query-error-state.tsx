"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./button.js";
import { cn } from "./cn.js";
import { useFamilyLabels } from "./labels.js";

export function QueryErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const labels = useFamilyLabels();
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </div>
      <p className="font-medium">{title ?? labels.errorTitle ?? "Algo deu errado"}</p>
      {description !== "" && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description ?? labels.errorDescription ?? "Os dados não puderam ser carregados."}
        </p>
      )}
      {onRetry && (
        <Button className="mt-4" variant="outline" onClick={onRetry}>
          {labels.retry ?? "Tentar de novo"}
        </Button>
      )}
    </div>
  );
}
