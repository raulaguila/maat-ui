# Maat UI

O pacote **@maat/ui** é a biblioteca de componentes da família Maat, formada por Seshat, Thoth e Khnum. A aplicação fornece rotas, ações, permissões e dados. O pacote fornece os controles, sua interação e as medidas de layout.

## Instalar e usar

Com React 19, React DOM 19 e Tailwind CSS 4 instalados, adicione o arquivo da versão ao projeto com `pnpm add ./vendor/maat-ui-0.2.0.tgz`. A distribuição contém JavaScript ES modules, declarações TypeScript e fontes com licença OFL. Cada build funciona com o pacote incluído no próprio checkout.

No CSS global, importe os estilos uma vez:

```css
@import "tailwindcss";
@import "@maat/ui/styles.css";
```

No elemento `html`, informe `data-brand="thoth"`, `"seshat"` ou `"khnum"`. Use a classe `dark` e o atributo opcional `data-density="compact"` para as preferências. As variáveis de tipografia aceitam fontes já carregadas pelo aplicativo. A marca identifica o produto, e as cores de ação e foco são comuns.

```tsx
import { PageHeader, PageBody, FormSections, FormSection, Label, Input } from "@maat/ui";

export function Profile() {
  return <main>
    <PageHeader title="Perfil" />
    <PageBody><FormSections><FormSection title="Identidade">
      <Label htmlFor="name">Nome</Label><Input id="name" />
    </FormSection></FormSections></PageBody>
  </main>;
}
```

Para localizar controles, envolva a aplicação em `FamilyUIProvider` com `labels={{ close, rows, of, previous, next }}`. O idioma inicial da biblioteca é português. Para importar um único módulo, use, por exemplo, `@maat/ui/button` ou `@maat/ui/layout`.

## Componentes

O Seshat é a referência de apresentação. Quando o Thoth precisa de um controle adicional, ele usa os mesmos tokens, fontes e estados. Entre as extensões estão o seletor pesquisável, os grupos de campos, o painel recolhível e os gráficos. `IconAction` implementa o botão de ícone com nome acessível e tooltip. `PageTabs` mantém as abas endereçáveis pelo fragmento da URL.

Os módulos opcionais `@maat/ui/chart` (Recharts) e `@maat/ui/sonner` (Sonner e next-themes) têm entradas próprias. Instale os respectivos peers no produto que os utiliza.

Botões, campos, seleção, checkbox, switch, badges, avatares, abas, cartões, tabelas, paginação, menus, diálogos, painéis, tooltips e skeletons compartilham tamanhos e estados. `Sidebar`, `SidebarBody` e `SidebarFooter` mantêm um centro rolável e o rodapé na base. A aplicação fornece a marca e os itens do menu. `ManagementGroup` e `ManagementRow` agrupam itens com um título acessível. Use o contêiner `family-management` e as áreas `family-open`, `family-roles`, `family-stats` e `family-actions` para reorganizar as linhas pela largura disponível.

## Desenvolver e distribuir

1. Execute `pnpm install --frozen-lockfile`, `pnpm test` e `pnpm catalog`. O catálogo permite alternar os três produtos, tema e densidade e testar os componentes. `pnpm catalog:build` gera a versão estática.
2. Altere a versão seguindo SemVer. Uma remoção de componente, prop ou token público requer versão principal. Documente mudanças visuais que os consumidores devam conferir.
3. Execute `pnpm pack` uma vez e distribua o mesmo arquivo aos consumidores. Adicione-o a `vendor/`, atualize a dependência e o lockfile e rode os testes de cada aplicação. O build Docker copia a versão do pacote antes da instalação. Remova a versão anterior de `vendor/` ao atualizar.

As referências de validação são Perfil, Workspaces/Datasets e a sidebar, com mouse e teclado no desktop e alvos de 44 px no toque.
