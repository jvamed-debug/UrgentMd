"""Client responsible for interacting with the PubMed E-Utilities API."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

import requests

from .schemas import ArticleSummary


@dataclass(slots=True)
class PubMedClient:
    """Wraps access to PubMed search endpoints."""

    api_key: str | None = None
    session: requests.Session | None = None
    base_url: str = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

    def _get_session(self) -> requests.Session:
        return self.session or requests.Session()

    def esearch(self, query: str, retmax: int = 20) -> list[str]:
        """Return a list of PMIDs for the provided query."""

        params = {
            "db": "pubmed",
            "term": query,
            "retmode": "json",
            "retmax": retmax,
        }
        if self.api_key:
            params["api_key"] = self.api_key

        response = self._get_session().get(
            f"{self.base_url}esearch.fcgi", params=params, timeout=30
        )
        response.raise_for_status()
        payload = response.json()
        return payload.get("esearchresult", {}).get("idlist", [])

    def esummary(self, pmids: Sequence[str]) -> list[ArticleSummary]:
        """Fetch metadata summaries for a batch of PMIDs."""

        ids = [pmid for pmid in pmids if pmid]
        if not ids:
            return []

        params = {
            "db": "pubmed",
            "retmode": "json",
            "id": ",".join(ids),
        }
        if self.api_key:
            params["api_key"] = self.api_key

        response = self._get_session().get(
            f"{self.base_url}esummary.fcgi", params=params, timeout=30
        )
        response.raise_for_status()
        payload = response.json()
        result = payload.get("result", {})
        summaries: list[ArticleSummary] = []
        for pmid in result.get("uids", []):
            raw: dict[str, Any] = result.get(pmid, {})
            authors = [author.get("name") for author in raw.get("authors", [])]
            summary = ArticleSummary(
                pmid=pmid,
                title=raw.get("title"),
                authors=[name for name in authors if name],
                publication_year=_safe_int(raw.get("pubdate")),
                journal=raw.get("fulljournalname"),
                abstract=raw.get("sortfirstauthor") or raw.get("elocationid"),
                metadata=raw,
            )
            summaries.append(summary)
        return summaries


def _safe_int(value: Any) -> int | None:
    """Attempt to extract an integer year from various PubMed values."""

    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        digits = value.strip().split(" ")[0]
        if digits.isdigit():
            return int(digits)
    return None
