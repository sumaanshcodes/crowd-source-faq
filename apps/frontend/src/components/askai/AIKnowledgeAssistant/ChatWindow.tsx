import MessageBubble from "./MessageBubble";

export type ChatMessage = {
  id: number;
  sender: "user" | "assistant";
  message: string;
};

type ChatWindowProps = {
  messages: ChatMessage[];
};

const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <div className="bg-[#10141b] p-6 h-[520px] overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          sender={msg.sender}
          message={msg.message}
        />
      ))}
    </div>
  );
};

export default ChatWindow;