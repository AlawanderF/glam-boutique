# Glam Boutique - Claude Code Context

## Visão Geral

E-commerce completo para Glam Boutique — roupas, calçados e acessórios. Frontend em React + TypeScript + Vite. Backend em Node.js + Express + MySQL.

## Estrutura do Projeto

```
glam-boutique/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   │   ├── admin/         # Dashboard admin
│   │   ├── catalog/       # Catálogo
│   │   ├── checkout/      # Checkout
│   │   ├── layout/        # Header, Footer
│   │   └── product/       # Detalhes de produto
│   ├── pages/             # Páginas
│   │   ├── Admin/         # Painel admin
│   │   ├── Auth/          # Login, registro
│   │   ├── Checkout/      # Fluxo de checkout
│   │   └── Catalog/       # Listagem de produtos
│   ├── store/             # Zustand stores
│   ├── hooks/             # Custom hooks
│   ├── services/          # API client
│   ├── types/             # TypeScript types
│   └── constants/         # Dados mock
├── server/                 # Backend Express
│   └── src/
│       ├── routes/        # API endpoints
│       └── services/      # Email service
└── public/                # Assets públicos
```

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 8 (build)
- TailwindCSS 3 (styling)
- Zustand 5 (state)
- React Router 7
- Recharts 3 (gráficos)
- Framer Motion 12 (animações)

### Backend
- Node.js + Express 4
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcryptjs (senhas)
- Nodemailer (email)
- helmet + rate-limit (segurança)

## Convenções de Código

### Nomenclatura
- Componentes: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase com prefixo `use` (`useCart.ts`)
- Stores: camelCase (`cartStore.ts`)
- Funções: camelCase (`fetchProducts`)
- Constantes: SCREAMING_SNAKE_CASE

### Import Paths
Usar alias `@/` para imports de src:
```typescript
import { Button } from '@/components/ui/Button';
import { useCart } from '@/store/cartStore';
```

### Estado de Componentes
- Preferir hooks locais (`useState`) sobre stores globais para estado UI
- Stores Zustand para estado compartilhado (auth, cart, wishlist)
- Persistência via localStorage para dados do usuário

## API Endpoints

### Autenticação Admin
- `POST /api/admin/login` — Login admin (JWT)

### Vendas
- `GET /api/sales/daily?days=N` — Vendas diárias
- `GET /api/sales/orders?limit=N` — Lista de pedidos
- `GET /api/sales/top-products` — Produtos mais vendidos

### Despesas
- `GET /api/expenses` — Lista despesas
- `POST /api/expenses` — Criar despesa
- `PATCH /api/expenses/:id` — Atualizar despesa
- `DELETE /api/expenses/:id` — Remover despesa

### Métodos de Pagamento
- `GET /api/payment-methods` — Lista métodos (público)
- `POST /api/payment-methods` — Criar método (admin)
- `PATCH /api/payment-methods/:id` — Atualizar método (admin)
- `DELETE /api/payment-methods/:id` — Remover método (admin)

### Analytics
- `POST /api/analytics/pageview` — Registrar visita
- `GET /api/analytics/summary?days=N` — Resumo analytics (admin)

## Comandos Úteis

```bash
# Desenvolvimento frontend
npm run dev

# Build produção
npm run build

# Build GitHub Pages
npm run build:gh-pages

# Lint
npm run lint

# Type check
npm run typecheck

# Backend
cd server && npm run dev
```

## Variáveis de Ambiente

Frontend (.env):
- `VITE_API_URL` — URL da API backend
- `VITE_BASE_PATH` — Base path (para GitHub Pages)
- `VITE_GA4_ID` — Google Analytics 4 ID

Backend (.env):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `PORT` — Porta do servidor (default: 8000)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_JWT_SECRET`
- `CORS_ORIGIN` — Origens permitidas (vírgulas para múltiplas)
- `SMTP_*` — Configuração de email

## Deploy

- **Frontend**: Vercel, Netlify ou GitHub Pages
- **Backend**: Node.js server (porta 8000)
- Ver `vercel.json`, `netlify.toml`, `nginx.conf.example`
