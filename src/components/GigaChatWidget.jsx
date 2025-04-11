import { useState, useRef, useEffect } from 'react';
import './GigaChatWidget.css';

const GigaChatWidget = () => {
    const [input, setInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [chatLog]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setChatLog((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "GigaChat",
                    messages: [{ role: "user", content: message }],
                    temperature: 0.8,
                    top_p: 0.95,
                    n: 1,
                    stream: false
                }),
            });

            if (!res.ok) throw new Error(`Ошибка ${res.status}`);
            const data = await response.json();
            console.log("Ответ от ИИ:", data);

            const assistantMessage = data.choices?.[0]?.message || {
                role: 'assistant',
                content: '⚠️ Ответ не получен от GigaChat',
            };

            setChatLog((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setChatLog((prev) => [...prev, {
                role: 'assistant',
                content: `❌ Произошла ошибка: ${err.message}`,
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="giga-chat-wrapper">
            <div className={`giga-chat-widget ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <span>🤖 GigaChat</span>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="chat-log">
                    {chatLog.map((msg, i) => (
                        <div key={i} className={`msg ${msg.role}`}>
                            <b>{msg.role === 'user' ? 'Вы' : 'GigaChat'}:</b> {msg.content}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-controls">
                    <input
                        type="text"
                        placeholder="Напишите сообщение..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? '...' : '➤'}
                    </button>
                </div>
            </div>

            {!isOpen && (
                <button className="open-widget-btn" onClick={() => setIsOpen(true)}>
                    💬
                </button>
            )}
        </div>
    );
};

export default GigaChatWidget;
