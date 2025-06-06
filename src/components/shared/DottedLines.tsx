export default function DottedLines() {
  return (
    <svg width="100%" height="12" className="my-6">
      <line
        x1="0"
        y1="6"
        x2="100%"
        y2="6"
        stroke="#D0D5DD"
        strokeWidth="2"
        strokeDasharray="20,10" // First number is dash length, second is gap
      />
    </svg>
  );
}
