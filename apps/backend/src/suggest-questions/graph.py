from typing import List, TypedDict

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langgraph.graph import StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI


class SuggestedQuestions(BaseModel):
    """A list of suggested questions."""

    questions: List[str] = Field(
        description="A list of suggested questions for the user to ask."
    )


class State(TypedDict):
    # The user's question
    question: str
    # The number of questions to generate
    num_questions: int
    # The list of suggested questions
    suggestions: SuggestedQuestions


def suggest_questions(state: State):
    """
    A node that suggests questions based on the user's question.
    """
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a helpful assistant that suggests follow-up questions.",
            ),
            (
                "human",
                "Given the user's question, suggest {num_questions} follow-up questions. "
                "User's question: {question}",
            ),
        ]
    )
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", temperature=0
    ).with_structured_output(SuggestedQuestions)
    chain = prompt | llm
    suggestions = chain.invoke(
        {"num_questions": state["num_questions"], "question": state["question"]}
    )
    return {"suggestions": suggestions}


builder = StateGraph(State)

builder.add_node("suggest_questions", suggest_questions)
builder.set_entry_point("suggest_questions")
builder.set_finish_point("suggest_questions")

graph = builder.compile()
