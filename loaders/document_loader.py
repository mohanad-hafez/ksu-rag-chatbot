import os
import bs4
from langchain_community.document_loaders import PyPDFLoader, UnstructuredHTMLLoader, WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_all_documents():
    all_docs = []
    #splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,  # Increased from 1000
        chunk_overlap=300,  # Increased from 200
        length_function=len,  # Makes sure we count characters correctly
        separators=["\n\n", "\n", " ", ""]  # Explicit separators
    )

    # PDFs
    # for filename in os.listdir("./data/pdf"):
    #     if filename.endswith(".pdf"):
    #         docs = PyPDFLoader(f"./data/pdf/{filename}").load()
    #         all_docs.extend(splitter.split_documents(docs))

    # HTML files
    # for filename in os.listdir("./data/html"):
    #     if filename.endswith(".html") or filename.endswith(".htm"):
    #         docs = UnstructuredHTMLLoader(f"./data/html/{filename}").load()
    #         all_docs.extend(splitter.split_documents(docs))

    # Web pages
    # urls = [
    #     "https://ccis.ksu.edu.sa/en/node/1317",
    #     "https://ccis.ksu.edu.sa/ar/practical-training/m-students",
    #     "https://ccis.ksu.edu.sa/en/acceptance-and-transfer",
    #     "https://ccis.ksu.edu.sa/ar/acceptance-and-transfer",
    #     "https://ccis.ksu.edu.sa/en/node/1314",
    #     "https://ccis.ksu.edu.sa/ar/practical-training/f-students",
    # ]
    urls = ["https://sa.ksu.edu.sa/ar/node/919",]
    web_loader = WebBaseLoader(
        web_paths=urls,
        bs_kwargs={"parse_only": bs4.SoupStrainer(class_=["node node--type-page node--view-mode-full"])},
        encoding="utf-8",
        requests_kwargs={"headers": {"Accept-Language": "ar,en;q=0.9"}},
    )
    web_docs = web_loader.load()
    all_docs.extend(splitter.split_documents(web_docs))

    # Filter out documents with less than 100 characters
    filtered_docs = [doc for doc in all_docs if len(doc.page_content.strip()) > 100]
    return filtered_docs
    #return all_docs
