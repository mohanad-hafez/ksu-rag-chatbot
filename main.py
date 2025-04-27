"""

This is not actually a main file, but a script to run the chatbot in the terminal
I was also using it to load the documents into the vector store because I was
too lazy to make a separate script for that.

from graph.chatbot_graph import build_graph
from db.vectorstore import vector_store
from loaders.document_loader import load_all_documents

# Only embed docs if collection is empty
print("DB contains:", vector_store.collection.estimated_document_count(), "documents")
load_documents = True
if load_documents:
    print("Indexing documents...")
    docs = load_all_documents()
    vector_store.add_documents(docs)
    print("Done indexing.")

# graph = build_graph()

# input_message = input("Ask me anything: ")

# for step in graph.stream({"messages": [{"role": "user", "content": input_message}]}, stream_mode="values"):
#     step["messages"][-1].pretty_print()

# from langchain_core.messages import HumanMessage

# # Start the chat loop
# graph = build_graph()
# chat_history = []

# print("🟢 Chatbot is ready! Type 'exit' to quit.\n")

# while True:
#     user_input = input("You: ")

#     if user_input.strip().lower() in {"exit", "quit"}:
#         print("👋 Bye babe love you so much mmmmuah!")
#         break

#     # Add the user's message to the chat history
#     chat_history.append({"role": "user", "content": user_input})

#     # Run the LangGraph
#     events = graph.stream({"messages": chat_history}, stream_mode="values")

#     # Capture only the final assistant message
#     for step in events:
#         last_msg = step["messages"][-1]
#         last_msg.pretty_print()

#         # Add the assistant response back into the history
#         chat_history.append(last_msg)
"""

