import { useState, useRef, useEffect } from "react";
import axios from "axios";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage = { sender: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition duration-300"
      >
        🤖
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-6 w-96 bg-gray-900 text-white shadow-2xl rounded-2xl flex flex-col border border-gray-700 transform transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 p-3 rounded-t-2xl font-semibold text-center">
          Smart Life AI Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* AI Avatar */}
              {msg.sender === "ai" && (
                <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">
                🤖
              </div>
              <div className="bg-gray-700 px-3 py-2 rounded-xl flex space-x-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="flex border-t border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about productivity, health..."
            className="flex-1 p-3 text-sm bg-gray-800 text-white outline-none placeholder-gray-400"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-5 text-sm hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
