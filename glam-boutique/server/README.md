# Glam Boutique — API Backend (MySQL)

Backend mínimo em Node.js + Express que conecta o painel administrativo do frontend a um banco de dados **MySQL real**, gerenciável pelo **MySQL Workbench**.

> **Por que isso existe separado do frontend?** Navegadores não podem se conectar diretamente a um banco MySQL — isso é uma restrição de segurança da própria web (não existe driver MySQL para o browser, e expor a porta 3306 publicamente seria um risco grave). Por isso, o React (frontend) nunca fala direto com o MySQL; ele fala com esta API, e a API é quem conversa com o banco.

---

## Passo a passo no MySQL Workbench

1. **Abra o MySQL Workbench** e crie/abra uma conexão com seu servidor MySQL local (ex: `127.0.0.1:3306`, usuário `root`).
2. Vá em **File → Open SQL Script...** e selecione o arquivo [`schema.sql`](./schema.sql) desta pasta.
3. Clique no ícone de **raio (⚡ Execute)** para rodar o script. Isso cria o banco `glam_boutique` e todas as tabelas (`customers`, `products`, `orders`, `order_items`, `expenses`, `payment_methods`, `page_views`).
4. Repita o processo com [`seed.sql`](./seed.sql) para popular o banco com alguns dados de exemplo (opcional, mas recomendado para testar).
5. No painel esquerdo do Workbench (**Schemas**), clique com o botão direito e em **Refresh All** para ver as tabelas criadas.

Alternativamente, em vez do Workbench, você pode rodar os mesmos scripts via terminal:

```bash
npm run db:schema   # executa schema.sql
npm run db:seed     # executa seed.sql
```

---

## Configurar e rodar a API

```bash
# 1. Entre na pasta do servidor
cd server

# 2. Instale as dependências
npm install

# 3. Copie o .env de exemplo e ajuste com as credenciais do seu MySQL
cp .env.example .env
# edite DB_HOST, DB_USER, DB_PASSWORD, DB_NAME conforme sua conexão no Workbench

# 4. Rode o servidor
npm run dev      # http://localhost:3333, reinicia automaticamente a cada alteração
```

Teste se subiu corretamente:

```bash
curl http://localhost:3333/api/health        # não depende do banco
curl http://localhost:3333/api/health/db     # testa a conexão real com o MySQL
```

Se `api/health/db` retornar `{"status":"error","database":"disconnected"}`, confira as credenciais no `.env` e se o serviço do MySQL está rodando.

---

## Endpoints disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica se a API está no ar |
| GET | `/api/health/db` | Verifica a conexão com o MySQL |
| GET | `/api/sales/daily?days=30` | Receita e pedidos agregados por dia |
| GET | `/api/sales/orders?limit=50` | Lista de pedidos recentes |
| GET | `/api/sales/top-products` | Produtos mais vendidos por receita |
| GET | `/api/expenses` | Lista todas as saídas |
| POST | `/api/expenses` | Cria uma nova saída |
| PATCH | `/api/expenses/:id` | Atualiza uma saída (ex: marcar como pago) |
| DELETE | `/api/expenses/:id` | Remove uma saída |
| GET | `/api/payment-methods` | Lista os métodos de pagamento |
| POST | `/api/payment-methods` | Cria um método customizado |
| PATCH | `/api/payment-methods/:id` | Ativa/desativa ou edita um método |
| DELETE | `/api/payment-methods/:id` | Remove um método customizado |
| POST | `/api/analytics/pageview` | Registra uma visita (qualquer visitante) |
| GET | `/api/analytics/summary?days=30` | Totais consolidados de visitas de todos os usuários |

---

## Conectar o frontend a esta API (próximo passo)

Atualmente, o painel administrativo do React (`src/store/expensesStore.ts`, `paymentMethodsStore.ts`, `analyticsStore.ts`) funciona com **dados locais (mock/localStorage)** — funciona imediatamente, sem precisar deste servidor, para fins de demonstração.

Para passar a usar o MySQL de verdade:

1. Suba esta API (`npm run dev` nesta pasta).
2. No frontend, crie `src/services/api.ts` com `fetch` apontando para `http://localhost:3333/api` (ou configure `VITE_API_URL` em um `.env` do frontend).
3. Substitua as actions das stores (`addExpense`, `toggleEnabled` etc.) por chamadas a essa API + `await` + atualização do estado local com a resposta — ou migre para `useQuery`/`useMutation` do React Query, que já está instalado no frontend.

Essa separação foi intencional: o frontend funciona sozinho para qualquer pessoa testar a interface, e a integração real com MySQL é "plugável" quando o backend estiver no ar.
