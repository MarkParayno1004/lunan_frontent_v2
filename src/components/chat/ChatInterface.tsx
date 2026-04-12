'use client';

import React, { useState } from 'react';
import { useTwilioChat } from '@/lib/hooks/useTwilioChat';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ChatInterfaceProps {
    userEmail: string;
    conversationSid: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userEmail, conversationSid }) => {
    const { messages, sendMessage, joinConversation, status } = useTwilioChat(userEmail);
    const [newMessage, setNewMessage] = useState('');

    React.useEffect(() => {
        if (status === 'connected' && conversationSid) {
            joinConversation(conversationSid);
        }
    }, [status, conversationSid, joinConversation]);

    const handleSend = () => {
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    if (status === 'loading') return <div>Connecting to clinic...</div>;
    if (status === 'error') return <div>Connection failed. Doctor is offline or credentials expired.</div>;

    return (
        <Card className="flex flex-col h-[500px] w-full max-w-lg mx-auto bg-white border-clinical-sage">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div 
                        key={i} 
                        className={`p-3 rounded-lg max-w-[80%] ${
                            msg.author === userEmail 
                                ? 'bg-primary-mint text-white ml-auto' 
                                : 'bg-soft-sage text-trust-navy'
                        }`}
                    >
                        <p className="text-sm">{msg.body}</p>
                        <span className="text-[10px] opacity-70">
                            {msg.dateCreated?.toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t border-clinical-sage flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-mint outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} className="bg-primary-mint hover:bg-opacity-90">
                    Send
                </Button>
            </div>
        </Card>
    );
};

export default ChatInterface;
