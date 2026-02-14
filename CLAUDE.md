# claudecontrol-test

## Sobre
TODO CLI em Node.js que permite adicionar, listar e completar tarefas.

## Comandos

- **Testes**: `npm test`
- **Build**: `node src/index.js`
- **Lint**: `npx eslint .`

## Convencoes

- Commits em portugues, imperativos: "Adicionar X", "Corrigir Y"
- Branches: `feature/<descricao>`, `fix/<descricao>`
- PRs sempre com descricao e plano de testes
- Main protegida — merge somente via PR com testes passando

## Estrutura

```
src/
  index.js          # Entry point
tests/
  todo.test.js      # Testes com vitest
```

## Regras

- Maximo 300 linhas neste arquivo
- Testes obrigatorios para novas funcionalidades
- Nao commitar secrets ou credenciais
- Usar .env para configuracao local
