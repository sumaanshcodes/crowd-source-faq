const ChatHeader = () => {
  return (
    <div className="bg-[#14181f] border-b border-gray-700 px-6 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🤖 Yaksha Copilot
        </h1>

        <p className="text-gray-400 mt-1 text-sm">
          AI-powered assistant for FAQs, documentation and community discussions.
        </p>
      </div>

      <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
        ● Online
      </div>
    </div>
  );
};

export default ChatHeader;
