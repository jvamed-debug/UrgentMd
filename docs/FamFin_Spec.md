# FamFin – Gestor Financeiro Familiar Inteligente

## 1. Visão Geral
- **Plataformas:** iOS (>= 14) e Android (>= 10) com base em Flutter ou React Native.
- **Idiomas:** Português-BR (padrão), Inglês (EN), Espanhol (ES).
- **Acessibilidade:** VoiceOver (iOS) e TalkBack (Android), contraste AA+, suporte a fontes dinâmicas.
- **Autenticação:** E-mail/senha, biometria (Face ID/Touch ID e biometria Android), contas familiares compartilhadas com até 6 membros.
- **Perfis de Usuário:** Administrador, Editor e Visualizador com permissões granulares para transações, relatórios e aprovações.
- **Hospedagem/Sincronização:** Backend serverless via Firebase ou AWS Amplify com sincronização em tempo real e armazenamento seguro (S3 + KMS ou Firebase Storage com regras customizadas).
- **Compliance:** LGPD/GDPR, criptografia end-to-end, auditoria de acesso e logs de alteração.

## 2. Arquitetura Recomendada
| Camada | Tecnologia | Descrição |
| --- | --- | --- |
| Front-end | Flutter (Dart) **ou** React Native (TypeScript) | UI nativa com navegação bottom-tab e suporte a temas claro/escuro. |
| Backend | Firebase (Authentication, Firestore, Storage, Functions) **ou** AWS Amplify (Cognito, AppSync, S3, Lambda) | Sincronização em tempo real, hospedagem de documentos, notificações. |
| OCR/ML | Google ML Kit, Tesseract OCR, TensorFlow Lite | Captura de recibos, categorização inteligente e previsões financeiras. |
| Integrações | APIs NF-e, Open Banking, Google Calendar, WhatsApp | Importação de dados fiscais/bancários e compartilhamentos. |

### 2.1 Fluxo de Dados
1. Usuário autentica via e-mail/biometria.
2. Aplicativo consulta perfil familiar e permissões.
3. Operações CRUD nas coleções "families", "members", "transactions" e "goals" via sincronização em tempo real.
4. Funções em nuvem processam documentos (NF-e, extratos) e alimentam categorização inteligente.
5. Dashboards e relatórios consomem dados agregados e projeções geradas por jobs agendados (Cloud Scheduler/EventsBridge).

## 3. Funcionalidades Detalhadas
### 3.1 Gestão de Usuários Familiares
- **Cadastro do Administrador:** criação do perfil da família (nome, foto, renda média, moeda padrão).
- **Convites:** envio por e-mail ou link compartilhável com expiração configurável.
- **Permissões:**
  - Administrador: gerencia assinaturas, membros, limites, relatórios.
  - Editor: adiciona/edita transações, metas e documentos.
  - Visualizador: consulta dashboards e exporta relatórios.
- **Auditoria:** histórico de alterações por membro com filtros por data.

### 3.2 Documentos Financeiros
- **NF-e:** importação por XML, chave de acesso ou QR Code, mapeando valores, itens e impostos (ICMS, PIS/COFINS).
- **Extratos Bancários:** upload PDF/OFX, integração Open Banking (OAuth2) e parsing via OCR.
- **Notas em Papel:** captura com câmera, OCR em tempo real, leitura de valores, itens e localização.
- **Armazenamento:** criptografia, 5 GB gratuitos, planos premium ilimitados.
- **Validação:** reconhecimento de duplicidade e sugestão de vinculação a transações existentes.

### 3.3 Registro e Categorização de Transações
- **Transações Manuais:** receitas/despesas com valor, data, categoria, tags, anexos, divisão de responsabilidade entre membros.
- **Transações Automáticas:** ingestão programada via APIs bancárias (com consentimento).
- **Categorização Inteligente:** modelo TensorFlow Lite treinado com histórico + palavras-chave.
- **Orçamentos:** limites mensais por categoria com alertas push aos 80% e 100%.
- **Modo Offline:** SQLite/local storage com fila de sincronização ao reconectar.

### 3.4 Sugestões de Orçamento e Reservas
- **Engine Analítica:** avalia histórico de 3-12 meses, número de membros, renda média e inflação (API IBGE).
- **Distribuição Sugerida:**
  - Despesas Fixas: 50-60% (moradia 25%, alimentação 15%, transporte 10%).
  - Despesas Variáveis: 20-30% (lazer 10%, saúde 10%).
  - Reservas/Investimentos: 10-20% (fundo emergência 10%, poupança/investimentos 10%).
- **Insights:** cards com dicas contextuais (ex.: "Aumente a reserva para 15% para cobrir imprevistos").
- **Visualização:** gráficos pizza/barras usando Charts (iOS) ou MPAndroidChart (Android) / Victory Native (React Native).

### 3.5 Relatórios e Alertas
- **Dashboards:** saldo consolidado, fluxo de caixa mensal/anual, tendências por categoria.
- **Exportação:** PDF/Excel, com filtros por membro, categoria, período.
- **Previsões:** projeções de saldo futuro com base em médias móveis e gastos recorrentes.
- **Notificações:** vencimento de contas, contas baixas, metas atingidas, alertas de orçamento.

### 3.6 Recursos Familiares Extras
- **Metas Coletivas:** criação de objetivos, contribuições individuais, barra de progresso e comentários.
- **Divisão de Contas:** cálculo automático e geração de QR code para reembolsos.
- **Integrações:** Google Calendar (lembretes), WhatsApp/Telegram (compartilhar relatórios).
- **Monetização:** plano gratuito com anúncios + 5 GB; premium R$ 9,99/mês com IA avançada, armazenamento ilimitado, sem anúncios.

## 4. Wireframes (Descrição Textual)
### 4.1 Dashboard (Início)
- Cabeçalho com logotipo FamFin, seletor de período (default: mês atual) e saldo agregado.
- Cards horizontais: Receitas, Despesas, Economia, Orçamento vs Real.
- Gráfico de pizza "Gastos por Categoria" e gráfico de barras "Fluxo de Caixa".
- Seção de alertas e sugestões inteligentes.
- Botão flutuante "+" para adicionar transação/documento.

### 4.2 Transações
- Lista filtrável por período/categoria/membro, com ícone, descrição, data e valor.
- Ações rápidas: editar, duplicar, dividir conta, anexar documento.
- Tela "Nova Transação" com tabs Receita/Despesa, formulário completo (valor, data, categoria, membros, anexos, recorrência) e botões "Escanear Recibo" e "Importar NF-e/Extrato".

### 4.3 Família
- Lista de membros com avatar, papel (Administrador/Editor/Visualizador), status e contribuições recentes.
- Botão "Convidar" (WhatsApp/SMS/E-mail) e painel de permissões por módulo.

### 4.4 Relatórios
- Filtro por período e membros.
- Gráficos pizza/barras/linha para categorias, tendências e progresso de metas.
- Botões "Exportar PDF" e "Exportar Excel", opção de compartilhar via WhatsApp.

### 4.5 Configurações
- Seções: Conta, Família, Segurança, Notificações, Idioma, Tema, Integrações, Suporte.
- Alternância de tema claro/escuro e gerenciamento de assinatura premium.

## 5. Jornada do Usuário
1. **Onboarding:** escolha de idioma, tutorial de 3 telas.
2. **Cadastro/Login:** e-mail/senha + configuração de biometria.
3. **Criação da Família:** nome, renda mensal, convite a membros.
4. **Dashboard:** visão geral com saldo do período sugerido (1º ao último dia do mês).
5. **Transações:** adicionar manualmente ou via OCR/NF-e/extrato.
6. **Relatórios:** visualizar insights, exportar documentos, compartilhar.
7. **Configurações:** ajustar notificações, segurança, idioma, integrações.
8. **Extras:** metas, divisão de contas, modo offline.

## 6. Fluxogramas
```
[Login] --> [Dashboard] --> [Transações] --> [Relatórios]
    |                           |
    v                           v
 [Família]  <--------------> [Configurações]
```

```
[Onboarding/Login]
        ↓
 [Criação da Família]
        ↓
   [Dashboard]
   ↓     ↓     ↓
[Transações] [Família] [Relatórios]
        ↓          ↓          ↓
   [OCR / NF-e]   [Permissões] [Exportação PDF]
```

## 7. Backlog Inicial (MVP vs Premium)
| Prioridade | Entrega | Status |
| --- | --- | --- |
| MVP | Autenticação, onboarding, criação de família | Planejado |
| MVP | Dashboard com saldo, cards, gráfico pizza | Planejado |
| MVP | CRUD de transações manuais + modo offline | Planejado |
| MVP | Importação NF-e via chave de acesso | Planejado |
| MVP | OCR de recibos com ML Kit | Planejado |
| MVP | Relatórios básicos + exportação PDF | Planejado |
| Premium | IA avançada para categorização | Planejado |
| Premium | Planejamento financeiro com IBGE | Planejado |
| Premium | Armazenamento ilimitado | Planejado |
| Premium | Integração Open Banking completa | Planejado |

## 8. Métricas de Sucesso
- Taxa de ativação de famílias (>= 3 membros). 
- Percentual de transações categorizadas automaticamente (>70%).
- Aderência a orçamentos mensais (alertas de 80% respondidos).
- Retenção de 30 dias (>50%) entre contas premium.

## 9. Roadmap de Lançamento
1. **Sprints 1-2:** UI básica, autenticação, CRUD de transações, dashboard.
2. **Sprints 3-4:** OCR, importação NF-e/extrato, relatórios e exportação.
3. **Sprints 5-6:** Sugestões inteligentes, metas, divisão de contas, notificações.
4. **Beta Testing:** TestFlight e Google Play Beta, coleta de feedback.
5. **Lançamento Geral:** campanhas em mídia social, parcerias com influenciadores de finanças.
6. **Pós-Lançamento:** otimização de desempenho, novos idiomas, integrações adicionais.

## 10. Requisitos Não Funcionais
- **Performance:** suporte a dispositivos low-end (2 GB RAM), otimização de gráficos e processos offline.
- **Segurança:** armazenamento seguro de credenciais, políticas de retenção de dados, monitoramento de acessos.
- **Observabilidade:** logs centralizados, métricas de uso, alertas de erros via Crashlytics/Sentry.

## 11. Próximos Passos Recomendados
1. Definir stack final (Flutter vs React Native) e configurar repositório principal.
2. Criar maquetes de alta fidelidade no Figma com base nos wireframes descritos.
3. Configurar pipelines CI/CD (GitHub Actions) para build/teste automático.
4. Desenvolver MVP com foco em onboarding, dashboard e transações manuais.
5. Planejar integração progressiva com OCR, NF-e e Open Banking.
