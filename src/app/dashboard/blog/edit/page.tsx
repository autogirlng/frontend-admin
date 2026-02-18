"use client";

import { Editor } from "@/components/dashboard/blog/Editor";
import CustomLoader from "@/components/generic/CustomLoader";
import { Suspense } from "react";

const BlogEditPage = () => {
  return (
    <>
      <Suspense fallback={<CustomLoader />}>
        <Editor />
      </Suspense>
    </>
  );
};

export default BlogEditPage;
