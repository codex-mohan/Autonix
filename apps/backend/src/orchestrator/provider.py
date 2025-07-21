# Module for providing LLMs for the agent.
from typing import Literal, Optional, Union, Annotated, TypedDict, NamedTuple
from pydantic import BaseModel, Field


class BaseModelConfig(TypedDict):
    model: str
    reasoning: bool
    caching: bool
    modality: list[Literal["text", "image", "audio", "video"]]
    generation: list[Literal["text", "image", "audio", "video"]]
    agentic: bool


class GoogleModels(BaseModelConfig):
    pass


class OpenAIModels(BaseModelConfig):
    pass


GOOGLE_MODELS: dict[GoogleModels] = {
    "gemini-2.5-flash": {
        "model": "gemini-2.5-flash",
        "reasoning": True,
        "caching": True,
        "modality": ["text", "image", "audio", "video"],
        "generation": ["text"],
        "agentic": True,
    },
    "gemini-2.5-pro": {
        "model": "gemini-2.5-pro",
        "reasoning": True,
        "caching": True,
        "modality": ["text", "image", "audio", "video"],
        "generation": ["text"],
        "agentic": True,
    },
    "gemini-2.0-flash-image-generation": {
        "model": "gemini-2.0-flash-preview-image-generation",
        "reasoning": False,
        "caching": True,
        "modality": ["text", "image", "audio", "video"],
        "generation": ["text", "image"],
        "agentic": False,
    },
}

OPENAI_MODELS: dict[OpenAIModels] = {
    "gpt-4": {
        "model": "gpt-4.5-turbo",
        "reasoning": True,
        "caching": True,
        "modality": ["text", "image"],
        "generation": ["text"],
        "agentic": True,
    }
}

"""Dict for all the Supported LLMs."""
supported_models = {
    "openai": OPENAI_MODELS,
    "google": GOOGLE_MODELS,
}


"""Common LLM configuration."""


class LLMConfig(BaseModel):
    max_tokens: Annotated[int, "Maximum number of tokens to generate"]
    temperature: Annotated[float, Field(le=1, ge=0), "Temperature for the model"]
    top_p: Annotated[float, Field(le=1, ge=0), "Top p for the model"]
    top_k: Annotated[int, Field(le=5, ge=50), "Top k for the model"]
    frequency_penalty: Annotated[float, "Frequency penalty for the model"]
    presence_penalty: Annotated[float, "Presence penalty for the model"]
    enable_reasoning: Annotated[bool, "Enable reasoning for the model"]
    reasoning_effort: Annotated[
        Literal["low", "medium", "high"], "Reasoning effort for the model"
    ]
    max_retries: Annotated[int, "Maximum number of retries"] = 2
