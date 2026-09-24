import { Message } from "@/types/message";

export default function MessageBubble({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string;
}) {
  const mine =
    message.sender._id === currentUserId;

  return (
    <div
      className={`flex ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          mine
            ? "bg-[#1d9bf0] text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}