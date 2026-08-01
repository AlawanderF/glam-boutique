# Glam Boutique — API Backend (MySQL)

Backend mínimo em Node.js + Express que conecta o painel administrativo do frontend a um banco de dados **MySQL real**, gerenciável pelo **MySQL Workbench**.

> **Por que isso existe separado do frontend?** Navegadores não podem se conectar diretamente a um banco MySQL — isso é uma restrição de segurança da própria web (não existe driver MySQL para o browser, e expor a porta 3306 publicamente seria um risco grave). Por isso, o React (frontend) nunca fala direto com o MySQL; ele fala com esta API, e a API é quem conversa com o banco.

---

## Setup local

### 1. Subir o MySQL + criar banco

**Opção A — MySQL Workbench (visual):**

1. Abra o Workbench e conecte em `127.0.0.1:3306` (root).
2. **File → Open SQL Script...** → selecione [`schema.sql`](./schema.sql) → clique no raio (⚡).
3. Repita com [`seed.sql`](./seed.sql) para dados de exemplo.

**Opção B — Terminal (mais rápido):**

```bash
cd server
npm install
npm run db:setup   # roda schema.sql + seed.sql em sequência
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```bash
# Conexão MySQL (as mesmas credenciais que você usa no Workbench)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=glam_boutique

# CORS — múltiplas origens separadas por vírgula
# (vite dev = http://localhost:5173; produção = https://seudominio.com.br)
CORS_ORIGIN=http://localhost:5173

# Autenticação admin
ADMIN_EMAIL=admin@seudominio.com.br
ADMIN_PASSWORD_HASH=<gerado abaixo>
ADMIN_JWT_SECRET=<gerado abaixo>
```

**Gere os secrets (rode cada comando e cole o resultado no `.env`):**

```bash
# Hash bcrypt da senha admin (use uma senha forte)
node scripts/hashPassword.js "sua-senha-aqui"

# Secret JWT (string aleatória de 128 caracteres hex)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Rodar a API

```bash
npm run dev    # http://localhost:3333, reinicia a cada alteração
```

**Teste se está funcionando:**

```bash
curl http://localhost:3333/api/health        # não depende do banco
curl http://localhost:3333/api/health/db     # testa conexão MySQL real
```

Se `/api/health/db` retornar `disconnected`, confira credenciais no `.env` e se o MySQL está rodando.

---

## Endpoints disponíveis

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/health` | — | API no ar |
| GET | `/api/health/db` | — | Conexão MySQL |
| POST | `/api/admin/login` | — | Login admin → JWT 8h |
| GET | `/api/sales/daily?days=30` | JWT | Receita e pedidos agregados por dia |
| GET | `/api/sales/orders?limit=50` | JWT | Lista de pedidos recentes |
| GET | `/api/sales/top-products` | JWT | Produtos mais vendidos por receita |
| GET | `/api/expenses` | JWT | Lista todas as saídas |
| POST | `/api/expenses` | JWT | Cria uma nova saída |
| PATCH | `/api/expenses/:id` | JWT | Atualiza uma saída (ex: marcar como pago) |
| DELETE | `/api/expenses/:id` | JWT | Remove uma saída |
| GET | `/api/payment-methods` | — | Lista os métodos de pagamento (público) |
| POST | `/api/payment-methods` | JWT | Cria um método customizado |
| PATCH | `/api/payment-methods/:id` | JWT | Ativa/desativa ou edita um método |
| DELETE | `/api/payment-methods/:id` | JWT | Remove um método customizado |
| POST | `/api/analytics/pageview` | — | Registra uma visita |
| GET | `/api/analytics/summary?days=30` | JWT | Totais consolidados de visitas |

---

## Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm run dev` | Inicia API com auto-reload |
| `npm start` | Inicia API em modo produção |
| `npm run db:setup` | Roda schema.sql + seed.sql (cria banco e popula) |
| `npm run db:schema` | Roda só schema.sql |
| `npm run db:seed` | Roda só seed.sql |
| `npm run db:reset` | Roda schema.sql (apaga e recria tudo) |

---

## Deploy em produção (VPS único)

Recomendo Hetzner CX22 (~R$30/mês) ou Hostinger VPS. Um servidor só roda frontend (Nginx) + backend (Node) + MySQL.

```bash
# No servidor (Ubuntu 22.04+)
sudo apt update && sudo apt install -y nodejs npm mysql-server nginx
sudo npm install -g pm2

# Clone e configure
git clone https://github.com/seu-usuario/glam-boutique.git
cd glam-boutique/server
npm ci --omit=dev
cp .env.example .env
# edite .env com senha forte e ADMIN_JWT_SECRET novo
npm run db:setup

# Suba o backend com PM2
pm2 start src/index.js --name glam-api --env production
pm2 startup && pm2 save

# Build do frontend
cd ..
npm ci
VITE_API_URL=https://seudominio.com.br/api npm run build

# Copie o build pro Nginx
sudo mkdir -p /var/www/glamboutique
sudo cp -r dist/* /var/www/glamboutique/

# Configure Nginx (use o nginx.conf.example deste repo)
sudo cp nginx.conf.example /etc/nginx/sites-available/glamboutique
sudo ln -s /etc/nginx/sites-available/glamboutique /etc/nginx/sites-enabled/
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
sudo systemctl reload nginx
```

**DNS no registrador (Registro.br / Hostinger / Namecheap):**

```
Tipo    Nome    Valor                TTL
A       @       <IP-DO-VPS>          300
A       www     <IP-DO-VPS>          300
```

---

## Docker (alternativa ao setup manual)

```bash
cd server
docker build -t glam-boutique-api .
docker run -d --name glam-api -p 3333:3333 --env-file .env --restart unless-stopped glam-boutique-api
```

---

## Segurança — checklist produção

- [x] Senha do admin nunca em texto puro — só bcrypt hash
- [x] JWT com secret forte (64 bytes hex aleatórios)
- [x] CORS lockdown — só origens whitelisted
- [x] Erros do MySQL nunca vazam pro cliente
- [x] Bind `0.0.0.0` — necessário pra container/VPS
- [x] Stack traces escondidos em produção
- [ ] Rate limiting em `/api/admin/login` (não implementado — use Nginx `limit_req`)
- [ ] HTTPS obrigatório (Certbot já configura no Nginx)
- [ ] Backups automáticos do MySQL (`mysqldump` em cron diário)
- [ ] Firewall: `ufw allow 22,80,443` apenas
