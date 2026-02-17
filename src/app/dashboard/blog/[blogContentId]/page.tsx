"use client";
import { useParams } from "next/navigation";

import {
  useFetchBlogPostComments,
  useFetchSingleBlogContent,
} from "@/lib/hooks/blog/useBlog";

const BlogContent = () => {
  const { blogContentId } = useParams();

  const { data } = useFetchSingleBlogContent(blogContentId?.toString() || "");
  const { data: comments } = useFetchBlogPostComments(`${blogContentId}`);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: data?.content || "",
        }}
        className="prose prose-lg max-w-none tiptap"
      ></div>

      {/*<div className="mt-8 flex items-center gap-4 text-gray-600 border-b pb-4">
        <div className="flex items-center gap-1">
          <span className="text-red-500">❤️</span>
          <span className="font-medium">{data?.likesCount || 0} Likes</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💬</span>
          <span className="font-medium">
            {data?.comments?.length || 0} Comments
          </span>
        </div>
      </div>*/}

      {/* --- View-Only Comment Feed --- */}
      <section className="mt-6 space-y-8">
        {/*{
          data?.comments?.length > 0 ? (
          data.comments.map((comment) => (
            <div key={comment.id} className="group">
              <div className="flex gap-4">

                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                  {comment.author?.[0] || "?"}
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}*/}
      </section>
    </>
  );
};

export default BlogContent;
