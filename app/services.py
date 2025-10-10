"""Core orchestration logic for queries."""

from __future__ import annotations

from dataclasses import dataclass

from .config import Settings
from .llm import EvidenceSummarizer
from .pubmed_client import PubMedClient
from .schemas import ArticleSummary, QueryRequest, QueryResponse

STAFF_KEYWORDS = {
    "parada",
    "instável",
    "emergência",
    "choque",
    "intubação",
    "chefe de plantão",
    "chefe de plantao",
}


@dataclass(slots=True)
class QueryOrchestrator:
    """Coordinate PubMed queries and LLM summarization."""

    pubmed: PubMedClient
    summarizer: EvidenceSummarizer
    settings: Settings

    def run(self, request: QueryRequest) -> QueryResponse:
        pmids = self.pubmed.esearch(request.question, retmax=request.retmax)
        summaries = self.pubmed.esummary(pmids)
        answer = self.summarizer.summarize(request.question, summaries)
        citations = [f"PMID:{article.pmid}" for article in summaries]
        staff_contact = (
            self.settings.staff_whatsapp_link
            if self._needs_escalation(request, summaries)
            else None
        )
        return QueryResponse(
            answer=answer,
            citations=citations,
            articles=summaries,
            staff_contact=staff_contact,
        )

    def _needs_escalation(
        self, request: QueryRequest, summaries: list[ArticleSummary]
    ) -> bool:
        if request.needs_staff_review:
            return True
        question = request.question.lower()
        if any(keyword in question for keyword in STAFF_KEYWORDS):
            return True
        return False
