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
    
    // При первом рендере проверяем соединение с API
    useEffect(() => {
        const checkApiConnection = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/models');
                if (response.ok) {
                    console.log('✅ Соединение с GigaChat API установлено');
                } else {
                    console.error('❌ Ошибка соединения с GigaChat API:', await response.text());
                }
            } catch (err) {
                console.error('❌ Сервер недоступен:', err);
            }
        };
        
        checkApiConnection();
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setChatLog((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            console.log('Отправка запроса к GigaChat...');
            const response = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "GigaChat", // Или другая доступная модель
                    messages: [
                        // Добавляем весь предыдущий контекст беседы
                        ...chatLog.map(msg => ({ role: msg.role, content: msg.content })),
                        // Добавляем текущее сообщение
                        { role: "user", content: input }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log("Ответ от GigaChat:", data);

            if (data.choices && data.choices.length > 0) {
                const assistantMessage = {
                    role: 'assistant',
                    content: data.choices[0].message.content
                };
                setChatLog((prev) => [...prev, assistantMessage]);
            } else {
                throw new Error("Некорректный формат ответа от API");
            }
        } catch (err) {
            console.error("Ошибка запроса:", err);
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
                    {chatLog.length === 0 && (
                        <div className="welcome-message">
                            <p>👋 Привет! Я GigaChat. Чем я могу помочь?</p>
                        </div>
                    )}
                    
                    {chatLog.map((msg, i) => (
                        <div key={i} className={`msg ${msg.role}`}>
                            <b>{msg.role === 'user' ? 'Вы' : 'GigaChat'}:</b> {msg.content}
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="msg assistant loading">
                            <b>GigaChat:</b> 
                            <span className="typing-indicator">
                                <span>.</span><span>.</span><span>.</span>
                            </span>
                        </div>
                    )}
                    
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-controls">
                    <input
                        type="text"
                        placeholder="Напишите сообщение..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                    />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}>
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