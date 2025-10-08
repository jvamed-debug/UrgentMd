"""Unit tests for the PubMed client module."""

from __future__ import annotations

from typing import Any

from app.pubmed_client import PubMedClient


class _MockResponse:
    def __init__(self, json_data: dict[str, Any]):
        self._json_data = json_data

    def raise_for_status(self) -> None:  # pragma: no cover - placeholder
        return None

    def json(self) -> dict[str, Any]:
        return self._json_data


class _MockSession:
    def __init__(self) -> None:
        self.last_request: dict[str, Any] | None = None

    def get(self, url: str, params: dict[str, Any], timeout: int):
        self.last_request = {"url": url, "params": params, "timeout": timeout}
        if url.endswith("esearch.fcgi"):
            return _MockResponse({"esearchresult": {"idlist": ["123", "456"]}})
        return _MockResponse(
            {
                "result": {
                    "uids": ["123"],
                    "123": {
                        "title": "Sample article",
                        "authors": [{"name": "Doe J"}],
                        "pubdate": "2023",
                        "fulljournalname": "Journal",
                    },
                }
            }
        )


def test_esearch_builds_expected_params():
    session = _MockSession()
    client = PubMedClient(api_key="abc", session=session)
    pmids = client.esearch("asthma", retmax=5)
    assert pmids == ["123", "456"]
    assert session.last_request == {
        "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
        "params": {
            "db": "pubmed",
            "term": "asthma",
            "retmode": "json",
            "retmax": 5,
            "api_key": "abc",
        },
        "timeout": 30,
    }


def test_esummary_returns_article_summary():
    session = _MockSession()
    client = PubMedClient(session=session)
    summaries = client.esummary(["123"])
    assert len(summaries) == 1
    summary = summaries[0]
    assert summary.pmid == "123"
    assert summary.title == "Sample article"
    assert summary.authors == ["Doe J"]
    assert summary.publication_year == 2023
