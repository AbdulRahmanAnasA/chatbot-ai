import React, { useState } from "react";
import "./chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

   // Add this at the top of your component (outside the function)
const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem('chatSessionId');
  
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('chatSessionId', sessionId);
  }
  
  return sessionId;
};

// Then update your fetch code:
try {
  const sessionId = getOrCreateSessionId(); // Get or create session ID
  
  const response = await fetch("https://n8n-server-3-aswm.onrender.com/webhook/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      question: input,
      sessionId: sessionId  // Add session ID here
    }),
  });

  const data = await response.json();
  const botReply =
    data.answer || data[0]?.answer || "Sorry, I didn't get that.";

  setMessages([...newMessages, { sender: "bot", text: botReply }]);
} catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Server error occurred." },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">AI Assistant 💬</div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
