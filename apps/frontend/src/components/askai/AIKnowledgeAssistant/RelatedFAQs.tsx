type RelatedFAQsProps = {
  relatedFAQs: string[];
};

const RelatedFAQs = ({ relatedFAQs }: RelatedFAQsProps) => {
  return (
    <div className="bg-[#1a1f29] rounded-xl p-5 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        📚 Related Knowledge
      </h2>

      <div className="space-y-3">
        {relatedFAQs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#252b36] hover:bg-[#303847] cursor-pointer transition rounded-lg px-4 py-3"
          >
            {faq}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedFAQs;
