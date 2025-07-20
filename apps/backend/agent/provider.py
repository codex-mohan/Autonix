# Module for providing LLMs for the agent.
from typing import Literal, Optional, Union, Annotated, TypedDict, NamedTuple
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()


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


class LLMProvider(BaseModel):
    provider: Literal["openai", "ollama", "google"] = "google"
    model: Annotated[Union[str, GoogleModels, OpenAIModels], "Name of the model"]
    config: Annotated[LLMConfig, "Common configuration for the models"]

    def __init__(self):
        super().__init__()

        self.max_tokens = self.config.max_tokens
        self.top_k = self.config.top_k
        self.top_p = self.config.top_p
        self.temperature = self.config.temperature
        self.max_retries = self.config.max_retries

        if self.model["reasoning"] and self.config["enable_reasoning"]:
            self.reasoning = True
            self.reasoning_effort = self.config.reasoning_effort
        else:
            self.reasoning = False
            self.reasoning_effort = None

        # Get the llms configs for string inputs
        if isinstance(self.model, str):
            if self.provider == "openai":
                self.model = OPENAI_MODELS[self.model]

                return ChatOpenAI(
                    model=self.model["model"],
                    temperature=self.temperature,
                    top_p=self.top_p,
                    top_logprobs=self.top_k,
                    max_tokens=self.max_tokens,
                    reasoning_effort=self.reasoning_effort,
                    max_retries=self.max_retries,
                )
            elif self.provider == "google":
                self.model = GOOGLE_MODELS[self.model]

                return ChatGoogleGenerativeAI(
                    model=self.model["model"],
                    temperature=self.temperature,
                    top_p=self.top_p,
                    top_k=self.top_k,
                    max_tokens=self.max_tokens,
                    reasoning_effort=self.reasoning_effort,
                    max_retries=self.max_retries,
                )
            elif self.provider == "ollama":
                self.model = GOOGLE_MODELS[self.model]

                return ChatOllama(
                    model=self.model["model"],
                    temperature=self.temperature,
                    top_p=self.top_p,
                    top_k=self.top_k,
                    max_tokens=self.max_tokens,
                    reasoning_effort=self.reasoning_effort,
                )
