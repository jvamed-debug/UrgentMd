"""Pydantic models shared across the service."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ArticleSummary(BaseModel):
    """Metadata extracted from PubMed."""

    pmid: str = Field(..., description="Identificador PubMed")
    title: str | None = Field(default=None, description="Título do artigo")
    authors: list[str] = Field(default_factory=list, description="Lista de autores")
    publication_year: int | None = Field(
        default=None, description="Ano de publicação"
    )
    journal: str | None = Field(default=None, description="Periódico")
    abstract: str | None = Field(default=None, description="Resumo disponível")
    metadata: dict[str, Any] = Field(default_factory=dict, description="Dados crus")


class QueryRequest(BaseModel):
    """Entrada enviada pelo aplicativo móvel."""

    question: str = Field(..., description="Pergunta clínica do profissional")
    filters: dict[str, Any] | None = Field(
        default=None, description="Filtros opcionais (faixa etária, data, etc.)"
    )
    retmax: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Quantidade máxima de artigos a recuperar",
    )
    needs_staff_review: bool = Field(
        default=False,
        description="Indica se o usuário requer suporte imediato da equipe sênior",
    )


class QueryResponse(BaseModel):
    """Resposta retornada ao cliente."""

    answer: str
    citations: list[str]
    articles: list[ArticleSummary]
    staff_contact: str | None = Field(
        default=None,
        description="Link direto para contato com o staff em casos escalados",
    )


class HealthResponse(BaseModel):
    """Estrutura simples para o endpoint de saúde do serviço."""

    status: str
