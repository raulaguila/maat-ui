"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog.js";
import { Loader2 } from "lucide-react";
import { Button } from "./button.js";
import { useFamilyLabels } from "./labels.js";

/** Explicit, translated feedback for partial batches; API errors stay sanitized. */
export class ConfirmationError extends Error {}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  formatError,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  formatError?: (error: unknown) => string;
}) {
  const labels = useFamilyLabels();
  const cancelButton = useRef<HTMLButtonElement>(null);
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancel = cancelLabel ?? labels.cancel ?? "Cancelar";
  const confirm = confirmLabel ?? labels.confirm ?? "Confirmar";
  const changeOpen = (next: boolean) => {
    if (inFlight.current) return;
    setError(null);
    onOpenChange(next);
  };
  const submit = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof ConfirmationError ? e.message : formatError?.(e) ?? labels.confirmFailed ?? "Não foi possível concluir a ação.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent initialFocus={destructive ? cancelButton : undefined} className="sm:max-w-sm" aria-busy={pending} showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {error && <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
        <DialogFooter>
          <Button ref={cancelButton} variant="ghost" disabled={pending} onClick={() => changeOpen(false)}>
            {cancel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={pending}
            onClick={() => void submit()}
          >
            {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
            {pending ? (labels.confirming ?? "Aguarde…") : confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
