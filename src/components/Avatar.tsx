
export default function Avatar({ size = "w-10 h-10", text = "AI", green = false }) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
        green
          ? "bg-green-500 text-white"
          : "bg-white border-2 border-green-400 text-green-500"
      }`}
    >
      {text}
    </div>
  );
}