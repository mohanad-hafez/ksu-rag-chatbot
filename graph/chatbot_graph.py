from langchain.chat_models import init_chat_model
from langchain_core.messages import SystemMessage
from langgraph.graph import MessagesState, StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.tools import tool
import os

from db.vectorstore import vector_store
from loaders.document_loader import load_all_documents
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
llm = init_chat_model("gpt-4.1", model_provider="openai")

@tool(response_format="content_and_artifact")
def retrieve(query: str):
    """
    Retrieve relevant academic information from the vector store based on a user query.
    """
    docs = vector_store.similarity_search(query, k=3)
    serialized = "\n\n".join(f"Content: {doc.page_content}" for doc in docs)
    return serialized, docs

def query_or_respond(state: MessagesState):
    return {"messages": [llm.bind_tools([retrieve]).invoke(state["messages"])]}

def generate(state: MessagesState):
    tool_messages = [m for m in state["messages"] if m.type == "tool"]
    docs_content = "\n\n".join(m.content for m in tool_messages)

    # system_prompt = (
    #     "You are a helpful and knowledgeable assistant for students at King Saud University. "
    #     "Use the retrieved information below to answer questions about academic procedures, course registration, university services, and related topics. "
    #     "Provide clear and accurate answers based on the context. If the answer isn't found, guide the student politely on what to do next or where to look. "
    #     "Be concise, but feel free to elaborate if the question requires it.\n\n"
    #     f"{docs_content}"
    # )
    system_prompt = (
    "Your name is Dalil. You are a helpful and knowledgeable assistant for students at King Saud University. "
    "All the questions you receive are going to be from King Saud University students, or people who want to get into King Saud University. "
    "Use the retrieved information below to answer questions about academic procedures, course registration, university services, and related topics. "
    "Be concise, but feel free to elaborate if the question requires it. Make sure the user gets all the information they need. "
    "If the user asks a question that is not related to the university, just say you don't know. "
    "You can also ask follow-up questions to get more information from the user if needed, after you answer their question. "
    "Provide clear and accurate answers based on the context. If the answer isn't found, just say you don't know. "
    "YOU SHOULD NEVER MAKE UP AN ANSWER — only respond based on the context provided.\n\n"

    "If the answer is not found in the context, or if the user needs help in person, you can direct them to the Deanship of Admission and Registration if it's relevant.\n"
    "Website: https://dar.ksu.edu.sa/ar\n"
    "For male students: Building 66. For female students: Gate 3, Building 22.\n\n"

    "The Deanship includes the following sections:\n"
    "- وكالة العمادة للشؤون الأكاديمية (Academic Affairs):\n"
    "  • قسم التسجيل (Registration Department)\n"
    "  • قسم التوثيق (Documentation Department)\n"
    "  • قسم الدعم والمساندة (Support Department)\n"
    "- وكالة العمادة لشؤون القبول (Admission Affairs):\n"
    "  • قسم القبول (Admission Department)\n"
    "  • وحدة قبول طلاب المنح (Scholarship Admission Unit)\n"
    "  • قسم المكافآت (Student Allowances Department)\n"
    "- وكالة العمادة لشؤون السنة الأولى المشتركة (First Year Affairs):\n"
    "  • قسم شؤون السنة الأولى المشتركة (Common First Year Department)\n"
    "- وكالة العمادة للتطوير وتقنية المعلومات (Development & IT):\n"
    "  • قسم الأنظمة والخدمات الإلكترونية (Systems & eServices)\n"
    "  • قسم شؤون الخريجين وخدمات الطلاب (Graduates & Student Services)\n"
    "  • وحدة التطوير والجودة (Development & Quality Unit)\n"
    "  • وحدة الإحصاء والمعلومات (Statistics & Information Unit)\n"
    "- وحدة العلاقات العامة والإعلام (Public Relations & Media)\n"
    "- وكالة العمادة بفرع الطالبات (Female Branch Affairs):\n"
    "  • Includes several offices assisting with academic, admission, IT, and first-year support.\n"
    "- إدارة العمادة (General Administration):\n"
    "  • وحدة الشؤون الإدارية (Administrative Affairs)\n"
    "  • وحدة الشؤون المالية (Financial Affairs)\n"

    "If the student’s issue matches one of these areas, refer them to the relevant department. "
    "You could also direct them to the Student Affairs Department in their college if their issue is related to student life, activities, or services."
    "Be polite and professional. Always prioritize helping students get accurate, official information."
    "answers should be normal text and not markdown\n\n"

    f"{docs_content}"
)


    history = [SystemMessage(system_prompt)] + [
        m for m in state["messages"] if m.type in ("human", "system") or (m.type == "ai" and not m.tool_calls)
    ]
    return {"messages": [llm.invoke(history)]}

def build_graph():
    builder = StateGraph(MessagesState)
    builder.add_node("query_or_respond", query_or_respond)
    builder.add_node("tools", ToolNode([retrieve]))
    builder.add_node("generate", generate)

    builder.set_entry_point("query_or_respond")

    #builder.add_conditional_edges("query_or_respond", tools_condition, {END: END, "tools": "tools"})

    builder.add_edge("query_or_respond", "tools")

    builder.add_edge("tools", "generate")
    builder.add_edge("generate", END)

    return builder.compile()
