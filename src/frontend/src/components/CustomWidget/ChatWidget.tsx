import { MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDarkStore } from "../../stores/darkStore";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export function ChatWidget() {
  // Use Langflow's built-in theme state
  const dark = useDarkStore((state) => state.dark);
  
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme colors based on dark mode
  const theme = {
    primary: "#3b82f6",
    primaryText: "#ffffff",
    background: dark ? "#1f2937" : "#ffffff",
    surface: dark ? "#374151" : "#f3f4f6",
    text: dark ? "#f9fafb" : "#1f2937",
    textMuted: dark ? "#9ca3af" : "#6b7280",
    border: dark ? "#4b5563" : "#e5e7eb",
    userBubble: "#3b82f6",
    aiBubble: dark ? "#374151" : "#e5e7eb",
  };

  // Use a fixed persistent session ID for chat history persistence
  const PERSISTENT_SESSION_ID = "persistent-chat-session";

  // Initialize session and load history on mount
  useEffect(() => {
    const initializeSession = async () => {
      // Use the persistent session ID
      setSessionId(PERSISTENT_SESSION_ID);
      
      // Load existing chat history from database
      await loadChatHistory(PERSISTENT_SESSION_ID);
    };

    initializeSession();
  }, []);

  const loadChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/v1/chat/history/${sid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const history = await response.json();
      setMessages(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    const tempUserMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await fetch("/api/v1/chat/widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, session_id: sessionId }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const aiMessage: Message = {
        id: data.message_id || Date.now().toString(),
        sender: "ai",
        text: data.response || "No response received",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: theme.primary,
            color: theme.primaryText,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            width: "380px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            backgroundColor: theme.background,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            border: `1px solid ${theme.border}`,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: theme.primary,
              color: theme.primaryText,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageSquare size={20} />
              <h3 style={{ margin: 0, fontWeight: 600, fontSize: "16px" }}>Chat Assistant</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: theme.primaryText,
                cursor: "pointer",
                padding: "4px",
                borderRadius: "50%",
                display: "flex",
              }}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: theme.surface,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.textMuted,
                }}
              >
                <p style={{ textAlign: "center", fontSize: "14px", margin: 0 }}>
                  Start a conversation!<br />Ask me anything.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    backgroundColor: message.sender === "user" ? theme.userBubble : theme.aiBubble,
                    color: message.sender === "user" ? theme.primaryText : theme.text,
                  }}
                >
                  <p style={{ margin: 0, fontSize: "14px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "12px", backgroundColor: theme.aiBubble, display: "flex", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.textMuted, animation: "bounce 1s infinite" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.textMuted, animation: "bounce 1s infinite 0.2s" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.textMuted, animation: "bounce 1s infinite 0.4s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px", borderTop: `1px solid ${theme.border}`, backgroundColor: theme.background }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading || !sessionId}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: theme.background,
                  color: theme.text,
                }}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isLoading || !sessionId || !inputMessage.trim()}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: isLoading || !sessionId || !inputMessage.trim() ? theme.textMuted : theme.primary,
                  color: theme.primaryText,
                  border: "none",
                  cursor: isLoading || !sessionId || !inputMessage.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }`}</style>
    </>
  );
}
