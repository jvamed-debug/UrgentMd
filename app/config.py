"""Application configuration helpers."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(slots=True)
class Settings:
    """Holds configuration values loaded from the environment."""

    ncbi_api_key: str | None
    openai_api_key: str | None
    openai_model: str
    staff_whatsapp_link: str


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached settings sourced from environment variables."""

    return Settings(
        ncbi_api_key=os.getenv("NCBI_API_KEY"),
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        openai_model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        staff_whatsapp_link=os.getenv(
            "STAFF_WHATSAPP_LINK", "https://wa.me/5512988940100"
        ),
    )
