# PubMedMedAI – Plano de Implementação

## Visão Geral
PubMedMedAI é um assistente de IA para apoio médico destinado a profissionais de saúde, fornecendo respostas sintetizadas com base em evidências científicas oriundas do PubMed. O sistema integra buscas estruturadas usando a API E-Utilities do NCBI e modelos de linguagem de grande porte (LLMs) para refinar consultas e gerar resumos, mantendo conformidade com regulamentações e ressaltando limites éticos e clínicos.

## Objetivos Principais
1. **Disponibilizar evidências atualizadas** de forma rápida para médicos, enfermeiros e pesquisadores.
2. **Respeitar o julgamento clínico humano**, adicionando disclaimers sobre limites do sistema.
3. **Garantir conformidade** com padrões de segurança (HIPAA ou equivalentes) e boas práticas de privacidade.
4. **Oferecer experiência móvel** fluida em iOS e Android.

## Arquitetura Geral
A solução é composta por três camadas:

### 1. Frontend (App Móvel)
- **Tecnologias sugeridas**: Flutter ou React Native para entregar interfaces nativas em iOS e Android.
- **Principais componentes**:
  - Tela de login com OAuth 2.0 / OpenID Connect.
  - Tela de consulta em linguagem natural.
  - Histórico de buscas com sincronização opcional.
  - Exibição de resultados com resumos, citações e links para artigos.
  - Exportação para PDF e compartilhamento seguro por e-mail.
- **Considerações de UX**:
  - Indicar claramente que a resposta não substitui avaliação clínica.
  - Oferecer filtros rápidos (data, tipo de estudo, faixa etária).
  - Fornecer modo offline limitado (exibição de histórico armazenado localmente).

### 2. Backend (Serviços e Integrações)
- **Framework sugerido**: FastAPI (Python 3.13+) por oferecer desempenho e tipagem forte.
- **Principais serviços**:
  1. **Serviço de autenticação**: Integra-se a provedor OAuth externo (hospital, Microsoft Entra ID, etc.).
  2. **Serviço de orquestração de consultas**:
     - Recebe consulta em linguagem natural do app.
     - Solicita ao LLM o refinamento de termos MeSH e filtros de pesquisa.
     - Faz chamadas sequenciais à API E-Utilities (ESearch → ESummary → EFetch) respeitando limites de taxa.
     - Armazena logs e cache em banco relacional (PostgreSQL recomendado) ou Redis para resultados recentes.
  3. **Serviço de síntese de evidências**:
     - Envia abstracts e metadados ao LLM da OpenAI (por exemplo, GPT-4 Turbo) para sumarização.
     - Aplica pós-processamento para incluir citações com PMID/DOI e destacar recomendações de nível de evidência.
  4. **Serviço de conformidade e auditoria**:
     - Registra ações relevantes (quem pesquisou, quando, com qual finalidade).
     - Permite exportação de logs conforme normas internas.
- **Segurança**:
  - Tráfego somente via HTTPS/TLS.
  - Criptografia em repouso (por exemplo, AWS KMS ou Azure Key Vault) para dados sensíveis.
  - Limpeza de PHI (Protected Health Information) antes de enviar dados ao LLM.
  - Política de retenção: descartar dados de pacientes após uso imediato.

### 3. Integrações Externas
- **PubMed E-Utilities**: Uso de ESearch, ESummary e EFetch. Respeitar limite de 3 req/s sem chave ou até 10 req/s com chave obtida no NCBI.
- **LLM OpenAI**: Utilizar a API da OpenAI (por exemplo, `gpt-4o` ou modelos clínicos especializados disponíveis) para refinamento de consultas e sumarização. Configurar contextos com instruções fixas (system prompts) enfatizando evidências e disclaimers.
- **Serviços de Monitoramento**: Stack de logs (ELK, Grafana + Loki) e alertas para falhas ou latência elevada.

## Fluxo de Funcionamento
1. **Entrada de consulta**: Profissional envia pergunta em linguagem natural via app.
2. **Refinamento de termos**: Backend chama o LLM para sugerir termos MeSH e filtros.
3. **Busca estruturada**: Serviço consulta ESearch para PMIDs relevantes, seguido de ESummary/EFetch para metadados e abstracts.
 4. **Síntese**: LLM gera resumo com pontos-chave, nível de evidência, recomendações e citações numeradas.
 5. **Resposta ao app**: JSON contendo texto sintetizado, lista de artigos, links e metadados.
 6. **Feedback e iteração**: Usuário pode refinar consulta, favoritar resultados e exportar.
  7. **Escalonamento imediato quando necessário**: Sempre que a consulta indicar necessidade de apoio da equipe sênior (staff), o backend aciona o módulo de comunicação para enviar ao usuário o link direto de WhatsApp correspondente ao número institucional **+55 12 98894-0100**, facilitando o contato síncrono.

## Fluxograma Simplificado
```
[Usuário no App]
      │
      ▼
[Backend Recebe Consulta]
      │
      ├─► [LLM Refinamento de Termos]
      │
      ├─► [ESearch → ESummary → EFetch]
      │
      ├─► [LLM Síntese + Citações]
      │
      └─► [Retorno ao App + Logs]
```

## Modelagem de Dados (Simplificada)
- **Tabela `users`**: id, nome, email profissional, perfil, timestamps.
- **Tabela `queries`**: id, user_id, texto original, filtros aplicados, timestamp.
- **Tabela `results`**: id, query_id, resposta sintetizada, lista de PMIDs, data de expiração do cache.
- **Tabela `audit_logs`**: id, user_id, ação, metadados, timestamp.

## Exemplos de Código

### 1. Cliente PubMed (Python)
```python
import os
from typing import List
import requests

NCBI_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
API_KEY = os.getenv("NCBI_API_KEY")

def esearch(query: str, retmax: int = 20) -> List[str]:
    params = {
        "db": "pubmed",
        "term": query,
        "retmode": "json",
        "retmax": retmax,
    }
    if API_KEY:
        params["api_key"] = API_KEY
    resp = requests.get(f"{NCBI_BASE}esearch.fcgi", params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data["esearchresult"].get("idlist", [])
```

**Descrição**: Este módulo encapsula a chamada `ESearch` da API E-Utilities. Ele lê a chave do NCBI por variável de ambiente (qu
ando configurada) para ampliar o limite de requisições, compõe o dicionário de parâmetros exigido pelo PubMed (banco de dados,
 formato, quantidade de itens) e executa uma requisição HTTP `GET` com timeout definido. Após validar o status HTTP, o payload 
JSON é convertido para Python e a função retorna somente a lista de PMIDs, preparando dados para os estágios subsequentes do flu
xo.

### 2. Endpoint FastAPI
```python
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI(title="PubMedMedAI")

class QueryRequest(BaseModel):
    question: str
    filters: dict | None = None

class QueryResponse(BaseModel):
    answer: str
    citations: list[str]
    articles: list[dict]

def authenticate_user():
    # Placeholder para integração OAuth
    return {"user_id": "demo"}

@app.post("/v1/query", response_model=QueryResponse)
def run_query(payload: QueryRequest, user=Depends(authenticate_user)):
    # 1. Refinar termos via LLM (não implementado aqui)
    # 2. Buscar no PubMed
    pmids = esearch(payload.question)
    # 3. Obter metadados e resumir (mock)
    return QueryResponse(
        answer="Resumo gerado pela IA (placeholder).",
        citations=[f"PMID:{pmid}" for pmid in pmids],
        articles=[{"pmid": pmid} for pmid in pmids],
    )
```

**Descrição**: O endpoint `/v1/query` serve como porta de entrada REST para o app móvel. FastAPI inicializa o serviço, enquanto os modelos `BaseModel` (`QueryRequest` e `QueryResponse`) definem o esquema de entrada e saída. A função `authenticate_user` atua como _placeholder_ para a integração OAuth e é injetada com `Depends`. Ao receber uma requisição, o backend (ainda sem o refinamento real por LLM) chama `esearch` para obter PMIDs, monta o texto resumido fictício e devolve citações e metadados correspondentes, ilustrando o formato esperado da resposta JSON.

### 3. Prompt Base para o LLM da OpenAI
```
Você é um assistente para profissionais de saúde. Use apenas informações confirmadas por artigos do PubMed fornecidos. Para cada resposta:
- Liste recomendações com nível de evidência quando disponível.
- Cite sempre os PMIDs correspondentes.
- Inclua um aviso: "Esta resposta não substitui o julgamento clínico."
- Se não houver evidência suficiente, informe claramente.
```

**Descrição**: O _prompt_ define a postura do LLM da OpenAI: responder somente com evidências comprovadas, citar PMIDs em cada orientação e manter o aviso clínico obrigatório. Também instrui o modelo a registrar lacunas de evidência, garantindo transparência com o usuário.

### 4. Estrutura do Backend de Referência

Para acelerar a implementação, o repositório inclui um backend funcional em `app/` organizado da seguinte forma:

```
app/
├── config.py          # Carrega variáveis de ambiente (chaves do NCBI/OpenAI e link do staff)
├── llm.py             # Summarizer baseado na API da OpenAI com fallback offline
├── main.py            # Entrypoint FastAPI com endpoints `/health` e `/v1/query`
├── pubmed_client.py   # Cliente para ESearch/ESummary com tratamento de timeouts
├── schemas.py         # Modelos Pydantic compartilhados entre camadas
└── services.py        # Orquestra consultas, síntese e escalonamento para o WhatsApp
```

Os testes unitários em `tests/` demonstram como mockar o PubMed e validar o acionamento do link de WhatsApp (`https://wa.me/5512988940100`) quando `needs_staff_review` é verdadeiro ou quando a pergunta contém termos de emergência. Execute `pytest` após instalar as dependências para garantir que a infraestrutura esteja funcionando.

## Considerações de Conformidade e Ética
- **Disclaimers obrigatórios** em todas as telas e respostas.
- **Gestão de consentimento** para armazenamento de dados de uso.
- **Treinamento de usuários** sobre limitações da IA.
- **Monitoramento contínuo** da qualidade das respostas e revisão por comitê clínico.
- **Procedimento de escalonamento** documentado, garantindo que o link de WhatsApp (+55 12 98894-0100) seja exibido ou enviado automaticamente quando a solicitação exigir suporte do staff.

## Roadmap de Implementação
1. **Fase 1 – MVP**
   - Autenticação básica, consultas simples, integração ESearch + OpenAI para resumo curto.
   - Logging essencial e dashboard mínimo.
2. **Fase 2 – Expansão**
   - Filtros avançados (tipo de estudo, faixa etária, idioma).
   - Cache e armazenamento de histórico.
   - Exportação de relatórios em PDF.
3. **Fase 3 – Conformidade Completa**
   - Auditoria detalhada, conformidade HIPAA, integrações EMR (FHIR/HL7).
   - Avaliações de segurança e testes clínicos piloto.

## Métricas de Sucesso
- Tempo médio de resposta < 5s.
- Satisfação dos usuários (>85% em NPS interno).
- Cobertura de artigos atualizados (filtragem por últimos 5 anos quando pertinente).
- Zero incidentes de violação de dados ou uso indevido.

## Próximos Passos

### Sprint 0 (Planejamento e Preparação)
1. **Formar o squad multidisciplinar**
   - Responsáveis: liderança médica, TI hospitalar.
   - Entregáveis: matriz RACI, canais de comunicação e calendário de rituais.
2. **Mapear requisitos regulatórios**
   - Levantar políticas internas (LGPD, HIPAA equivalente) e restrições de uso de IA.
   - Definir quais dados podem ou não sair do ambiente hospitalar antes de envolver o LLM.
3. **Provisionar ambiente de desenvolvimento seguro**
   - Configurar repositório Git privado, pipelines de CI/CD e gestão de segredos (por exemplo, HashiCorp Vault).
   - Criar variáveis de ambiente para chaves do NCBI e da API da OpenAI.

### Sprint 1 (Protótipo Técnico)
1. **Implementar esqueleto do backend**
   - Criar projeto FastAPI com endpoints `/health` e `/v1/query`.
   - Adicionar autenticação simulada (mock) e testes automatizados básicos.
2. **Conectar ao PubMed**
   - Desenvolver módulo de cliente para ESearch/ESummary com tratamento de erros e limites de taxa.
   - Registrar logs estruturados com PMIDs retornados.
3. **Integrar LLM de teste**
   - Usar chave de sandbox (quando disponível) para validar prompt base e formato de resposta.
   - Incluir placeholder de citação e aviso clínico no payload de retorno.

### Sprint 2 (Validação com Usuários)
1. **Testes de usabilidade com 3–5 profissionais** para validar jornada no app (wireframes ou protótipo navegável).
2. **Revisão clínica das respostas**: comparar saídas do protótipo com guidelines vigentes e ajustar prompts.
3. **Planejar integração com sistemas hospitalares**: definir APIs FHIR/HL7 necessárias e segurança de rede.

> **Dica rápida**: após cada sprint, conduza retrospectiva com foco em riscos clínicos identificados e ajustes de conformidade.

---
**Aviso**: PubMedMedAI destina-se a profissionais habilitados. As respostas oferecidas não substituem diagnóstico, tratamento ou acompanhamento médico. Sempre consulte protocolos institucionais e utilize julgamento clínico especializado.
