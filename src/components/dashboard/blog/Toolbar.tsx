import React from "react";
import { Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Code,
} from "lucide-react";

import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
  ImageUp,
  Quote,
  Minus,
  CheckSquare,
  Subscript,
  Superscript,
  Highlighter,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";
import { ToolbarSection } from "./types";

export function Toolbar({
  editor,
  onImageUpload,
  isUploadingImage,
}: {
  editor: Editor;
  onImageUpload?: () => void;
  isUploadingImage?: boolean;
}) {
  const setLink = () => {
    const url = window.prompt("URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const sections: ToolbarSection[] = [
    {
      tools: [
        {
          icon: Undo,
          action: () => editor.chain().focus().undo().run(),
          title: "Undo",
        },
        {
          icon: Redo,
          action: () => editor.chain().focus().redo().run(),
          title: "Redo",
        },
      ],
    },
    {
      tools: [
        {
          icon: Heading1,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          active: editor.isActive("heading", { level: 1 }),
          title: "H1",
        },
        {
          icon: Heading2,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: editor.isActive("heading", { level: 2 }),
          title: "H2",
        },
        {
          icon: Heading3,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          active: editor.isActive("heading", { level: 3 }),
          title: "H3",
        },
      ],
    },
    {
      tools: [
        {
          icon: Bold,
          action: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive("bold"),
          title: "Bold",
        },
        {
          icon: Italic,
          action: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive("italic"),
          title: "Italic",
        },
        {
          icon: Underline,
          action: () => editor.chain().focus().toggleUnderline().run(),
          active: editor.isActive("underline"),
          title: "Underline",
        },
        {
          icon: Strikethrough,
          action: () => editor.chain().focus().toggleStrike().run(),
          active: editor.isActive("strike"),
          title: "Strikethrough",
        },
        {
          icon: Highlighter,
          action: () => editor.chain().focus().toggleHighlight().run(),
          active: editor.isActive("highlight"),
          title: "Highlight",
        },
        {
          icon: Subscript,
          action: () => editor.chain().focus().toggleSubscript().run(),
          active: editor.isActive("subscript"),
          title: "Subscript",
        },
        {
          icon: Superscript,
          action: () => editor.chain().focus().toggleSuperscript().run(),
          active: editor.isActive("superscript"),
          title: "Superscript",
        },
      ],
    },
    {
      tools: [
        {
          icon: AlignLeft,
          action: () => editor.chain().focus().setTextAlign("left").run(),
          active: editor.isActive({ textAlign: "left" }),
          title: "Align Left",
        },
        {
          icon: AlignCenter,
          action: () => editor.chain().focus().setTextAlign("center").run(),
          active: editor.isActive({ textAlign: "center" }),
          title: "Align Center",
        },
        {
          icon: AlignRight,
          action: () => editor.chain().focus().setTextAlign("right").run(),
          active: editor.isActive({ textAlign: "right" }),
          title: "Align Right",
        },
        {
          icon: AlignJustify,
          action: () => editor.chain().focus().setTextAlign("justify").run(),
          active: editor.isActive({ textAlign: "justify" }),
          title: "Justify",
        },
      ],
    },
    {
      tools: [
        {
          icon: List,
          action: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive("bulletList"),
          title: "Bullet List",
        },
        {
          icon: ListOrdered,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          active: editor.isActive("orderedList"),
          title: "Ordered List",
        },
        {
          icon: CheckSquare,
          action: () => editor.chain().focus().toggleTaskList().run(),
          active: editor.isActive("taskList"),
          title: "Task List",
        },
      ],
    },
    {
      tools: [
        {
          icon: Quote,
          action: () => editor.chain().focus().toggleBlockquote().run(),
          active: editor.isActive("blockquote"),
          title: "Blockquote",
        },
        {
          icon: Code,
          action: () => editor.chain().focus().toggleCode().run(),
          active: editor.isActive("code"),
          title: "Inline Code",
        },
        {
          icon: Code2,
          action: () => editor.chain().focus().toggleCodeBlock().run(),
          active: editor.isActive("codeBlock"),
          title: "Code Block",
        },
        {
          icon: Minus,
          action: () => editor.chain().focus().setHorizontalRule().run(),
          title: "Divider",
        },
      ],
    },
    {
      tools: [
        {
          icon: Link,
          action: setLink,
          active: editor.isActive("link"),
          title: "Link",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-white sticky top-0 z-10">
      {sections.map((section, si) => (
        <div key={si} className="flex items-center gap-0.5">
          {section.tools.map(({ icon: Icon, action, active, title }) => (
            <button
              key={title}
              onClick={action}
              title={title}
              className={`p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-700
                ${active ? "bg-gray-200 text-gray-900" : ""}`}
            >
              <Icon size={16} />
            </button>
          ))}
          {si < sections.length - 1 && (
            <div className="w-px h-5 bg-gray-200 mx-1" />
          )}
        </div>
      ))}

      {/* Divider before image upload button */}
      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Image upload button — rendered separately to support loading state */}
      <button
        onClick={onImageUpload}
        disabled={isUploadingImage}
        title={isUploadingImage ? "Uploading…" : "Upload Image"}
        className={`p-1.5 rounded transition-colors
          ${
            isUploadingImage
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        {isUploadingImage ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ImageUp size={16} />
        )}
      </button>
    </div>
  );
}
