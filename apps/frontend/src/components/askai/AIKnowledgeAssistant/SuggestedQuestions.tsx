type SuggestedQuestionsProps = {
  onSelect: (question: string) => void;
};

const questions = [
  "How do I submit my project?",
  "How do I create a GitHub PR?",
  "What does my mentor expect?",
  "How do I contribute to CSFAQ?",
];

const SuggestedQuestions = ({
  onSelect,
}: SuggestedQuestionsProps) => {
  return (
    <div className="bg-[#1a1f29] rounded-xl p-5 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        💡 Suggested Questions
      </h2>

      <div className="flex flex-col gap-3">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="text-left bg-[#252b36] hover:bg-indigo-600 transition rounded-lg px-4 py-3"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
