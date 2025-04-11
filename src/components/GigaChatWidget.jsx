import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaComments } from "react-icons/fa";

const socket = io();

const GigaChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    socket.on("chat response", (reply) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "gigachat", text: reply }
      ]);
    });

    return () => {
      socket.off("chat response");
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: "user", text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    socket.emit("chat message", inputValue);
    setInputValue("");
  };

  return (
    <aside className="gigachat-widget">
      <div className="chat-icon" onClick={toggleChat}>
        <FaComments size={24} />
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>GigaChat</h4>
            <button onClick={toggleChat} className="close-btn">×</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender === "user" ? "user" : "gigachat"}`}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Введите сообщение..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>Отправить</button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default GigaChatWidget;
