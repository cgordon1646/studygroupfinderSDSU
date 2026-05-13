import { useEffect, useRef, useState } from "react";
import { fetchGroupMessages, postGroupMessage } from "../auth/api";
import type { GroupMessage } from "../auth/api";

interface ChatPanelProps {
  groupId: string;
  groupName: string;
  accessToken: string | null;
}

export function ChatPanel({
  groupId,
  groupName,
  accessToken,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!accessToken) return;
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [groupId, accessToken]);

  const loadMessages = async () => {
    if (!accessToken) return;
    try {
      const msgs = await fetchGroupMessages(groupId, accessToken);
      setMessages(msgs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !inputValue.trim()) return;

    setLoading(true);
    try {
      const newMsg = await postGroupMessage(groupId, inputValue, accessToken);
      setMessages([...messages, newMsg]);
      setInputValue("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return <div className="chat-panel-empty">Sign in to chat</div>;
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h4>Chat — {groupName}</h4>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">No messages yet. Start a conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <div className="message-header">
                <strong>{msg.user_name}</strong>
                <span className="message-time">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p>{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chat-error">{error}</div>}

      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
