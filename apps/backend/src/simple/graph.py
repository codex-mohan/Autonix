from dataclasses import dataclass
from typing import Annotated

from langchain.chat_models import init_chat_model
from typing_extensions import TypedDict

from langchain_core.messages import AnyMessage

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer
from langgraph.graph.state import RunnableConfig

CONNECTION_STRING = "postgresql+asyncpg://postgres:mypasswd@localhost:5432/postgres"
serde = JsonPlusSerializer(pickle_fallback=True)

postgres_checkpointer = PostgresSaver.from_conn_string(CONNECTION_STRING)


class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]


@dataclass
class config:
    thread_id: Annotated[str, "The ID of the thread"]


graph_builder = StateGraph(State)


llm = init_chat_model("google_genai:gemini-2.5-flash")


def chatbot(state: State, config: RunnableConfig):
    print("chatbot called")
    # print(f"state: {state}")
    print(f"config: {config}")

    return {"messages": [llm.invoke(state["messages"])]}


# The first argument is the unique node name
# The second argument is the function or object that will be called whenever
# the node is used.
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile(checkpointer=postgres_checkpointer)
