import { useState, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import ChatWindow, { ChatMessage } from "./ChatWindow";
import ChatInput from "./ChatInput";
import ConfidenceBadge from "./ConfidenceBadge";
import RelatedFAQs from "./RelatedFAQs";
import SuggestedQuestions from "./SuggestedQuestions";

const AIKnowledgeAssistant = () => {
  const [message, setMessage] = useState("");
  const [confidence, setConfidence] = useState(92);
  const [isTyping, setIsTyping] = useState(false);

  const [relatedFAQs, setRelatedFAQs] = useState([
    "Project Submission Guide",
    "GitHub Contribution",
    "Community Guidelines",
  ]);

  const [sources, setSources] = useState([
    "README.md",
    "Product.md",
    "Contribution Guide",
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "assistant",
      message:
        "👋 Welcome! I'm Yaksha Copilot. Ask me anything about internships, FAQs, documentation or the community.",
    },
  ]);
  const getConfidence = (question: string) => {
  const q = question.toLowerCase();

  if (q.includes("submit")) return 98;
  if (q.includes("github")) return 96;
  if (q.includes("mentor")) return 94;
  if (q.includes("pr")) return 95;
  if (q.includes("documentation")) return 90;
  if (q.includes("faq")) return 89;

  return Math.floor(Math.random() * 16) + 75;
  };
  

  const getAIResponse = (question: string) => {
    const q = question.toLowerCase();

    if (q.includes("submit")) {
      setRelatedFAQs([
        "Submission Checklist",
        "Project Video Guide",
        "Deadline Information",
      ]);

      setSources([
        "README.md",
        "Submission.md",
        "Product.md",
      ]);

      return "Submit your GitHub repository, Product.md and project demo video before the deadline using your dashboard.";
    }

    if (q.includes("github")) {
      setRelatedFAQs([
        "Fork Repository",
        "Branch Strategy",
        "Opening Pull Requests",
      ]);

      setSources([
        "CONTRIBUTING.md",
        "GitHub Docs",
        "README.md",
      ]);

      return "Fork the repository, create a feature branch, commit your work, push the branch and finally create a Pull Request.";
    }

    if (q.includes("mentor")) {
      setRelatedFAQs([
        "Open Source Workflow",
        "Contribution Guide",
        "Feature Development",
      ]);

      setSources([
        "Mentor Notes",
        "Contribution Guide",
        "README.md",
      ]);

      return "Your mentor expects meaningful feature contributions without affecting existing modules.";
    }

    if (q.includes("pr") || q.includes("pull request")) {
      setRelatedFAQs([
        "PR Checklist",
        "Branch Naming",
        "Git Workflow",
      ]);

      setSources([
        "CONTRIBUTING.md",
        "GitHub",
        "README.md",
      ]);

      return "After testing your feature, push your branch and open a Pull Request explaining your implementation.";
    }

    setRelatedFAQs([
      "Frequently Asked Questions",
      "Community Support",
      "Knowledge Base",
    ]);

    setSources([
      "Knowledge Base",
      "FAQ",
      "README.md",
    ]);

    return "I couldn't find an exact answer. Try asking about GitHub, project submission, mentors or pull requests.";
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const userQuestion = message;
    setConfidence(getConfidence(userQuestion));
    setIsTyping(true);

    setMessage("");

    setTimeout(() => {

      const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: "assistant",
      message: getAIResponse(userQuestion),
      };

    setMessages((prev) => [...prev, aiMessage]);

    setIsTyping(false);

    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto bg-[#151922] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">

        <ChatHeader />

        <div className="grid grid-cols-12">

          {/* Left Side */}

          <div className="col-span-8 border-r border-gray-800 flex flex-col">

            <ChatWindow messages={messages} />
            {isTyping && (
              <div className="px-6 py-2 text-yellow-400 italic animate-pulse">
                Yaksha Copilot is typing...
              </div>
            )}


            <div className="px-6 py-4 border-t border-gray-800 bg-[#151922]">
              <ConfidenceBadge confidence={confidence} />
            </div>

            <div className="bg-[#151922]">
              <ChatInput
                message={message}
                setMessage={setMessage}
                onSend={handleSend}
              />
            </div>

          </div>

          {/* Right Side */}

          <div className="col-span-4 bg-[#11151d] p-6 space-y-6">

            <RelatedFAQs relatedFAQs={relatedFAQs} />
            <SuggestedQuestions
              onSelect={(question) => {
                setMessage(question);
              }}
            />

            <div className="bg-[#1a1f29] rounded-xl p-5 border border-gray-700">

              <h2 className="text-lg font-semibold mb-4">
                📊 AI Insights
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Confidence
                  </span>

                  <span className="text-green-400 font-semibold">
                    92%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Sources
                  </span>

                  <span>3</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Response Time
                  </span>

                  <span className="text-blue-400">
                    0.8 sec
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AIKnowledgeAssistant;