from langgraph.graph import StateGraph, START, END
from langchain_core.messages import AIMessage, HumanMessage, ChatMessage
from langchain_core.runnables import RunnableConfig

from .provider import LLMProvider
from .state import MainState

"""The main Agent Node that controls the graph."""


def orchestrator(state: MainState, config: RunnableConfig):

    llm = LLMProvider(model=state["main_llm"], provider=state["provider"])
    llm.invoke(state["messages"])


def finalizer(state: MainState, config: RunnableConfig):
    pass


builder = StateGraph()
builder.add_node("orchestrator", orchestrator)
builder.add_node("finalizer", finalizer)


builder.add_edge(START, "orchestrator")
builder.add_edge("orchestrator", "finalizer")
builder.add_edge("finalizer", END)

graph = builder.compile()
