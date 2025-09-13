from dataclasses import dataclass
from typing import Annotated

from langchain.chat_models import init_chat_model
from langchain_community.tools import ShellTool, ReadFileTool, WriteFileTool
from langchain_core.messages import AnyMessage, ToolMessage
from typing_extensions import TypedDict

from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.graph.state import RunnableConfig
from langgraph.prebuilt import ToolNode

CONNECTION_STRING = "postgresql+asyncpg://postgres:mypasswd@localhost:5432/postgres"
serde = JsonPlusSerializer(pickle_fallback=True)

postgres_checkpointer = PostgresSaver.from_conn_string(CONNECTION_STRING)

tools = [ShellTool(), ReadFileTool(), WriteFileTool()]

write_file_tool = WriteFileTool(
    name="write_file",
    description="""Write a file, By default the root dir path is the current working directory. always properly mention the root path properly. for example: if you want to use the user home dir, override the root dir with "/" """,
)


class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]


@dataclass
class config:
    thread_id: Annotated[str, "The ID of the thread"]


graph_builder = StateGraph(State)

llm = init_chat_model(
    "google_genai:gemini-2.5-flash",
    configurable_fields="any",
    include_thoughts=True,
    max_retries=3,
    n=1,  # Only one completion per request
)
llm_with_tools = llm.bind_tools(tools)


async def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}


graph_builder.add_node("chatbot", chatbot)
tool_node = ToolNode(tools)
graph_builder.add_node("tools", tool_node)


def should_continue(state: State) -> str:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return "end"


graph_builder.add_conditional_edges(
    "chatbot",
    should_continue,
    {"tools": "tools", "end": "__end__"},
)

graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("tools", "chatbot")
graph = graph_builder.compile(checkpointer=postgres_checkpointer)
