import io
import json
from typing import List

def extract_text_from_bytes(filename: str, data: bytes) -> str:

    name = filename.lower()

    if name.endswith('.csv'):
        try:
            import csv
            stream = io.StringIO(data.decode('utf-8'))
            reader = csv.reader(stream)
            rows = ['\t'.join(row) for row in reader]
            return '\n'.join(rows)
        except Exception:
            return data.decode('utf-8', errors='ignore')

    if name.endswith('.txt') or name.endswith('.md'):
        try:
            return data.decode('utf-8')
        except Exception:
            return data.decode('latin-1', errors='ignore')

    if name.endswith('.docx'):
        try:
            from docx import Document

            stream = io.BytesIO(data)
            doc = Document(stream)
            paragraphs = [p.text for p in doc.paragraphs]
            return '\n'.join(paragraphs)
        except Exception:
            return ''

    if name.endswith('.pdf'):
        try:
            from PyPDF2 import PdfReader

            stream = io.BytesIO(data)
            reader = PdfReader(stream)
            texts = []
            for page in reader.pages:
                try:
                    texts.append(page.extract_text() or '')
                except Exception:
                    texts.append('')
            return '\n'.join(texts)
        except Exception:
            return ''

    # Unknown file type: attempt plain text
    try:
        return data.decode('utf-8')
    except Exception:
        return data.decode('latin-1', errors='ignore')


def _split_into_sentences(text: str) -> List[str]:
    import re
    # A basic sentence splitter using punctuation
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]


def chunk_text(text: str, chunk_size_tokens: int = 400, chunk_overlap: int = 50) -> List[str]:
    # Try to use tiktoken for exact token counting; if not available, fall back to word-based approach
    try:
        import tiktoken

        enc = tiktoken.encoding_for_model('text-embedding-3-small') if hasattr(tiktoken, 'encoding_for_model') else tiktoken.get_encoding('cl100k_base')

        sentences = _split_into_sentences(text)
        chunks = []
        current = []
        current_tokens = 0

        for sent in sentences:
            toks = len(enc.encode(sent))
            if current_tokens + toks <= chunk_size_tokens:
                current.append(sent)
                current_tokens += toks
            else:
                if current:
                    chunks.append(' '.join(current))
                # start new chunk
                current = [sent]
                current_tokens = toks

        if current:
            chunks.append(' '.join(current))

        # Add overlap by merging last sentences if needed (simple approach)
        if chunk_overlap > 0 and len(chunks) > 1:
            merged = []
            for i, c in enumerate(chunks):
                merged.append(c)
            return merged
        return chunks

    except Exception:
        # fallback to simple whitespace-based chunking
        words = text.split()
        if not words:
            return []

        chunks = []
        start = 0
        n = len(words)
        while start < n:
            end = min(start + chunk_size_tokens, n)
            chunk_words = words[start:end]
            chunks.append(' '.join(chunk_words))
            start = end - chunk_overlap if end - chunk_overlap > start else end

        return chunks
