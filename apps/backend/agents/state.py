from __future__ import annotations

from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages


class MainState(TypedDict):
    session_id: str
    conversation_id: str
    state_graph: Annotated[StateGraph, START, END]
    messages: Annotated[list, add_messages]
