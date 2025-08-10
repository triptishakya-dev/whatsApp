"use client"
import React, { useState } from "react";
import ContactPanel from "./components/ContactPanel";
import ChatPanel from "./components/ChatPanel";


const ParentComponent = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-700">
        <ContactPanel onChatSelect={setActiveChat} activeChat={activeChat} />
      </div>
      <div className="w-2/3">
        {activeChat ? (
          <ChatPanel contact={activeChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentComponent;
