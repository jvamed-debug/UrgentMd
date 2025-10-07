"""LLM-powered evidence synthesis utilities."""

from __future__ import annotations

from typing import Iterable

from openai import OpenAI

from .schemas import ArticleSummary


class EvidenceSummarizer:
    """Generate evidence summaries leveraging OpenAI models."""

    def __init__(self, api_key: str | None, model: str = "gpt-4o-mini") -> None:
        self.api_key = api_key
        self.model = model

    def summarize(self, question: str, articles: Iterable[ArticleSummary]) -> str:
        """Return a textual synthesis of the provided articles."""

        articles_list = list(articles)
        if not articles_list:
            return (
                "Não encontramos artigos relevantes para esta consulta. "
                "Considere ajustar filtros ou tentar termos alternativos.\n\n"
                "Esta resposta não substitui o julgamento clínico."
            )

        if not self.api_key:
            bullet_points = "\n".join(
                f"- PMID {item.pmid}: {item.title or 'Título não disponível'}"
                for item in articles_list[:5]
            )
            return (
                "Resumo automatizado em modo offline (sem chave da OpenAI disponível):\n"
                f"{bullet_points}\n\n"
                "Esta resposta não substitui o julgamento clínico."
            )

        client = OpenAI(api_key=self.api_key)
        context_blocks = []
        for article in articles_list[:10]:
            context_blocks.append(
                f"PMID {article.pmid}\n"
                f"Título: {article.title or 'N/D'}\n"
                f"Autores: {', '.join(article.authors) or 'N/D'}\n"
                f"Resumo: {article.abstract or 'Resumo não disponível'}"
            )
        context = "\n\n".join(context_blocks)

        response = client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": (
                        "Você é um assistente que responde somente com base em artigos do PubMed fornecidos. "
                        "Cite sempre os PMIDs utilizados, liste o nível de evidência quando disponível "
                        "e encerre com o aviso: 'Esta resposta não substitui o julgamento clínico.'"
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Pergunta clínica: {question}\n\n"
                        f"Artigos relevantes:\n{context}\n\n"
                        "Elabore um resumo objetivo com recomendações práticas."
                    ),
                },
            ],
            max_output_tokens=600,
            temperature=0.2,
        )
        return response.output_text.strip()
