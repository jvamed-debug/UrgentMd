# UrgentMd
Assistente de apoio à decisão clínica para médicos em Emergência e UTI, fornecendo hipóteses diagnósticas, exames de confirmação e opções terapêuticas baseadas em diretrizes, sem substituir o julgamento clínico e com escalonamento para staff quando necessário. Sempre que houver necessidade de envolvimento da equipe sênior, o app deve enviar o link de WhatsApp associado ao número **+55 12 98894-0100** para facilitar o contato imediato.

## Backend de Referência (FastAPI)

O diretório `app/` contém uma implementação inicial do backend responsável por consultar o PubMed e sintetizar evidências com modelos da OpenAI. Para executar localmente (utilizando **Python 3.13**):

1. Crie um ambiente virtual e instale dependências:
   ```bash
   python3.13 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure as variáveis de ambiente necessárias:
   ```bash
   export NCBI_API_KEY="sua-chave-opcional-do-ncbi"
   export OPENAI_API_KEY="sua-chave-da-openai"
   export OPENAI_MODEL="gpt-4o-mini"  # opcional
   ```
3. Inicie o servidor FastAPI:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Realize consultas enviando `POST /v1/query` com um corpo JSON como o exemplo abaixo:
   ```json
   {
     "question": "Tratamento atual para asma moderada em adultos?",
     "filters": {"years": 5},
     "needs_staff_review": false
   }
   ```

Se a chave da OpenAI não estiver configurada, o serviço funcionará em modo offline e retornará apenas um resumo básico a partir das referências recuperadas.

## Testes Automatizados

Os testes unitários cobrem a integração com o PubMed (mockada) e a orquestração de consultas. Execute-os com:

```bash
pytest
```

## Plano PubMedMedAI
Para o módulo de buscas científicas integradas ao PubMed, consulte o documento [`docs/PubMedMedAI.md`](docs/PubMedMedAI.md), que detalha a arquitetura da solução, fluxos de trabalho, integrações com a API E-Utilities do NCBI, uso de LLMs para síntese de evidências e considerações de conformidade.
