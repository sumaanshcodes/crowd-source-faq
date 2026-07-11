type MessageBubbleProps = {
  sender: "user" | "assistant";
  message: string;
};

const MessageBubble = ({ sender, message }: MessageBubbleProps) => {
  const isUser = sender === "user";

  return (
    <div className={`flex mb-5 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-orange-500 text-white"
            : "bg-[#1d232d] text-gray-200 border border-gray-700"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
};

export default MessageBubble;