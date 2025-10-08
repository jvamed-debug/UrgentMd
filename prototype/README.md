# FamFin Prototype Assets

Este diretório contém um protótipo inicial em React Native/Expo para o aplicativo **FamFin – Gestor Financeiro Familiar Inteligente**.

## Conteúdo
- `react-native/package.json`: dependências sugeridas (Expo) para iniciar o app.
- `react-native/App.tsx`: ponto de entrada com navegação bottom-tab.
- `react-native/src/navigation/RootNavigator.tsx`: navegação principal com cinco abas.
- `react-native/src/screens`: telas base (Dashboard, Transações, Relatórios, Família, Configurações).
- `react-native/src/components`: componentes reutilizáveis (cartões de resumo, títulos de seção, sugestões).

## Como iniciar (exemplo)
```bash
cd prototype/react-native
npm install
npm run start
```

> **Nota:** Este protótipo é estático e serve como base de UI. Integrações com backend, OCR e IA devem ser implementadas conforme a especificação em `docs/FamFin_Spec.md`.
