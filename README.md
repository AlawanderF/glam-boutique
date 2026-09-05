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
npm run dev        # http://localhost:3000

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

Acesse em `/admin`. **Requer backend configurado** — ver seção "Backend MySQL" abaixo.

| Página | O que faz |
|--------|-----------|
| **Visão geral** | KPIs (receita, pedidos, ticket médio, saídas, receita líquida), gráfico de receita, produtos mais vendidos |
| **Vendas** | Receita e pedidos filtráveis por período (7/14/30 dias) |
| **Saídas** | CRUD completo de despesas (descrição, categoria, valor, data, status) |
| **Visitantes** | Page views e sessões (requer backend com tabela `page_views`) |
| **Pagamentos** | Ativa/desativa Pix, Cartão, Boleto — reflete no checkout em tempo real |

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
npm run dev        # API em http://localhost:8000
```

Para o frontend usar o backend local, crie `.env.local` na raiz do projeto:

```bash
echo 'VITE_API_URL=http://localhost:8000/api' > .env.local
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

## Configuração de produção

### 1. Google Analytics 4

Abra [`index.html`](index.html) e substitua `G-XXXXXXXXXX` pelo seu ID do GA4:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

Para obter o ID: [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → Web Stream → Measurement ID.

---

### 2. GitHub Pages (deploy automático)

1. Acesse **Settings → Pages** do repositório
2. Em "Build and deployment → Source", selecione **GitHub Actions**
3. Push qualquer commit na branch `main` — o deploy roda automaticamente

URL do site: `https://AlawanderF.github.io/glam-boutique/`

O workflow em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) já está configurado.

---

### 3. Backend MySQL

```bash
cd server

# 1. Instalar dependências
npm install

# 2. Criar arquivo de ambiente
cp .env.example .env

# 3. Configurar .env:
#    - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (credenciais MySQL)
#    - ADMIN_EMAIL (e-mail do admin)
#    - ADMIN_PASSWORD_HASH (ver passo 4)
#    - ADMIN_JWT_SECRET (ver passo 4)
#    - SMTP_* (ver passo 5)

# 4. Gerar hash da senha admin e JWT secret
node -e "console.log('ADMIN_JWT_SECRET:'); console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('sua-senha-forte', 10).then(h => console.log('ADMIN_PASSWORD_HASH:' + h))"

# 5. Criar banco de dados
mysql -u root -p -e "CREATE DATABASE glam_boutique;"
npm run db:setup   # executa schema.sql + seed.sql

# 6. Iniciar API
npm run dev        # http://localhost:8000
```

---

### 4. E-mails transacionais (SMTP)

No `.env` do server, configure:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=re_xxxxx_seu_api_key
SMTP_FROM=noreply@glamboutique.com.br
FRONTEND_URL=https://AlawanderF.github.io/glam-boutique
```

Recomendado: [**Resend**](https://resend.com) (500 emails grátis/mês) ou SendGrid/Amazon SES.

---

### 5. Variáveis de ambiente do frontend

Crie `.env.local` na raiz do projeto:

```bash
VITE_API_URL=http://localhost:8000/api    # desenvolvimento
VITE_GA4_ID=G-XXXXXXXXXX                   # opcional
```

Para produção (Vercel/Netlify), configure no painel do projeto em **Settings → Environment Variables**.

---

### Checklist de produção

| Tarefa | Status | Onde |
|--------|--------|------|
| Google Analytics 4 | ⬜ | `index.html` |
| GitHub Pages ativo | ⬜ | github.com/settings/pages |
| Backend MySQL rodando | ⬜ | `server/` |
| Admin configurado | ⬜ | `server/.env` |
| SMTP configurado | ⬜ | `server/.env` |
| Domínio personalizado | ⬜ | Registrar + DNS |

---

## Migração para dados reais

Os dados mock em `src/constants/*.ts` devem ser substituídos por chamadas à API:

1. **Produtos/Categorias/Marcas**: criar `src/services/products.ts` com `useQuery` + `useMutation`
2. **Autenticação de clientes**: conectar `authStore.ts` ao backend JWT
3. **Login social**: OAuth callbacks em `SocialLoginButtons.tsx`
4. **Pagamentos**: integrar gateway real (Stripe, Pagar.me, MercadoPago)
5. **Pedidos**: salvar via API ao confirmar checkout

---

## Estrutura do projeto

```
src/
├── components/          # UI modular por domínio
├── pages/               # Uma pasta por rota
├── store/               # Zustand (estado global)
├── hooks/               # Lógica reutilizável
├── services/            # Camada de acesso à API
├── constants/           # Dados mock
└── types/               # TypeScript types
```

---

## Identidade visual

- **Paleta**: `ink` (preto/grafite profundo), `gold` (dourado envelhecido — exclusividade) e `cream` (off-white quente).
- **Tipografia**: Playfair Display (títulos, editorial/luxo) + Inter (corpo, legibilidade).
- Todas as decisões de hover, transição e espaçamento seguem a curva de easing `cubic-bezier(0.22, 1, 0.36, 1)` ("luxe") para um movimento suave e sofisticado.
