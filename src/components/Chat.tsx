import React from 'react';

interface ChatProps {
    me: string;
    messages: Array<{ sender: string; message: string }>;
    inputValue: string;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
}

const Chat: React.FC<ChatProps> = ({ me, messages, inputValue, onInputChange, onSendMessage }) => {
    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender.toLowerCase() == me ? "you" : "other"}`}>
                        <span className="sender">{msg.sender}: </span>
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder="Type a message..."
                />
                <button onClick={onSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;