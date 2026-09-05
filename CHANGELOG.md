# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-05

### Added
- Frontend React completo com TypeScript
- Catálogo de produtos com filtros (categoria, preço, marca, cor, tamanho)
- Carrinho de compras com Zustand
- Checkout completo (endereço, pagamento, envio)
- Autenticação (login, registro, recuperação de senha)
- Painel administrativo completo:
  - Dashboard com KPIs e gráficos
  - Gestão de vendas
  - Controle de despesas
  - Analytics de visitantes
  - Configuração de métodos de pagamento
- Backend Express com MySQL
- API REST para admin (vendas, despesas, analytics)
- Autenticação JWT para admin
- Rate limiting e helmet para segurança
- PWA com service worker
- SEO otimizado
- Deploy para GitHub Pages
- CI/CD com GitHub Actions

### Security
- Helmet.js para headers de segurança
- Rate limiting no login (5 tentativas/15min)
- Validação de input no backend
- Conversão snake_case/camelCase automática
- Token JWT com expiração

### Performance
- Lazy loading de rotas
- Code splitting
- Skeleton loading states
- Imagens otimizadas
