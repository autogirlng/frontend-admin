"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import DottedLines from "@/components/shared/DottedLines";

interface Note {
  id: number;
  content: string;
  author: string;
  date: string;
}

interface RejectionNotesProps {
  rejectionReasons?: string[];
  notes?: Note[];
  onAddNote?: (note: string) => void;
}

const RejectionNotes: React.FC<RejectionNotesProps> = ({
  rejectionReasons = [
    "I want a child seat to be provided with the vehicle.",
    "There is no need for a GPS navigation system.",
    "No additional driver will be needed in this booking.",
  ],
  notes = [
    {
      id: 1,
      content:
        "Passenger is pregnant. Let's keep the ride calm and comfy. No sharp turns.",
      author: "Ebuka Arinze",
      date: "Tuesday 5th June 2025",
    },
    {
      id: 2,
      content:
        "Passenger is pregnant. Let's keep the ride calm and comfy. No sharp turns.",
      author: "Ebuka Arinze",
      date: "Tuesday 5th June 2025",
    },
  ],
  onAddNote,
}) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim());
      setNewNote("");
      setShowAddNote(false);
    }
  };

  return (
    <div className="bg-white pb-8 text-sm">
      <DottedLines />
      {/* Rejection Reasons */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-sm font-medium text-[#344054] tracking-wide">
            REJECTION REASONS
          </h2>
          <span className="px-3 py-1 bg-[#FFF8EB] text-[#B73C06] text-xs font-medium rounded">
            Escalated To Support
          </span>
        </div>

        <ul className="space-y-3">
          {rejectionReasons.map((reason, index) => (
            <li key={index} className="flex items-start">
              <span className="text-sm text-[#667185] mr-3 mt-0.5">•</span>
              <span className="text-sm text-[#667185]">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <DottedLines />

      {/* Notes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-[#344054] tracking-wide">
            Notes
          </h2>
          <button
            onClick={() => setShowAddNote(true)}
            className="flex items-center gap-2 text-primary-600 text-sm font-medium hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>

        {/* Add Note Form */}
        {showAddNote && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add your note here..."
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
              >
                Add Note
              </button>
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-[#F7F9FC] p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-900 leading-relaxed flex-1 mr-4">
                  {note.content}
                </p>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {note.author}
                  </div>
                  <div className="text-xs text-gray-500">{note.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DottedLines />
      </div>
    </div>
  );
};

export default RejectionNotes;
