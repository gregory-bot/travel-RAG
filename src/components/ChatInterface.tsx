import { useState, useEffect, useRef } from "react";
import { Send, Compass, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Source {
  title: string;
  preview: string;
  relevance: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: Source[];
}

const categoryChips = [
  { emoji: "🦁", label: "Wildlife" },
  { emoji: "🏖️", label: "Beaches" },
  { emoji: "🏔️", label: "Mountains" },
  { emoji: "🏨", label: "Accommodation" },
  { emoji: "🗺️", label: "Itineraries" },
  { emoji: "💰", label: "Budget" },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      handleSend(q);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate API call (replace with actual FastAPI call)
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Based on our tourism database, here's what I found about "${query.trim()}":\n\nThis is a demo response. Connect your FastAPI backend at POST /chat to get real RAG-powered answers grounded in Kenyan tourism documents from Magical Kenya, Wikivoyage, and other official sources.`,
        sources: [
          { title: "Magical Kenya - Official Guide", preview: "Kenya offers a diverse range of wildlife experiences...", relevance: "High" },
          { title: "Wikivoyage - Kenya Travel", preview: "The country is known for its spectacular natural scenery...", relevance: "Medium" },
        ],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleSources = (id: string) => {
    setExpandedSources((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Compass className="w-16 h-16 text-primary mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Ask About Kenya
              </h2>
              <p className="text-muted-foreground font-body mb-8 max-w-md">
                Get AI-powered answers grounded in real tourism data from official Kenyan sources.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {categoryChips.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleSend(`Best ${c.label.toLowerCase()} in Kenya`)}
                    className="bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground rounded-full px-4 py-2 text-sm font-body transition-colors border border-border"
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex gap-3"}`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <Compass className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div>
                  <div
                    className={`rounded-2xl px-4 py-3 font-body text-sm ${
                      msg.role === "user"
                        ? "chat-bubble-user text-foreground"
                        : "chat-bubble-ai text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleSources(msg.id)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-medium font-body transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        View Sources ({msg.sources.length})
                        {expandedSources.has(msg.id) ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      {expandedSources.has(msg.id) && (
                        <div className="mt-2 space-y-2">
                          {msg.sources.map((src, i) => (
                            <div key={i} className="bg-accent/50 rounded-lg p-3 border border-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-foreground font-body">{src.title}</span>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">
                                  {src.relevance}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-body">{src.preview}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="chat-bubble-ai rounded-2xl px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot" />
                <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-muted rounded-full px-4 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about Kenya..."
              className="flex-1 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-body text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-2 font-body">
            Responses are grounded in Kenya tourism documents from official sources
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
