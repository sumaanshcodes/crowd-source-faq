type ChatInputProps = {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
};

const ChatInput = ({
  message,
  setMessage,
  onSend,
}: ChatInputProps) => {
  return (
    <div className="flex gap-3 border-t border-gray-700 bg-[#151922] p-4">
      <input
        type="text"
        placeholder="Ask Yaksha Copilot anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
        className="flex-1 rounded-lg bg-[#252b36] border border-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <button
        onClick={onSend}
        className="bg-orange-500 hover:bg-orange-600 px-6 rounded-lg font-semibold transition"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;