import React, { useState } from "react";
import axios from "axios";

const GigaChat = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Замените URL на реальный endpoint API GigaChat от Сбербанка
      const response = await axios.post("https://api.sberbank.ru/gigachat", {
        message: chatInput,
      });
      setChatResponse(response.data.reply);
    } catch (error) {
      console.error("Ошибка интеграции GigaChat: ", error);
      setChatResponse("Ошибка при обращении к GigaChat");
    }
  };

  return (
    <div className="gigachat">
      <h2>GigaChat</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={chatInput} 
          onChange={(e) => setChatInput(e.target.value)} 
          placeholder="Введите запрос" 
        />
        <button type="submit">Отправить</button>
      </form>
      <div className="chat-response">{chatResponse}</div>
    </div>
  );
};

export default GigaChat;
