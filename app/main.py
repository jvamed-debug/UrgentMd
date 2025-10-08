"""FastAPI entrypoint for the PubMedMedAI backend."""

from __future__ import annotations

from fastapi import Depends, FastAPI

from .config import Settings, get_settings
from .llm import EvidenceSummarizer
from .pubmed_client import PubMedClient
from .schemas import HealthResponse, QueryRequest, QueryResponse
from .services import QueryOrchestrator

app = FastAPI(title="PubMedMedAI")


def get_pubmed_client(settings: Settings = Depends(get_settings)) -> PubMedClient:
    return PubMedClient(api_key=settings.ncbi_api_key)


def get_summarizer(settings: Settings = Depends(get_settings)) -> EvidenceSummarizer:
    return EvidenceSummarizer(api_key=settings.openai_api_key, model=settings.openai_model)


def get_orchestrator(
    settings: Settings = Depends(get_settings),
    pubmed: PubMedClient = Depends(get_pubmed_client),
    summarizer: EvidenceSummarizer = Depends(get_summarizer),
) -> QueryOrchestrator:
    return QueryOrchestrator(pubmed=pubmed, summarizer=summarizer, settings=settings)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Simple health-check endpoint."""

    return HealthResponse(status="ok")


@app.post("/v1/query", response_model=QueryResponse)
def run_query(
    payload: QueryRequest, orchestrator: QueryOrchestrator = Depends(get_orchestrator)
) -> QueryResponse:
    """Executa a consulta estruturada ao PubMed e sintetiza as evidências."""

    return orchestrator.run(payload)
