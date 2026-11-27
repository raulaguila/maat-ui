# Maat UI

O pacote **@raulaguila/maat-ui** é a biblioteca de componentes da família Maat, formada por Seshat, Thoth e Khnum. A aplicação fornece rotas, ações, permissões e dados. O pacote fornece os controles, sua interação e as medidas de layout.

## Instalar e usar

O pacote público requer React 19, React DOM 19 e Tailwind CSS 4. Escolha a versão em cada frontend:

```sh
pnpm add --save-exact @raulaguila/maat-ui@0.4.0
```

Inclua o `package.json` e o `pnpm-lock.yaml` no mesmo commit.

No CSS global, importe os estilos uma vez:

```css
@import "tailwindcss";
@import "@raulaguila/maat-ui/styles.css";
```

No elemento `html`, informe `data-brand="thoth"`, `"seshat"` ou `"khnum"`. Use a classe `dark` e o atributo opcional `data-density="compact"` para as preferências. As variáveis de tipografia aceitam fontes já carregadas pelo aplicativo. A marca identifica o produto, e as cores de ação e foco são comuns.

```tsx
import { PageHeader, PageBody, FormSections, FormSection, Label, Input } from "@raulaguila/maat-ui";

export function Profile() {
  return <main>
    <PageHeader title="Perfil" />
    <PageBody><FormSections><FormSection title="Identidade">
      <Label htmlFor="name">Nome</Label><Input id="name" />
    </FormSection></FormSections></PageBody>
  </main>;
}
```

Para localizar controles, envolva a aplicação em `FamilyUIProvider` com `labels={{ close, rows, of, previous, next }}`. O idioma inicial da biblioteca é português. Para importar um único módulo, use, por exemplo, `@raulaguila/maat-ui/button` ou `@raulaguila/maat-ui/layout`.

## Componentes

`PasswordInput` oferece visibilidade da senha e informa o estado de Caps Lock. `ConfirmDialog` aguarda ações assíncronas, mantém o foco inicial em Cancelar para ações destrutivas e aceita `formatError` para mensagens do produto. `EmptyState` aceita ação opcional e variante compacta. `QueryErrorState` mostra uma mensagem de erro e oferece nova tentativa quando recebe `onRetry`. As aplicações fornecem traduções por `FamilyUIProvider` e decidem quando a operação pode ser repetida.

O Seshat é a referência de apresentação. Quando o Thoth precisa de um controle adicional, ele usa os mesmos tokens, fontes e estados. Entre as extensões estão o seletor pesquisável, os grupos de campos, o painel recolhível e os gráficos. `IconAction` implementa o botão de ícone com nome acessível e tooltip. `PageTabs` mantém as abas endereçáveis pelo fragmento da URL.

Os módulos opcionais `@raulaguila/maat-ui/chart` (Recharts) e `@raulaguila/maat-ui/sonner` (Sonner e next-themes) têm entradas próprias. Instale os respectivos peers no produto que os utiliza.

`ApplicationShell`, disponível em `@raulaguila/maat-ui/layout`, organiza a navegação lateral, o cabeçalho e a região principal rolável. Passe `sidebar` (incluindo o drawer), `header`, `skipLabel` traduzido e o conteúdo como filho. A biblioteca define margens, alturas e link de salto para o conteúdo nas três plataformas. O produto continua responsável por rotas, permissões e estado da navegação.

Botões, campos, seleção, checkbox, switch, badges, avatares, abas, cartões, tabelas, paginação, menus, diálogos, painéis, tooltips e skeletons compartilham tamanhos e estados. `Sidebar`, `SidebarBody` e `SidebarFooter` mantêm um centro rolável e o rodapé na base. A aplicação fornece a marca e os itens do menu. `ManagementGroup` e `ManagementRow` agrupam itens com um título acessível. Use o contêiner `family-management` e as áreas `family-open`, `family-roles`, `family-stats` e `family-actions` para reorganizar as linhas pela largura disponível.

## Desenvolver e distribuir

1. Execute `pnpm install --frozen-lockfile`, `pnpm test` e `pnpm catalog`. O catálogo permite alternar os três produtos, tema e densidade e testar os componentes. `pnpm catalog:build` gera a versão estática.
2. Altere a versão seguindo SemVer. Uma remoção de componente, prop ou token público requer versão principal. Documente mudanças visuais que os consumidores devam conferir.
3. No npm, configure o publicador confiável GitHub Actions para o repositório `raulaguila/maat-ui` e o workflow `publish.yml`.
4. Faça commit da versão e envie a tag correspondente, por exemplo `v0.2.2`. O workflow de publicação verifica a versão da tag, executa os testes, compila o catálogo e publica o pacote no npm público e testa a instalação anônima.

As referências de validação são Perfil, Workspaces/Datasets e a sidebar, com mouse e teclado no desktop e alvos de 44 px no toque.

## Contrato de comandos Make

O [contrato da família](tools/check_make_contract.py) define os alvos comuns e os perfis `backend`, `frontend` e `worker` (treino de IA). Cada plataforma mantém uma cópia deste arquivo em `.github/scripts/`. Ao mudar a lista, copie o arquivo para os repositórios do backend e do frontend do Thoth, do Seshat e do Khnum no mesmo conjunto de alterações. A CI de cada repositório verifica seu próprio checkout com Python 3 e GNU Make, sem acessar os outros repositórios.

Para verificar um componente localmente, execute, por exemplo, `python3 tools/check_make_contract.py frontend ../dataset/frontend` a partir deste repositório. O verificador lê as regras resolvidas pelo Make e aceita aliases que levem a uma receita. A execução das suítes e dos builds continua nos jobs de cada componente.

### Contrato operacional v2

| Área | Critério verificável |
| --- | --- |
| Recuperação | `make db-restore` restaura em destino novo e recusa destino existente. `make verify-restore` verifica uma restauração isolada. O ensaio de cada produto deve comprovar que os dados de origem permanecem íntegros; no Khnum, deve incluir os adaptadores. Uma eventual substituição do banco ativo tem comando próprio e exige escolha explícita. |
| Saúde | `GET /livez` indica que o processo atende. `GET /readyz` retorna 200 quando a aplicação pode atender e 503 quando perde a dependência obrigatória. Os healthchecks de prontidão usam essa segunda rota. Probes legados preservam seu significado. |
| CI do backend | O pipeline verifica compilação, testes de integração com o banco, lint e análise de vulnerabilidades Go com versões de ferramentas fixadas. |
| Regressão visual | A CI de cada frontend compara imagens de referência do perfil, sidebar e lista principal, no desktop e no celular. Também verifica largura e centralização do card de login. |
| Erros HTTP | O status vem no HTTP. O corpo público tem `code` textual estável, `message` legível e, quando disponíveis, `field` e `details`. Clientes do Thoth podem solicitar esse formato com `X-Maat-Error-Format: 1`; a resposta padrão da v1 preserva o tipo numérico de `code`. |
| Autenticação | As APIs publicam operações de conta em `/v1/auth/*`, incluindo login e refresh. Endereços públicos e contratos anteriores continuam funcionando. A sessão de cada plataforma permanece independente. |
| OpenAPI | `GET /openapi.yaml` fornece OpenAPI 3 sem credenciais; os formatos e endereços de documentação já utilizados continuam disponíveis. A CI do produto valida a geração do documento. |

O verificador Make confirma os alvos disponíveis. Para exercitar a API já iniciada, use o smoke HTTP somente leitura a partir do checkout Maat. Informe o endereço da API da instalação e o produto (`thoth`, `seshat` ou `khnum`).

```sh
python3 tools/check_http_contract.py khnum http://127.0.0.1:8090
```

Para o cenário de banco indisponível, use uma instalação de teste isolada. Com a falha já simulada, acrescente `--expect-ready 503`. O smoke verifica o processo, a prontidão, o erro de uma consulta de perfil sem autenticação e a versão publicada do OpenAPI. A simulação de falha e os testes autenticados ficam com a suíte do produto.
