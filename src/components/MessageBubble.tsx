import Avatar from "./Avatar";
import type { Message } from "../interfaces";

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div className="flex flex-row-reverse items-end gap-2 mb-3">
        <div className="flex flex-col items-end gap-1 max-w-xs">
          <div className="bg-white text-black border border-black text-sm px-4 py-2.5 rounded-2xl leading-relaxed">
            {msg.text}
          </div>
          <span className="text-xs text-gray-400 pr-1">{time}</span>
        </div>
      </div>
    );
  }


  return (
    <div className="flex items-end gap-2 mb-3">
      <Avatar size="w-8 h-8" text="AI" />
      <div className="flex flex-col gap-1 max-w-xs">
        <span className="text-xs text-gray-500 pl-1 font-medium">AI</span>
        <div className="bg-[#9EDDFF] text-white text-sm px-4 py-2.5 rounded-2xl leading-relaxed border border-black whitespace-pre-line">
          {msg.text}
        </div>
        <span className="text-xs text-gray-400 pl-1">{time}</span>
      </div>
    </div>
  );
}