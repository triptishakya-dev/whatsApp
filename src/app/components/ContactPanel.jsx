"use client";

import { contacts } from "@/constant";
import React, { useState } from "react";

const ContactPanel = ({ onChatSelect, activeChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (contact) => {
    if (onChatSelect) {
      onChatSelect(contact);
    }
  };

  const getStatusIcon = (isOnline) => {
    return isOnline ? (
      <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
    ) : (
      <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-800"></div>
    );
  };

  const formatTime = (time) => {
    if (time.includes("AM") || time.includes("PM")) return time;
    if (time === "Yesterday" || time === "Today") return time;
    // For dates like "01-12-2022"
    return new Date(time).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
        <span className="text-white text-lg font-bold">Contacts</span>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-gray-800 border-b border-gray-600">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-800 border-b border-gray-600 px-4 py-2 gap-2">
        {/* Example: add filter buttons later */}
        <button className="px-2 py-1 text-gray-400 rounded hover:bg-gray-700">All</button>
        <button className="px-2 py-1 text-gray-400 rounded hover:bg-gray-700">Online</button>
      </div>

      {/* Chat List - scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredContacts.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">No contacts found</div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleChatClick(contact)}
              className={`flex items-center cursor-pointer p-3 border-b border-gray-700 
                ${activeChat?.id === contact.id ? "bg-gray-700" : "hover:bg-gray-700"}`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 font-bold">
                {contact.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{contact.name}</span>
                  <span className="text-xs text-gray-400 font-mono">
                    {formatTime(contact.lastMessageTime || "Today")}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {contact.lastMessage}
                </span>
              </div>
              <div className="ml-2">{getStatusIcon(contact.isOnline)}</div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 bg-gray-700 border-t border-gray-600">
        <span className="text-gray-400 text-sm">
          {contacts.length} contacts
        </span>
      </div>

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
      `}</style>
    </div>
  );
};

export default ContactPanel;
