# Glam Boutique — E-commerce Premium

Plataforma de e-commerce de moda de nível enterprise, construída com React 19, TypeScript, Tailwind CSS e Framer Motion. Projetada para transmitir confiança, exclusividade e elegância desde o primeiro segundo de navegação, com foco total em conversão (CRO) e experiência do cliente.

**Loja física:** Rua Quinze de Novembro, 100 - Sala 100, Centro, Guarabira - PB

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| UI | React 19 + TypeScript |
| Estilo | Tailwind CSS 3 (design system próprio: paleta `ink`/`gold`/`cream`) |
| Animações | Framer Motion |
| Roteamento | React Router v7 (lazy loading + code-splitting por rota) |
| Dados assíncronos | TanStack React Query |
| Estado global | Zustand (carrinho, wishlist, autenticação, toasts) — com persistência em `localStorage` |
| Ícones | Lucide React |
| Build | Vite 8 |

---

## Como rodar o projeto

```bash
# 1. Instalar dependências
npm install

# 2. Ambiente de desenvolvimento
npm run dev        # http://localhost:5173

# 3. Build de produção
npm run build       # gera /dist

# 4. Pré-visualizar o build de produção
npm run preview

# 5. Lint
npm run lint
```

Requisitos: **Node.js 18+** (recomendado 20+).

---

## Antes de subir para o GitHub (proteção do `.env`)

Este projeto **já está configurado** para que nenhum arquivo `.env` real vá para o repositório — só os `.env.example` (que não têm segredo nenhum, só os nomes das variáveis). Veja por quê:

```
.gitignore          → ignora .env, .env.local, .env.*.local (raiz)
server/.gitignore   → ignora .env (dentro de server/)
```

**Antes do seu primeiro commit**, é uma boa prática confirmar isso na prática:

```bash
git init
git add .
git status          # confira que NENHUM .env (só .env.example) aparece na lista
git check-ignore -v server/.env .env.local   # deve apontar a regra do .gitignore que pegou cada um
```

Se algum `.env` aparecer no `git status`, **não faça commit** — revise o `.gitignore` primeiro.

### Onde colocar as variáveis reais (sem nunca commitar)

| Onde roda | Onde colocar os segredos |
|---|---|
| Sua máquina | Arquivo `.env` / `.env.local` local (nunca commitado) |
| Frontend na Vercel/Netlify | Painel do projeto → **Environment Variables** (ex: `VITE_API_URL`) |
| Backend (`server/`) na Railway/Render | Painel do serviço → **Environment Variables** (`DB_HOST`, `DB_PASSWORD`, `ADMIN_JWT_SECRET` etc.) |
| CI/CD (GitHub Actions, se usar) | **Settings → Secrets and variables → Actions** do repositório |

### Rede de segurança extra

- No GitHub, vá em **Settings → Code security** do repositório e ative **Secret scanning** + **Push protection** — o GitHub passa a bloquear automaticamente qualquer push que contenha um padrão de chave/senha reconhecível.
- Se algum dia um `.env` for commitado por engano: **trocar a senha/chave imediatamente** é obrigatório — só apagar o arquivo num commit novo não remove do histórico. Para limpar o histórico de verdade, use [`git filter-repo`](https://github.com/newren/git-filter-repo) ou o [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) e depois force-push.

---

## Estrutura do projeto

```
src/
├── assets/            # imagens, ícones e fontes locais
├── components/
│   ├── ui/            # Button, Rating, Badge, FormField, Toast...
│   ├── layout/         # Header, Footer, AnnouncementBar, CartDrawer
│   ├── product/        # ProductCard, ProductGallery, QuickViewModal...
│   ├── category/       # CategoryCard
│   ├── catalog/         # FilterSidebar, SortDropdown, MobileFilterDrawer
│   ├── checkout/        # Steps do checkout (identificação → revisão)
│   ├── account/         # componentes da área do cliente
│   ├── auth/            # AuthLayout, SocialLoginButtons
│   ├── home/            # Hero, CategoryGrid, FeaturedProducts...
│   └── common/          # ComingSoon, ErrorBoundary, PageLoader
├── pages/               # uma pasta por rota (Home, Catalog, Product, Cart, Checkout, Account, Auth, NotFound)
├── layouts/              # MainLayout (Header + Outlet + Footer + Cart + Toasts)
├── routes/               # definição central das rotas com lazy loading
├── hooks/                # useAddToCart, useFavoriteToggle, useFilteredProducts...
├── store/                # cartStore, wishlistStore, authStore, toastStore (Zustand)
├── types/                # tipos de domínio (Product, Order, CheckoutFormData...)
├── constants/            # dados mock (produtos, categorias, marcas, pedidos) + rotas + branding
├── utils/                # formatCurrency, calculateDiscount, slugify...
└── styles/               # globals.css (design tokens, base layer, componentes utilitários)
```

---

## O que já está implementado

- **Home**: hero em tela cheia com imagem e CTA, grid de categorias com hover premium, produtos em destaque com abas (mais vendidos / lançamentos / tendências / recomendados / promoções), carrossel de marcas, depoimentos, benefícios, captura de newsletter com incentivo de 10% OFF.
- **Catálogo**: filtros por categoria, marca, cor, tamanho, gênero, faixa de preço, avaliação e disponibilidade; ordenação completa; paginação; chips de filtros ativos; skeleton loading; drawer de filtros no mobile.
- **Produto**: galeria com zoom e miniaturas, seleção de cor/tamanho/quantidade, avaliações, cross-selling ("quem comprou também comprou" e "produtos semelhantes"), visualização rápida (Quick View) reaproveitada em toda a aplicação.
- **Carrinho**: alteração de quantidade, remoção, cupom de desconto (`GLAM10`, `BEMVINDA15`, `GLAMVIP20`), cálculo de frete, barra de progresso para frete grátis, simulação de parcelamento.
- **Checkout**: fluxo em 5 etapas (Identificação → Endereço → Entrega → Pagamento → Revisão) com validação por etapa, métodos de pagamento **dinâmicos** (controlados pelo admin — ver abaixo), resumo lateral fixo e tela de confirmação do pedido.
- **Área do cliente**: perfil editável **com upload de foto real** (seleção de arquivo, validação, redimensionamento e compressão automática via canvas), histórico de pedidos com rastreamento visual, lista de desejos.
- **Autenticação**: login, cadastro, recuperação de senha e botões de login social (Google/Facebook prontos para integração OAuth real).
- **Painel administrativo** (`/admin`): visão geral com KPIs e gráfico de receita, vendas detalhadas, controle de saídas (despesas), analytics de visitantes, gerenciamento de métodos de pagamento — ver seção dedicada abaixo.
- **Acessibilidade**: navegação por teclado, `aria-label`/`aria-pressed`/`aria-live` nos componentes interativos, contraste verificado, skip-link para o conteúdo principal, foco visível customizado.
- **Performance**: code-splitting por rota (`React.lazy`), vendor chunks separados (`vendor-react`, `vendor-motion`, `vendor-data`, `vendor-icons`, `vendor-charts`) para melhor cache entre deploys, imagens com `loading="lazy"`, skeleton loading.
- **SEO**: meta tags completas, Open Graph, Twitter Card e dados estruturados (`schema.org/ClothingStore`) com o endereço físico da loja em Guarabira - PB.

---

## Painel administrativo (`/admin`)

Acesse em `/admin` (há um link discreto no rodapé da loja, "Painel administrativo"). Credenciais de demonstração:

```
E-mail: admin@glamboutique.com.br
Senha:  glamadmin123
```

(Definidas em `src/store/adminAuthStore.ts` — troque por autenticação real ao integrar com o backend.)

| Página | O que faz |
|---|---|
| **Visão geral** | KPIs (receita, pedidos, ticket médio, saídas, receita líquida), gráfico de receita dos últimos 30 dias, produtos mais vendidos |
| **Vendas** | Receita e pedidos filtráveis por período (7/14/30 dias), lista de pedidos recentes |
| **Saídas** | CRUD completo de despesas do negócio (descrição, categoria, valor, data, status de pagamento) |
| **Visitantes** | Visualizações de página e sessões únicas **reais do navegador atual** (rastreadas a cada troca de rota via `VisitTracker`), páginas mais acessadas, dispositivo (mobile/desktop) |
| **Pagamentos** | Ativa/desativa Pix, Cartão, Boleto e Carteiras digitais, edita desconto/parcelas, e permite **criar métodos customizados** — tudo isso reflete imediatamente na etapa de pagamento do checkout da loja |

**Importante sobre "Visitantes":** como é um app só de frontend, o contador de visitas usa `localStorage` — ele é real, mas só conta o navegador de quem está acessando o admin. Para ver visitas de **todos os clientes** do site (analytics de verdade), é necessário o backend com MySQL (próxima seção), que tem uma tabela `page_views` e um endpoint `/api/analytics/summary` prontos para isso.

---

## Backend MySQL (pasta `server/`)

A pasta [`server/`](./server) contém uma API Node.js + Express + MySQL completa. O login admin **já está integrado** — preencha `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `ADMIN_JWT_SECRET` no `server/.env` e a autenticação para de usar o modo demo.

Resumo rápido (instruções completas em [`server/README.md`](./server/README.md)):

```bash
# 1. Subir MySQL local
sudo systemctl start mysql   # ou via MySQL Workbench

# 2. Setup
cd server
npm install
cp .env.example .env
# Edite .env com suas credenciais MySQL + ADMIN_PASSWORD_HASH + ADMIN_JWT_SECRET
npm run db:setup   # cria banco + popula com dados de exemplo
npm run dev        # API em http://localhost:3333
```

Para o frontend usar o backend local, crie `.env.local` na raiz do projeto:

```bash
echo 'VITE_API_URL=http://localhost:3333/api' > .env.local
```

---

## Deploy em produção

Opção mais simples: **VPS único (Hetzner CX22 / Hostinger)** rodando MySQL + Node + Nginx. ~R$30/mês.

Setup completo em [`server/README.md`](./server/README.md#deploy-em-produção-vps-único).

DNS no registrador:
```
Tipo    Nome    Valor           TTL
A       @       <IP-VPS>        300
A       www     <IP-VPS>        300
```

HTTPS gratuito via `certbot --nginx` (instruções no README do server).

**Alternativas gerenciadas** (mais caro, menos controle): Vercel (frontend) + Railway (backend + MySQL). ~$15/mês.

---

## Próximos passos sugeridos (opcional)

Os dados de produtos, categorias, marcas, depoimentos e pedidos estão em `src/constants/*.ts` como mocks. Para produção:

1. Substituir os mocks por chamadas reais via `src/services/` (a ser criado) usando React Query (`useQuery`/`useMutation`).
2. Conectar `authStore.ts` a um backend de autenticação real (JWT/OAuth) — os botões sociais em `SocialLoginButtons.tsx` já estão prontos para receber o fluxo OAuth.
3. Integrar `StepPayment.tsx` a um gateway de pagamento real (Pix/cartão/boleto) — atualmente simula a confirmação.
4. Configurar variáveis de ambiente (`.env`) para a URL da API e chaves públicas de gateway.
5. Adicionar testes (estrutura já prevista em `src/tests/`).

---

## Identidade visual

- **Paleta**: `ink` (preto/grafite profundo), `gold` (dourado envelhecido — exclusividade) e `cream` (off-white quente).
- **Tipografia**: Playfair Display (títulos, editorial/luxo) + Inter (corpo, legibilidade).
- Todas as decisões de hover, transição e espaçamento seguem a curva de easing `cubic-bezier(0.22, 1, 0.36, 1)` ("luxe") para um movimento suave e sofisticado.
