# Como Contribuir

Obrigado por contribuir com o Glam Boutique! Este documento fornece diretrizes para contribuir com o projeto.

## Branch Strategy

1. Fork o repositório
2. Clone seu fork: `git clone https://github.com/SEU_USER/glam-boutique.git`
3. Crie uma branch: `git checkout -b feature/nome-da-feature`
4. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`
5. Push para a branch: `git push origin feature/nome-da-feature`
6. Abra um Pull Request

## Conventional Commits

Usamos Conventional Commits para mensagens de commit:

- `feat:` — Nova feature
- `fix:` — Correção de bug
- `docs:` — Mudanças na documentação
- `style:` — Formatação, ponto e vírgula, etc (sem mudança de código)
- `refactor:` — Refatoração de código
- `test:` — Adição de testes
- `chore:` — Tarefas de manutenção

Exemplos:
```
feat: adiciona filtro de categoria no catálogo
fix: corrige condição de corrida na página de produto
docs: atualiza README com novo deploy
```

## Requisitos de Código

- TypeScript strict mode habilitado
- ESLint passando sem erros
- Nenhum TypeScript error (`npm run typecheck`)
- Componentes com props tipadas
- Funções documentadas com JSDoc quando necessário

## Setup de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar lint
npm run lint

# Rodar typecheck
npm run typecheck
```

## Pull Request Checklist

- [ ] Branch atualizada com main
- [ ] Commits seguem conventional commits
- [ ] Lint passa
- [ ] Typecheck passa
- [ ] Testes adicionados/atualizados (se aplicável)
- [ ] Descrição clara do PR

## Issues

- Use templates de issue do GitHub
- Descreva o problema claramente
- Inclua steps para reproduzir
- Adicione screenshots se aplicável

## Dúvidas?

- Abra uma issue com a tag `question`
- Contribuições são bem-vindas!
