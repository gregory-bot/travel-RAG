import { useState, useEffect, useRef } from "react";
import { Send, Compass, ChevronDown, ChevronUp, FileText } from "lucide-react";

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

const STORAGE_KEY = "travel-kenya";

const categoryChips = [
  { label: "Wildlife" },
  { label: "Beaches" },
  { label: "Mountains" },
  { label: "Accommodation" },
  { label: "Itineraries" },
  { label: "Budget" },
];

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // storage full or unavailable
  }
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Remove any hash from URL on mount (prevents scroll to #chat)
  useEffect(() => {
    if (window.location.hash === "#chat") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Only scroll to bottom WITHIN THE CHAT CONTAINER (not the page)
  const prevMessagesRef = useRef<Message[]>([]);
  useEffect(() => {
    // Only scroll if a new message was added and we should auto-scroll
    if (
      prevMessagesRef.current.length < messages.length &&
      (messages[messages.length - 1]?.role === "user" || messages[messages.length - 1]?.role === "ai") &&
      isAtBottom &&
      chatContainerRef.current
    ) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (chatContainerRef.current) {
          // Scroll the container itself, not the page
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
    }
    prevMessagesRef.current = messages;
  }, [messages, isAtBottom]);

  // Track if user is at the bottom of the chat
  useEffect(() => {
    const chatDiv = chatContainerRef.current;
    if (!chatDiv) return;
    
    const handleScroll = () => {
      const threshold = 60; // px from bottom to still count as "at bottom"
      const atBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < threshold;
      setIsAtBottom(atBottom);
    };
    
    chatDiv.addEventListener("scroll", handleScroll);
    // Set initial state
    handleScroll();
    
    return () => chatDiv.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const query = (e as CustomEvent).detail;
      if (query) handleSend(query);
    };
    window.addEventListener("explore-destination", handler);
    return () => window.removeEventListener("explore-destination", handler);
  }, []);

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

    // Call FastAPI backend /chat endpoint
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.answer,
        sources: data.sources?.map((src: string) => ({ title: src, preview: "", relevance: "" })) || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "try again later.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
    setIsTyping(false);
  };

  const toggleSources = (id: string) => {
    setExpandedSources((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isEmpty = messages.length === 0;

  return (
    <section id="chat-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          travel guide
        </h2>

        <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Header with clear chat */}
          {!isEmpty && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-xs text-muted-foreground font-body">
                {messages.length} message{messages.length !== 1 ? "s" : ""} saved
              </span>
              <button
                onClick={clearChat}
                className="text-xs text-destructive hover:underline font-body transition-colors"
              >
                Clear Chat
              </button>
            </div>
          )}

          {/* Messages area - ISOLATED SCROLL CONTAINER */}
          <div 
            ref={chatContainerRef} 
            className="h-[450px] overflow-y-auto px-4 py-6"
            style={{
              scrollBehavior: 'smooth',
              overflowAnchor: 'auto', // Allow browser to manage scroll anchoring
            }}
          >
            {isEmpty && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Ask About Kenya
                </h3>
                <p className="text-muted-foreground font-body mb-6 max-w-md text-sm">
                  Type a question or pick a category below.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
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

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2">
                        <button
                          onClick={() => toggleSources(msg.id)}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-medium font-body transition-colors"
                        >
                          View Sources ({msg.sources.length})
                          {expandedSources.has(msg.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {expandedSources.has(msg.id) && (
                          <div className="mt-2 space-y-2">
                            {msg.sources.map((src, i) => (
                              <div key={i} className="bg-accent/50 rounded-lg p-3 border border-border">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-foreground font-body">{src.title}</span>
                                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-body">{src.relevance}</span>
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

            {/* This ref marks the end of messages for scroll positioning */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border bg-muted/30 px-4 py-4">
            <div className="flex items-center gap-3 bg-background rounded-full px-4 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;