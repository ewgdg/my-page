from haystack import Finder
from haystack.reader.farm import FARMReader
from haystack.document_store.sql import SQLDocumentStore
from haystack.retriever.sparse import TfidfRetriever

# if(prob<0.9) { add first then concat all top sol > 0.6}
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()
origins = [
    "https://xianzhang.dev",
    "http://localhost",
    "http://localhost:8080",
]
allow_origin_regex = 'https://.*\.xianzhang\.dev'
app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_origin_regex=allow_origin_regex,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],)


class Chatbot:
    def __init__(self):
        self.document_store = None
        self.retriever = None
        self.reader = None
        self.finder = None

    def load(self):
        self.document_store = SQLDocumentStore(
            url="sqlite:///qa.db") if(not self.document_store) else self.document_store
        self.retriever = TfidfRetriever(
            document_store=self.document_store) if not self.retriever else self.retriever
        self.reader = FARMReader(model_name_or_path="distilbert-base-uncased-distilled-squad",
                                 use_gpu=False, no_ans_boost=0) if not self.reader else self.reader
        # reader = TransformersReader(model_name_or_path="distilbert-base-uncased-distilled-squad", tokenizer="distilbert-base-uncased", use_gpu=-1)
        self.finder = Finder(
            self.reader, self.retriever) if not self.finder else self.finder


chatbot = Chatbot()


@app.get("/hi")
def hi():
    try:
        chatbot.load()
        return {"status": "ok"}
    except:
        return {"status": "error"}


@app.get("/qa/{question}")
def qa(question: str):
    if not chatbot.finder:
        chatbot.load()
    results = chatbot.finder.get_answers(
        question=question, top_k_retriever=3, top_k_reader=3)
    return {"results": results}


if __name__ == "__main__":
    uvicorn.run("main:app", int(os.environ.get('PORT', 8080)))
