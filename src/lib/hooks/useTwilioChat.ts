'use client';

import { useState, useEffect, useCallback } from 'react';
import { Client, Conversation, Message } from '@twilio/conversations';

export const useTwilioChat = (email: string) => {
    const [client, setClient] = useState<Client | null>(null);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');

    const initializeChat = useCallback(async () => {
        try {
            // Fetch token from backend
            const response = await fetch(`/api/twilio/token?email=${email}`);
            const { token } = await response.json();

            const twilioClient = new Client(token);
            
            twilioClient.on('stateChanged', (state) => {
                if (state === 'failed') setStatus('error');
                if (state === 'initialized') setStatus('connected');
            });

            setClient(twilioClient);
        } catch (error) {
            console.error('Failed to initialize Twilio Chat:', error);
            setStatus('error');
        }
    }, [email]);

    useEffect(() => {
        if (email) initializeChat();
        return () => {
            client?.shutdown();
        };
    }, [email, initializeChat]);

    const joinConversation = async (sid: string) => {
        if (!client) return;
        try {
            const conversation = await client.getConversationBySid(sid);
            setActiveConversation(conversation);
            
            const msgs = await conversation.getMessages();
            setMessages(msgs.items);

            conversation.on('messageAdded', (message) => {
                setMessages((prev) => [...prev, message]);
            });
        } catch (error) {
            console.error('Error joining conversation:', error);
        }
    };

    const sendMessage = async (text: string) => {
        if (activeConversation) {
            await activeConversation.sendMessage(text);
        }
    };

    return { client, activeConversation, messages, status, joinConversation, sendMessage };
};
