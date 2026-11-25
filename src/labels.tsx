"use client";
import { createContext, useContext, type ReactNode } from "react";

export interface FamilyLabels {
  close: string;
  rows: string;
  of: string;
  previous: string;
  next: string;
  noChoices?: string;
  hidePassword?: string;
  showPassword?: string;
  cancel?: string;
  confirm?: string;
  confirming?: string;
  confirmFailed?: string;
  errorTitle?: string;
  errorDescription?: string;
  retry?: string;
}
const Labels = createContext<FamilyLabels>({
  close: "Fechar", rows: "Linhas", of: "de", previous: "Página anterior", next: "Próxima página",
});
export function FamilyUIProvider({ labels, children }: { labels: FamilyLabels; children: ReactNode }) {
  return <Labels.Provider value={labels}>{children}</Labels.Provider>;
}
export function useFamilyLabels() { return useContext(Labels); }
