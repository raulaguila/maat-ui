import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "./cn.js";

export function PageHeader({
  title,
  description,
  action,
  badge,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** A short label next to the title (a user's admin role). */
  badge?: React.ReactNode;
}) {
  return (
    <div data-ui-page-header className="px-[var(--space-page)] py-3 md:pb-5">
      <div className="flex w-full flex-col gap-[var(--space-row)] sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-full flex-1 wrap-anywhere sm:basis-64">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
          {badge}
        </div>
        {description && <p className="mt-1 max-w-[75ch] text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex max-w-full flex-wrap items-center gap-2 [&>*]:max-w-full [&>*]:flex-wrap">{action}</div>}
      </div>
    </div>
  );
}

export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full min-w-0 space-y-6 px-[var(--space-page)] py-[var(--space-page-y)]", className)}>{children}</div>;
}

export function FormSection({ id, title, description, action, danger = false, headAbove = false, children }: {
  /** An anchor, so a link can open the page at this section. */
  id?: string;
  /** Left out where the page or tab already names the section: the description and action then head the content. */
  title?: string;
  description?: string;
  /** The section's main action (add, create), at the top right of the section. */
  action?: React.ReactNode;
  /** Keep the title above a wide form until its card can fit both columns. */
  headAbove?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const actions = action && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{action}</div>;
  if (!title) {
    return (
      <section id={id} className="scroll-mt-20 space-y-4 border-t pt-8 first:border-t-0 first:pt-0">
        {(description || action) && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {description && <p className="max-w-[72ch] text-sm text-muted-foreground">{description}</p>}
            {actions}
          </div>
        )}
        <div className="min-w-0">{children}</div>
      </section>
    );
  }
  return (
    <section id={id} className={cn("grid scroll-mt-20 gap-3 border-t pt-8 first:border-t-0 first:pt-0", headAbove ? "@min-[70rem]/form:grid-cols-[18rem_minmax(0,1fr)] @min-[70rem]/form:gap-10" : "@min-[48rem]/form:grid-cols-[18rem_minmax(0,1fr)] @min-[48rem]/form:gap-10")}>
      <div className="space-y-1">
        <h2 className={cn("font-heading text-base font-semibold", danger && "text-destructive")}>{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("min-w-0", action && "space-y-3")}>{actions}{children}</div>
    </section>
  );
}

export function FormSections({ danger = false, children }: { danger?: boolean; children: React.ReactNode }) {
  return <div className={cn("@container/form space-y-8 rounded-xl border bg-card p-6 text-card-foreground shadow-xs sm:p-8", danger && "border-destructive/40")}>{children}</div>;
}

export function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="@container flex flex-col gap-2">
      <div className="grid gap-2 @min-[40rem]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @min-[40rem]:items-center @min-[40rem]:gap-8">
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 @min-[40rem]:justify-end">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ label, collapsed, mobile, children }: {
  label: string; collapsed?: boolean; mobile?: boolean; children: ReactNode;
}) {
  return <aside data-ui-workspace-rail="" data-collapsed={collapsed ? "" : undefined}
    data-mobile={mobile ? "" : undefined} aria-label={label}>{children}</aside>;
}
export function SidebarBody({ children }: { children: ReactNode }) {
  return <div className="rail-body">{children}</div>;
}
export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="rail-footer">{children}</div>;
}
export function ManagementGroup({ title, count, children }: {
  title: string; count: number; children: ReactNode;
}) {
  const id = useId();
  return <section className="family-group" aria-labelledby={id}>
    <h2 id={id}>{title}<span aria-hidden>{count}</span></h2>
    <ul className="family-list" aria-labelledby={id}>{children}</ul>
  </section>;
}
export function ManagementRow({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("family-row", className)} {...props} />;
}
