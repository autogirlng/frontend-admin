import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import React from "react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (attrs: {
        src: string;
        alt?: string;
        [key: string]: any;
      }) => ReturnType;
    };
  }
}

function ImageNodeView({ node, selected }: any) {
  return (
    <NodeViewWrapper as="span" className="inline-block">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        className={`max-w-full transition-all duration-150 ${
          selected ? "ring-2 ring-blue-500 ring-offset-2 rounded-sm" : ""
        }`}
      />
    </NodeViewWrapper>
  );
}

export const CustomImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      "data-public-id": { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (attrs: { src: string; alt?: string; [key: string]: any }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
