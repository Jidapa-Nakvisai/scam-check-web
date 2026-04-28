import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";


export default function LineChatUI() {
  const MOCK_REPLIES = [
    "สวัสดีครับ! ขอบคุณที่ส่งข้อความมา ฉันพร้อมช่วยเหลือคุณเสมอ 😊",
    "เข้าใจแล้วครับ ขอให้รอสักครู่ ฉันกำลังประมวลผลข้อมูลให้คุณ...",
    "นี่คือการตอบกลับจาก AI Agent ของคุณ กรุณาเชื่อมต่อ API จริงในฟังก์ชัน callAPI() ครับ",
    "ขอบคุณสำหรับคำถามครับ! ฉันยินดีช่วยเสมอ 🙌",
  ];
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "agent",
      text: "สวัสดีครับ! 👋 ฉันคือ ARIA ผู้ช่วย AI ของคุณ พร้อมให้บริการแล้ว!",
      timestamp: Date.now() - 60000,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 👇 Replace this with your real API call
  const callAPI = async (userMessage: string) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    // return {
    //   prediction: data.prediction,
    //   confidence: data.confidence,
    //   reason: data.reason,
    // };
    return `คาดว่า: ${data.prediction} \n
    ความเป็นไปได้: ${data.confidence}\n 
    เหตุผล: ${data.reason}`
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text, timestamp: Date.now() },
    ]);
    setInputText("");
    setIsTyping(true);

    try {
      const reply = await callAPI(text);
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

  const quickPrompts = [
    "👋 ทักทาย",
    "📋 สรุปให้หน่อย",
    "❓ ช่วยอธิบาย",
    "💡 ให้ตัวอย่าง",
  ];

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

      <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">

        {/* ── LEFT: Chat Panel ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Header */}
          <div className="bg-green-500 px-4 py-3 flex items-center gap-3 shadow-md">
            <Avatar size="w-10 h-10" text="AI" green />
            <div className="flex-1">
              <p className="text-white font-bold text-base leading-tight">ARIA</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-200 shadow" />
                <span className="text-green-100 text-xs">
                  {isTyping ? "กำลังพิมพ์…" : "ออนไลน์"}
                </span>
              </div>
            </div>
            {/* Icons */}
            <div className="flex items-center gap-3">
              {["📞", "☰"].map((icon) => (
                <button key={icon} className="text-white text-lg opacity-90 hover:opacity-100">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 messages-scroll"
            style={{ background: "#d7e8c8" }}
          >
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

          {/* Bottom quick-emoji bar */}
          <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2 overflow-x-auto">
            {["😊", "👍", "❤️", "😂", "🙏", "🔥", "👋", "✨"].map((e) => (
              <button
                key={e}
                onClick={() => setInputText((t) => t + e)}
                className="text-xl hover:scale-125 transition-transform flex-shrink-0"
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Input Panel ── */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white border-l border-gray-200 shadow-xl">

          {/* Right header */}
          <div className="bg-green-500 px-4 py-3 flex items-center gap-2">
            <span className="text-white text-lg">✏️</span>
            <p className="text-white font-bold text-sm tracking-wide">พิมพ์ข้อความ</p>
          </div>

          {/* Quick prompts */}
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">
              ข้อความด่วน
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => setInputText(q.replace(/^.{2}/, "").trim())}
                  className="text-xs bg-gray-50 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-300 text-gray-600 rounded-xl px-2 py-2 text-left transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 flex flex-col px-3 pt-3 gap-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
              ข้อความของคุณ
            </p>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder={"พิมพ์ข้อความที่นี่…\nEnter เพื่อส่ง, Shift+Enter ขึ้นบรรทัดใหม่"}
              className="flex-1 resize-none bg-gray-50 border border-gray-200 focus:border-green-400 rounded-2xl px-4 py-3 text-sm text-gray-800 leading-relaxed placeholder-gray-300 transition-colors"
            />
          </div>

          {/* Send area */}
          <div className="px-3 pb-4 pt-3 flex flex-col gap-2">
            {/* Char counter */}
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-gray-300">{inputText.length} ตัวอักษร</span>
              <span className="text-xs text-gray-300">Enter ↵ เพื่อส่ง</span>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={isTyping || !inputText.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all
                ${isTyping || !inputText.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 active:scale-95 text-white shadow-md shadow-green-200"
                }`}
            >
              {isTyping ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  กำลังส่ง…
                </>
              ) : (
                <>
                  ส่งข้อความ
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </>
              )}
            </button>

            {/* LINE-style sticker hint */}
            <div className="flex justify-center gap-4 pt-1">
              {[
                { icon: "🖼️", label: "รูปภาพ" },
                { icon: "🎵", label: "ไฟล์" },
                { icon: "😄", label: "สติกเกอร์" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-0.5 opacity-40 hover:opacity-70 transition-opacity"
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-xs text-gray-500">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}