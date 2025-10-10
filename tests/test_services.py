"""Tests for the query orchestration layer."""

from __future__ import annotations

from dataclasses import dataclass

from app.config import Settings
from app.schemas import ArticleSummary, QueryRequest
from app.services import QueryOrchestrator


@dataclass
class _StubPubMedClient:
    pmids: list[str]
    summaries: list[ArticleSummary]

    def esearch(self, query: str, retmax: int = 20):  # pragma: no cover - trivial
        return self.pmids

    def esummary(self, pmids):  # pragma: no cover - trivial
        return self.summaries


@dataclass
class _StubSummarizer:
    text: str

    def summarize(self, question, articles):  # pragma: no cover - trivial
        return self.text


def test_orchestrator_triggers_staff_link_when_requested():
    orchestrator = QueryOrchestrator(
        pubmed=_StubPubMedClient(pmids=["1"], summaries=[]),
        summarizer=_StubSummarizer(text="ok"),
        settings=Settings(
            ncbi_api_key=None,
            openai_api_key=None,
            openai_model="gpt-4o-mini",
            staff_whatsapp_link="https://wa.me/5512988940100",
        ),
    )
    response = orchestrator.run(
        QueryRequest(question="Paciente instável no pronto-socorro", needs_staff_review=True)
    )
    assert response.staff_contact == "https://wa.me/5512988940100"


def test_orchestrator_builds_citations_list():
    articles = [
        ArticleSummary(pmid="123", title="A", authors=[], publication_year=None),
        ArticleSummary(pmid="456", title="B", authors=[], publication_year=None),
    ]
    orchestrator = QueryOrchestrator(
        pubmed=_StubPubMedClient(pmids=[a.pmid for a in articles], summaries=articles),
        summarizer=_StubSummarizer(text="Resumo"),
        settings=Settings(
            ncbi_api_key=None,
            openai_api_key=None,
            openai_model="gpt-4o-mini",
            staff_whatsapp_link="https://wa.me/5512988940100",
        ),
    )
    response = orchestrator.run(QueryRequest(question="asthma"))
    assert response.citations == ["PMID:123", "PMID:456"]


def test_orchestrator_escalates_for_shift_lead_keyword():
    orchestrator = QueryOrchestrator(
        pubmed=_StubPubMedClient(pmids=[], summaries=[]),
        summarizer=_StubSummarizer(text=""),
        settings=Settings(
            ncbi_api_key=None,
            openai_api_key=None,
            openai_model="gpt-4o-mini",
            staff_whatsapp_link="https://wa.me/5512988940100",
        ),
    )
    response = orchestrator.run(QueryRequest(question="Chefe de plantão foi acionado"))
    assert response.staff_contact == "https://wa.me/5512988940100"
