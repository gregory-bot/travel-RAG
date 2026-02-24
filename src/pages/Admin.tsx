import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Search, Trash2, RefreshCw, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Document {
  id: string;
  name: string;
  fileName: string;
  type: string;
  size: string;
  sizeBytes: number;
  status: "processing" | "indexed" | "error";
  chunks: number;
  queries: number;
  uploaded: string;
}

const DOCS_STORAGE_KEY = "travel-kenya-admin-documents";

const loadDocuments = (): Document[] => {
  try {
    const stored = localStorage.getItem(DOCS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveDocuments = (docs: Document[]) => {
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
  } catch {}
};

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
};

const getFileType = (name: string): string => {
  const ext = name.split(".").pop()?.toUpperCase() || "FILE";
  return ext;
};

const Admin = () => {
  const [documents, setDocuments] = useState<Document[]>(loadDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const persist = (docs: Document[]) => {
    setDocuments(docs);
    saveDocuments(docs);
  };

  const addFiles = (files: File[]) => {
    const validExts = [".pdf", ".txt", ".docx", ".csv", ".md"];
    const valid = files.filter((f) => validExts.some((ext) => f.name.toLowerCase().endsWith(ext)));

    const newDocs: Document[] = valid.map((f) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: f.name.replace(/\.[^/.]+$/, ""),
      fileName: f.name,
      type: getFileType(f.name),
      size: formatFileSize(f.size),
      sizeBytes: f.size,
      status: "processing" as const,
      chunks: 0,
      queries: 0,
      uploaded: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
    }));

    const updated = [...documents, ...newDocs];
    persist(updated);

    // Simulate processing — replace with actual POST /upload-documents
    newDocs.forEach((doc) => {
      const delay = 2000 + Math.random() * 3000;
      setTimeout(() => {
        setDocuments((prev) => {
          const next = prev.map((d) =>
            d.id === doc.id
              ? {
                  ...d,
                  status: (Math.random() > 0.2 ? "indexed" : "error") as "indexed" | "error",
                  chunks: Math.random() > 0.2 ? Math.floor(Math.random() * 500) + 10 : 0,
                }
              : d
          );
          saveDocuments(next);
          return next;
        });
      }, delay);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    if (e.target) e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [documents]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const deleteDoc = (id: string) => {
    persist(documents.filter((d) => d.id !== id));
  };

  const retryDoc = (id: string) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, status: "processing" as const, chunks: 0 } : d));
    persist(updated);
    setTimeout(() => {
      setDocuments((prev) => {
        const next = prev.map((d) =>
          d.id === id ? { ...d, status: "indexed" as const, chunks: Math.floor(Math.random() * 500) + 10 } : d
        );
        saveDocuments(next);
        return next;
      });
    }, 2500);
  };

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (status: Document["status"]) => {
    switch (status) {
      case "indexed":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Indexed
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
            <XCircle className="w-3.5 h-3.5" /> Error
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Document Library</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-8">Manage tourism documents for the RAG knowledge base</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-8 ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.docx,.csv,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">Drop tourism documents here or click to upload</p>
          <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT, CSV, MD • Max 50MB per file</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2.5 text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Choose Files
          </button>
        </div>

        {/* Documents table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Document</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Chunks</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Queries</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Uploaded</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      {documents.length === 0 ? "No documents yet. Upload files above to get started." : "No documents match your search."}
                    </td>
                  </tr>
                )}
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[240px]">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.size}</td>
                    <td className="py-3 px-4">{statusBadge(doc.status)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.chunks}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.queries}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.uploaded}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {doc.status === "error" && (
                          <button onClick={() => retryDoc(doc.id)} title="Retry" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteDoc(doc.id)} title="Delete" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
