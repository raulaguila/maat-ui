import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ApplicationShell, FormSection, FormSections, ManagementGroup, ManagementRow, Sidebar, SidebarBody, SidebarFooter } from "@raulaguila/maat-ui/layout";
import { FamilyUIProvider } from "@raulaguila/maat-ui/labels";
import { TablePagination } from "@raulaguila/maat-ui/pagination";

test("groups label their lists independently, including when titles repeat", () => {
  const group = () => h(ManagementGroup, {title: "Meus", count: 1}, h(ManagementRow, {}, "Manual"));
  const html = renderToStaticMarkup(h("main", {}, group(), group()));
  const ids = [...html.matchAll(/<h2 id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, 2);
  for (const id of ids) assert.ok(html.includes('<ul class="family-list" aria-labelledby="' + id + '"'));
});
test("server rendering preserves sidebar landmarks and form headings", () => {
  const html = renderToStaticMarkup(h(Sidebar, {label: "Conta", collapsed: true},
    h(SidebarBody, {}, h(FormSections, {}, h(FormSection, {title: "Perfil"}, "Nome"))), h(SidebarFooter, {}, "Sair")));
  assert.match(html, /data-collapsed="" aria-label="Conta"/);
  assert.match(html, /<h2[^>]*>Perfil<\/h2>/);
  assert.match(html, /class="rail-footer">Sair/);
});
test("pagination uses the host labels and page sizes", () => {
  const labels = { close: "Close", rows: "Rows", of: "of", previous: "Previous", next: "Next" };
  const render = totalItems => renderToStaticMarkup(h(FamilyUIProvider, {labels}, h(TablePagination, {
    page: 1, pageSize: 5, pageSizes: [5, 20], totalItems, onPageChange() {}, onPageSizeChange() {},
  })));
  assert.equal(render(5), "");
  assert.match(render(6), /aria-label="Next"/);
});

test("the application shell links the translated skip action to its focusable main landmark", () => {
  const html = renderToStaticMarkup(h(ApplicationShell, {
    skipLabel: "Skip to content", mainId: "workspace", sidebar: h("aside", {}, "Projects"), header: "Account",
  }, "Overview"));
  assert.match(html, /href="#workspace"[^>]*>Skip to content<\/a>/);
  assert.match(html, /<header[^>]*>Account<\/header>/);
  assert.match(html, /<main[^>]*id="workspace"[^>]*tabindex="-1"[^>]*>Overview<\/main>/i);
});
