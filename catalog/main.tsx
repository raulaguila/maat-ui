import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SearchableChoice, PageTabs, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Sidebar, SidebarBody, SidebarFooter, SidebarGroup, SidebarDrawer, TooltipProvider,
  Badge, Button, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
  FormSection, FormSections, Input, Label, ManagementGroup, ManagementRow,
  PageBody, PageHeader, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch,
} from "@maat/ui";
import "./style.css";

const brands = { thoth: "Thoth", seshat: "Seshat", khnum: "Khnum" };
function Catalog() {
  const [brand, setBrand] = useState("seshat");
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [groupOpen, setGroupOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return <TooltipProvider><main className="mx-auto max-w-6xl py-6">
    <PageHeader title="Maat UI · Catálogo de componentes" action={<Badge className="bg-brand-mark text-white dark:text-black">{brands[brand as keyof typeof brands]}</Badge>} />
    <PageBody><FormSections>
      <FormSection title="Aparência" description="Compare as marcas, os temas e as densidades da família.">
        <div className="grid max-w-lg gap-4">
          <Label id="brand">Plataforma</Label>
          <Select value={brand} items={brands} onValueChange={value => {
            if (value) { setBrand(value); document.documentElement.dataset.brand = value; }
          }}>
            <SelectTrigger aria-labelledby="brand"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(brands).map(([key, label]) =>
              <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex items-center justify-between">Tema escuro<Switch aria-label="Tema escuro" checked={dark}
            onCheckedChange={checked => { document.documentElement.classList.toggle("dark", checked); setDark(checked); }} /></div>
          <div className="flex items-center justify-between">Densidade compacta<Switch aria-label="Densidade compacta" checked={compact}
            onCheckedChange={checked => { document.documentElement.dataset.density = checked ? "compact" : "comfortable"; setCompact(checked); }} /></div>
        </div>
      </FormSection>
      <FormSection title="Campos e ações">
        <div className="grid max-w-lg gap-2">
          <Label htmlFor="sample">Título de exemplo</Label><Input id="sample" value={text} onChange={e => setText(e.target.value)} />
          <div className="flex flex-wrap gap-2"><Dialog><DialogTrigger render={<Button />}>Ver prévia</DialogTrigger>
            <DialogContent><DialogTitle>Prévia</DialogTitle><DialogDescription>{text.trim() || "Título de exemplo"}</DialogDescription></DialogContent>
          </Dialog><Button variant="outline" disabled={!text} onClick={() => setText("")}>Limpar</Button></div>
        </div>
      </FormSection>
      <FormSection title="Seleção com busca">
        <SearchableChoice aria-label="Idioma" searchLabel="Buscar idioma" placeholder="Escolher idioma"
          options={["Alemão", "Árabe", "Espanhol", "Francês", "Inglês", "Italiano", "Português"].map(label => ({ value: label, label }))}
          value={language} onValueChange={setLanguage} />
      </FormSection>
      <FormSection title="Lista de gerenciamento">
        <div className="family-management"><ManagementGroup title="Plataformas" count={3}>
          {Object.entries(brands).map(([key, label]) => <ManagementRow key={key}>
            <span className="family-name">{label}</span><span className="family-actions">
              <Button size="sm" variant="ghost" disabled={key === brand} onClick={() => {
                setBrand(key); document.documentElement.dataset.brand = key;
              }}>Aplicar marca</Button>
            </span></ManagementRow>)}
        </ManagementGroup></div>
      </FormSection>
      <FormSection title="Navegação">
        <Button id="show-nav" variant="outline" onClick={() => setDrawerOpen(true)}>Abrir navegação</Button>
        <SidebarDrawer desktop id="preview-nav" open={drawerOpen} onOpenChange={setDrawerOpen} title="Navegação"
          description="Exemplo da barra lateral" finalFocus={() => document.getElementById("show-nav")}>
          <Sidebar label="Navegação do catálogo" mobile>
            <SidebarBody><SidebarGroup label="Gestão" compact={false} open={groupOpen} onToggle={() => setGroupOpen(!groupOpen)}>
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Voltar ao catálogo</Button>
            </SidebarGroup></SidebarBody>
            <SidebarFooter><Button variant="outline" onClick={() => setDrawerOpen(false)}>Fechar navegação</Button></SidebarFooter>
          </Sidebar>
        </SidebarDrawer>
      </FormSection>
      <FormSection title="Abas e tabela">
        <div className="profile-content"><PageTabs label="Amostras" tabs={[
          { id: "typography", title: "Tipografia", panel: <Table aria-label="Tipografia">
            <TableHeader><TableRow><TableHead>Uso</TableHead><TableHead>Fonte</TableHead></TableRow></TableHeader>
            <TableBody><TableRow><TableCell>Interface</TableCell><TableCell>IBM Plex Sans</TableCell></TableRow>
              <TableRow><TableCell>Código</TableCell><TableCell className="font-mono">IBM Plex Mono</TableCell></TableRow></TableBody>
          </Table> },
          { id: "spacing", title: "Espaçamento", panel: <p>As margens e a altura dos controles acompanham a densidade selecionada.</p> },
        ]} /></div>
      </FormSection>
    </FormSections></PageBody>
  </main></TooltipProvider>;
}
createRoot(document.getElementById("root")!).render(<Catalog />);
