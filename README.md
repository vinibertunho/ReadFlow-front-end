# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure a URL base do backend:

```bash
VITE_READFLOW_API_URL=https://seu-backend.com
```

O front monta automaticamente a rota `/api/livros` sobre essa base. A resposta aceita array direto ou dados dentro de `books`, `items` ou `data`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
