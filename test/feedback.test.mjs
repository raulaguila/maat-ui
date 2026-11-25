import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EmptyState } from "@raulaguila/maat-ui/empty-state";
import { PasswordInput } from "@raulaguila/maat-ui/password-input";
import { QueryErrorState } from "@raulaguila/maat-ui/query-error-state";
import { FamilyUIProvider } from "@raulaguila/maat-ui/labels";

test("a compact empty state only announces the supplied title", () => {
  const html = renderToStaticMarkup(h(EmptyState, { compact: true, title: "Sem arquivos", action: "Enviar" }));
  assert.match(html, /role="status"/);
  assert.match(html, /Sem arquivos/);
  assert.doesNotMatch(html, /Enviar/);
});

test("failed queries and password controls use the application's language", () => {
  const labels = { close: "Close", rows: "Rows", of: "of", previous: "Previous", next: "Next",
    errorTitle: "Unavailable", errorDescription: "Details", retry: "Try again", showPassword: "Reveal" };
  const render = node => renderToStaticMarkup(h(FamilyUIProvider, { labels }, node));
  assert.match(render(h(PasswordInput)), /aria-label="Reveal"/);
  assert.match(render(h(PasswordInput)), /type="password"/);
  const normal = render(h(QueryErrorState, { onRetry() {} }));
  assert.match(normal, /Unavailable/);
  assert.match(normal, /Try again/);
  assert.match(normal, /Details/);
  const forbidden = render(h(QueryErrorState, { description: "" }));
  assert.doesNotMatch(forbidden, /Details|<button/);
});
