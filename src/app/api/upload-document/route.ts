import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Load the PDF
    const loader = new PDFLoader(file);
    const docs = await loader.load();

    // Split the document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Create embeddings and store in vector store
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY_2
    });
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

    // For demonstration, we'll just return the full text
    const fullText = splitDocs.map(doc => doc.pageContent).join(' ');

    return NextResponse.json({ text: fullText }, { status: 200 });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ error: 'Error processing document', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}