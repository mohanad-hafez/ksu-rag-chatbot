# In your main.py or a separate cleanup script
from db.vectorstore import client
client["ksu_chatbot"]["university_docs"].drop()
print("Collection dropped. Run the script again to reload documents.")