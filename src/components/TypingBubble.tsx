import Avatar from "./Avatar";

export default function TypingBubble() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <Avatar size="w-8 h-8" text="AI" />
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full inline-block"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}