import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Paperclip, Minimize2, ChevronLeft, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

export interface Counselor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  status: "Online" | "Away";
}

interface FloatingChatWidgetProps {
  role: "patient" | "doctor";
  counselors: Counselor[];
  initialMessages?: Message[];
  onSendMessage?: (text: string, counselorId: string) => void;
  onFileAttach?: () => void;
}

type ChatView = "list" | "chat";

export function FloatingChatWidget({
  role,
  counselors,
  initialMessages = [],
  onSendMessage,
  onFileAttach,
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatView>("list");
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const isPatient = role === "patient";
  const themeColor = isPatient ? "bg-blue-600" : "bg-emerald-600";
  const themeHover = isPatient ? "hover:bg-blue-700" : "hover:bg-emerald-700";

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen && view === "chat") {
      scrollToBottom();
    }
  }, [isOpen, view, messages]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSend = () => {
    if (!messageText.trim() || !selectedCounselor) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    onSendMessage?.(messageText, selectedCounselor.id);
    setMessageText("");
  };

  const handleSelectCounselor = (c: Counselor) => {
    setSelectedCounselor(c);
    setView("chat");
  };

  const handleBack = () => {
    setView("list");
    setSelectedCounselor(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window Container */}
      <div
        className={cn(
          "mb-4 flex h-[550px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all duration-300 ease-in-out origin-bottom-right pointer-events-auto",
          isOpen 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-95 opacity-0 translate-y-10"
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center justify-between p-4 text-white shrink-0", themeColor)}>
          <div className="flex items-center gap-2">
            {view === "chat" && (
              <button 
                onClick={handleBack}
                className="mr-1 rounded-full p-1 transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {view === "chat" && selectedCounselor ? (
              <div className="flex items-center gap-3">
                <Avatar 
                  src={selectedCounselor.avatarUrl} 
                  alt={selectedCounselor.name} 
                  status={selectedCounselor.status} 
                  size="sm" 
                  className="border border-white/20"
                />
                <div>
                  <h4 className="text-sm font-semibold leading-none">{selectedCounselor.name}</h4>
                  <p className="mt-1 text-[10px] opacity-80 uppercase font-medium">
                    {selectedCounselor.specialty}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold">Select a Counselor</h4>
                <p className="text-[10px] opacity-80">Start a new consultation</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-white/20"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View Content with Slide Transition */}
        <div className="relative flex-1 overflow-hidden bg-zinc-50">
          {/* List View */}
          <div 
            className={cn(
              "absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out",
              view === "list" ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="p-4 overflow-y-auto h-full space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search specialists..."
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                />
              </div>
              {counselors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCounselor(c)}
                  className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-white p-3 text-left shadow-sm transition-all hover:border-zinc-200 hover:shadow-md active:scale-[0.98]"
                >
                  <Avatar src={c.avatarUrl} alt={c.name} status={c.status} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-zinc-900">{c.name}</h5>
                      <span className={cn(
                        "text-[10px] font-medium",
                        c.status === "Online" ? "text-emerald-500" : "text-zinc-400"
                      )}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{c.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat View */}
          <div 
            className={cn(
              "absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out",
              view === "chat" ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.sender === "me" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm shadow-sm",
                      msg.sender === "me" 
                        ? cn("rounded-tr-none text-white", themeColor) 
                        : "rounded-tl-none bg-white text-zinc-900 border border-zinc-100"
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 text-[10px] text-zinc-400 font-medium">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t bg-white p-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onFileAttach}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="w-full flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-white transition-all shadow-sm disabled:opacity-50",
                    themeColor,
                    themeHover
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto",
          isOpen ? "rotate-90 bg-zinc-800" : themeColor
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
