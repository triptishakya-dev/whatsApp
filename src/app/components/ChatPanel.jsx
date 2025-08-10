"use client";
import React, { useState, useRef, useEffect } from "react";

// Helper for formatting times
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// This is the full chat panel component
const ChatPanel = ({ contact }) => {
  // Local state for this contact's messages (in a real app, lift up!)
  const [messages, setMessages] = useState(() => contact?.messages || []);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // If contact changes, reset messages to the new contact
  useEffect(() => {
    setMessages(contact?.messages || []);
  }, [contact]);

  // Always scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send a message (and fake a reply)
  const handleSendMessage = () => {
    if (!message.trim()) return;
    const now = new Date();
    const newMsg = {
      id: messages.length + 1,
      text: message,
      time: formatTime(now),
      sent: true,
      status: "sent",
      date: "Today",
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    // Simulate recipient typing and replying
    setTimeout(() => setIsTyping(true), 700);
    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: messages.length + 2,
        text: "Thanks for your message! 👍",
        time: formatTime(new Date()),
        sent: false,
        status: "delivered",
        date: "Today",
      };
      setMessages((prev) => [...prev, reply]);
    }, 2200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Status icons for sent/delivered/read
  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <span className="text-gray-300">✓</span>;
      case "delivered":
        return <span className="text-gray-300">✓✓</span>;
      case "read":
        return <span className="text-blue-400">✓✓</span>;
      default:
        return null;
    }
  };

  if (!contact) {
    // No contact selected fallback
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-500">
        Select a contact to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700 z-10">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
          <span className="text-lg">{contact.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{contact.name}</h3>
          <p className="text-gray-400 text-sm">
            {isTyping ? "typing..." : contact.lastSeen || "last seen today"}
          </p>
        </div>
        <div className="flex gap-1">
          {/* Demo buttons */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
            <span className="text-lg">🔍</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
            <span className="text-lg">📹</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
            <span className="text-lg">📞</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
            <span className="text-lg">⋮</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 custom-scrollbar">
        {/* Date Separator */}
        <div className="flex justify-center mb-4">
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
            Today
          </span>
        </div>
        <div className="flex flex-col space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-lg ${
                  msg.sent
                    ? "bg-green-600 text-white rounded-br-md"
                    : "bg-gray-700 text-white rounded-bl-md"
                } transition-all duration-200 hover:shadow-xl`}
              >
                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs text-gray-200 opacity-70">
                    {msg.time}
                  </span>
                  {msg.sent && getStatusIcon(msg.status)}
                </div>
              </div>
            </div>
          ))}
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
            <span className="text-xl">😊</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
            <span className="text-xl">📎</span>
          </button>
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-3xl border border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 resize-none max-h-32 overflow-y-auto"
              style={{ minHeight: "40px" }}
            />
          </div>
          {message.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-full transition-colors transform hover:scale-105"
            >
              <span className="text-xl">➤</span>
            </button>
          ) : (
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
              <span className="text-xl">🎤</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom CSS for animations and scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #4b5563;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;
