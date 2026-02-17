import { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Code,
} from "lucide-react";

export function BubbleToolbar({ editor }: { editor: Editor }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateToolbar = () => {
      const { from, to } = editor.state.selection;
      if (from === to) return setShow(false);

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return setShow(false);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setPosition({
        top: rect.top + window.scrollY - 48,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setShow(true);
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("blur", () => setShow(false));
    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("blur", () => setShow(false));
    };
  }, [editor]);

  const setLink = () => {
    const url = window.prompt("URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  if (!show) return null;

  return (
    <div
      ref={toolbarRef}
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
      className="fixed z-50 flex items-center gap-1 bg-gray-900 text-white rounded-lg px-2 py-1 shadow-xl"
    >
      {[
        {
          icon: Bold,
          action: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive("bold"),
        },
        {
          icon: Italic,
          action: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive("italic"),
        },
        {
          icon: Underline,
          action: () => editor.chain().focus().toggleUnderline().run(),
          active: editor.isActive("underline"),
        },
        {
          icon: Strikethrough,
          action: () => editor.chain().focus().toggleStrike().run(),
          active: editor.isActive("strike"),
        },
        {
          icon: Code,
          action: () => editor.chain().focus().toggleCode().run(),
          active: editor.isActive("code"),
        },
      ].map(({ icon: Icon, action, active }, i) => (
        <button
          key={i}
          onMouseDown={(e) => {
            e.preventDefault();
            action();
          }}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${active ? "bg-gray-700" : ""}`}
        >
          <Icon size={14} />
        </button>
      ))}
      <div className="w-px h-4 bg-gray-600 mx-1" />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setLink();
        }}
        className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive("link") ? "bg-gray-700" : ""}`}
      >
        <Link size={14} />
      </button>
    </div>
  );
}
