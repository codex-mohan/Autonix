# Module for providing LLMs for the agent.
from typing import Literal, Optional, Union, Annotated, TypedDict
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI


class GoogleModels(TypedDict):
    model: str
    reasoning: bool

class LLMProvider(BaseModel):
    type: Literal["openai", "ollama", "google"] = "openai"
    model: Annotated[str,"Name of the model"]