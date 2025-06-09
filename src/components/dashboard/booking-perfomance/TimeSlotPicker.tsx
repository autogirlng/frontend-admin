import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotPicker = ({
  timeSlots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {timeSlots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => slot.available && onSelectSlot(slot.id)}
          disabled={!slot.available}
          className={cn(
            "py-3 px-4 rounded-lg text-sm font-medium text-center transition-colors",
            slot.available
              ? "hover:bg-blue-50 border-2"
              : "bg-gray-50 text-gray-400 cursor-not-allowed",
            selectedSlot === slot.id
              ? "bg-blue-50 text-blue-700 border-blue-400 border-2"
              : slot.available
              ? "border-gray-200 text-gray-700"
              : "border-gray-100"
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;
