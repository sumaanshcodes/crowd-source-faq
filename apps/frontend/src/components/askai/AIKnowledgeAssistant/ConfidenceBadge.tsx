type ConfidenceBadgeProps = {
  confidence: number;
};

const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  const color =
    confidence >= 90
      ? "bg-green-100 text-green-700"
      : confidence >= 70
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      🟢 Confidence: {confidence}%
    </div>
  );
};

export default ConfidenceBadge;