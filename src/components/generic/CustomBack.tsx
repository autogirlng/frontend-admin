import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";

export default function CustomBack() {
  const router = useRouter();
  return (
    <button
      className="flex justify-center items-center py-2"
      onClick={() => router.back()}
    >
      <MoveLeft className="mr-3" />
      Back
    </button>
  );
}
