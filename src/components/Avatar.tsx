
export default function Avatar({ size = "w-10 h-10", text = "AI", green = false }) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
        green
          ? "bg-[#9EDDFF] text-white"
          : "bg-white border-2 border-[#9EDDFF] text-[#9EDDFF]"
      }`}
    >
      {text}
    </div>
  );
}