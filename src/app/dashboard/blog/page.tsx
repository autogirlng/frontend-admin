"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import edjsHTML from "editorjs-html";
import { Editor } from "@/components/dashboard/blog/Editor";

export default function BlogPage() {
  return (
    <>
      <Editor />
    </>
  );
}
