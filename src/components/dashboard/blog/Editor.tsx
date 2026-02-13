"use client";

import React, { useEffect, useRef } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Code,
} from "lucide-react";

import { useState } from "react";

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
  Youtube,
  Table,
  Quote,
  Minus,
  CheckSquare,
  Subscript,
  Superscript,
  Highlighter,
  Undo,
  Redo,
} from "lucide-react";

type ToolbarSection = {
  tools: ToolbarItem[];
};

type ToolbarItem = {
  icon: React.ElementType;
  action: () => void;
  active?: boolean;
  title: string;
};

import CharacterCount from "@tiptap/extension-character-count";
import UnderlineExt from "@tiptap/extension-underline";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string, json: object) => void;
  placeholder?: string;
  characterLimit?: number;
  editable?: boolean;
}

export function Editor({
  content = "",
  onChange,
  placeholder = "Write something amazing…",
  characterLimit = 10000,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: characterLimit }),
      UnderlineExt,
      LinkExt.configure({ openOnClick: false, autolink: true }),
      ImageExt.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Typography,
      // Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      // Youtube.configure({ controls: true, nocookie: true }),
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor.getJSON());
    },
  });

  if (!editor) return null;

  const charCount = editor.storage.characterCount.characters();
  const wordCount = editor.storage.characterCount.words();

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <Toolbar editor={editor} />
      <BubbleToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="min-h-[500px] px-8 py-6 prose prose-lg max-w-none focus:outline-none"
      />

      {/* Footer stats */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
        <span>
          {wordCount} words · {charCount} characters
        </span>
        <span>{characterLimit - charCount} characters remaining</span>
      </div>
    </div>
  );
}

export function Toolbar({ editor }: { editor: any }) {
  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
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
        { icon: Image, action: addImage, title: "Image" },
        { icon: Youtube, action: addYoutube, title: "YouTube" },
        { icon: Table, action: addTable, title: "Table" },
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
    </div>
  );
}

export function BubbleToolbar({ editor }: { editor: any }) {
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
export const SlashCommand = Extension.create({
  name: "slashCommand",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

const MenuBar = ({ editor }: { editor: any | null }) => {
  if (!editor) return null;

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        Italic
      </button>
    </div>
  );
};

const RichEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, // required for Next.js SSR compatibility
  });

  return (
    <>
      <div className="editor-container">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Editor;
