import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";
import type { Message } from "../interfaces";

export default function LineChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 👇 Replace this with your real API call
  const callAPI = async (userMessage: string) => {
    try {
      // cancel request เก่าถ้ามี
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal, // ✅ สำคัญมาก
        body: JSON.stringify({
          text: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("API Error");
      }

      const data = await response.json();

      return `คาดว่า: ${data.prediction}
ความเป็นไปได้: ${data.confidence}
เหตุผล: ${data.reason}`;
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request cancelled");
        return null;
      }

      console.error(error);
      return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง 🙏";
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setChatStarted(true);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text, timestamp: Date.now() },
    ]);
    setInputText("");
    setIsTyping(true);

    try {
      const reply = await callAPI(text);
      if (!reply) return;
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "agent", text: reply, timestamp: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "agent",
          text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง 🙏",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (!text) return;

      setInputText((prev) => prev + text);

      textareaRef.current?.focus();
    } catch (err) {
      console.error("Paste failed", err);
    }
  };


  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .messages-scroll::-webkit-scrollbar { width: 4px; }
        .messages-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        textarea:focus { outline: none; }
      `}</style>
      {/* ── LEFT: Chat Panel ── */}
      <div className="h-screen w-full flex flex-col">

        {/* Header */}
        <div className="w-full bg-[#9EDDFF] h-25 px-4 py-3 flex items-end gap-3 shadow-md">
          <div className="flex-1">
            <p className="text-white font-bold text-base leading-tight">SCAM CHECKER AI</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow" />
              <span className="text-green-100 text-xs">
                {isTyping ? "กำลังพิมพ์…" : "ออนไลน์"}
              </span>
            </div>
          </div>
          {/* Icons */}
        </div>
        {
          chatStarted ? (
            <>
              <div className="flex flex-col h-full">

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 messages-scroll">

                  {/* Date badge */}
                  <div className="flex justify-center mb-4">
                    <span className="bg-black bg-opacity-20 text-white text-xs px-3 py-1 rounded-full">
                      วันนี้
                    </span>
                  </div>

                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}

                  {isTyping && <TypingBubble />}
                  <div ref={messagesEndRef} />

                </div>

                {/* ✅ Home Button (centered) */}
                <div className="flex justify-center py-4">
                  <button
                    onClick={() => {
                      // ❌ cancel api call
                      abortControllerRef.current?.abort?.()

                      setChatStarted(false)
                      setIsTyping(false)
                      setMessages([])
                    }}
                    className="px-6 py-3 rounded-2xl font-bold text-sm bg-[#9EDDFF] text-white"
                  >
                    กลับหน้าโฮม
                  </button>
                </div>

              </div>
            </>
          ) : (
            /* ── RIGHT: Input Panel ── */
            <div className="w-full h-full bg-white flex flex-col pt-30">
              <div className="text-center">
                <div className="flex-1 flex flex-col px-3 pt-3 gap-2">
                  <p className="text-sm">
                    สวัสดี 👋 ส่งข้อความที่สงสัยมาได้เลย
                  </p>

                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                      placeholder={
                        "พิมพ์ข้อความที่นี่…\nEnter เพื่อส่ง, Shift+Enter ขึ้นบรรทัดใหม่"
                      }
                      className="w-full min-h-30 shadow-sm border border-gray-300 focus:border-gray-400 rounded-2xl px-4 py-3 text-sm text-gray-800 leading-relaxed placeholder-gray-300 transition-colors"
                    />

                    {/* Send button */}
                    <button
                      onClick={handleSend}
                      disabled={isTyping || !inputText.trim()}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 flex items-center justify-center py-3 rounded-full font-bold text-sm transition-all
              ${isTyping || !inputText.trim()
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-black hover:bg-gray-600 active:scale-95 text-white shadow-md"
                        }`}
                    >
                      {isTyping ? (
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Send area */}
                <div className="px-3 pb-4 pt-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs text-gray-300">
                      {inputText.length} ตัวอักษร
                    </span>
                    <span className="text-xs text-gray-300">
                      Enter ↵ เพื่อส่ง
                    </span>
                  </div>

                  <button
                    onClick={handlePaste}
                    className="py-3 rounded-2xl font-bold text-sm bg-[#9EDDFF] text-white"
                  >
                    วางข้อความ
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}