"use client";

import React, { useState, useRef, useCallback } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Toolbar } from "./Toolbar";
import { BubbleToolbar } from "./BubbleToolbar";
import { useCreateBlogContent } from "@/lib/hooks/blog/useBlog";
import { useUploadImage } from "@/lib/hooks/blog/useBlog";
import { SubmitBlogContentModal } from "./SubmitBlogContentModal";
import UnderlineExt from "@tiptap/extension-underline";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { RichTextEditorProps } from "./types";
import Button from "@/components/generic/ui/Button";
import { Toaster } from "react-hot-toast";

const lowlight = createLowlight(common);

export function Editor({
  content = "",
  onChange,
  placeholder = "Write something amazing…",
  editable = true,
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState({ chars: 0, words: 0 });
  const [html, setHTML] = useState<string>("");
  const [isBlogSubmitModalOpen, setIsBlogSubmitModalOpen] =
    useState<boolean>(false);
  const { mutate } = useCreateBlogContent();

  const { uploadImage, isUploading } = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder }),
      UnderlineExt,
      LinkExt.configure({ openOnClick: false, autolink: true }),
      ImageExt.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Typography,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      const text = editor.state.doc.textContent;
      setEditorState({
        chars: text.length,
        words: text.trim() === "" ? 0 : text.trim().split(/\s+/).length,
      });
      setHTML(editor.getHTML());
      onChange?.(editor.getHTML(), editor.getJSON());
    },
  });

  // Called when the user picks a file from the OS dialog
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";

      if (!file || !editor) return;
      editor
        .chain()
        .focus()
        .insertContent(`<p><em>⏳ Uploading image…</em></p>`)
        .run();

      const result = await uploadImage(file);

      if (result) {
        editor
          .chain()
          .focus()
          .undo() // removes the placeholder
          .setImage({
            src: result.url,
            alt: file.name,
            "data-public-id": result.publicId,
          } as any)
          .run();
      } else {
        // Remove the placeholder on failure
        editor.chain().focus().undo().run();
      }
    },
    [editor, uploadImage],
  );

  if (!editor) return null;

  return (
    <>
      <Toaster position="top-right" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <Toolbar
          editor={editor}
          onImageUpload={() => fileInputRef.current?.click()}
          isUploadingImage={isUploading}
        />
        <BubbleToolbar editor={editor} />

        <EditorContent
          editor={editor}
          className="min-h-[1000px] px-8 py-6 prose prose-lg max-w-none focus:outline-none"
        />

        {/* Footer stats */}
        <div className="flex items-center justify-between px-6 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          <span>
            {editorState.words} words · {editorState.chars} characters
          </span>
        </div>
      </div>

      <div className="flex justify-end ">
        <Button
          onClick={() => setIsBlogSubmitModalOpen(true)}
          className="mt-3"
          disabled={html.length === 0}
        >
          Submit
        </Button>
      </div>

      {isBlogSubmitModalOpen && (
        <SubmitBlogContentModal
          blogHTML={html}
          onClose={() => setIsBlogSubmitModalOpen(false)}
        />
      )}
    </>
  );
}

export default Editor;
