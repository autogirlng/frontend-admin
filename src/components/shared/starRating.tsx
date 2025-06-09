import Icons from "./icons";
import cn from "classnames";

export default function StarRating({
  n,
  size,
  gap,
}: {
  n: number;
  size?: string;
  gap?: string;
}) {
  const maxStars = 5;

  const numFilledStars = Math.min(n, maxStars);
  const numEmptyStars = maxStars - numFilledStars;

  const stars = [
    ...Array(numFilledStars).fill(Icons.ic_star_filled),
    ...Array(numEmptyStars).fill(Icons.ic_star_empty),
  ];

  return (
    <div className={cn("flex items-center gap-2", gap)}>
      {stars.map((star, index) => (
        <span key={index} className={cn(size ?? "")}>
          {star}
        </span>
      ))}
    </div>
  );
}
