"use client";
import { useParams } from "next/navigation";
import { format, parseISO } from 'date-fns';
import {
  useFetchBlogPostComments,
  useFetchSingleBlogContent,
} from "@/lib/hooks/blog/useBlog";
import CustomLoader from "@/components/generic/CustomLoader";
import Link from "next/link";
import { BlogComment, PaginatedResponse } from "@/components/dashboard/blog/types";

const BlogContent = () => {
  const { blogContentId } = useParams();

  const { data, isPending } = useFetchSingleBlogContent(
    blogContentId?.toString() || "",
  );
  const { data: comments } = useFetchBlogPostComments <PaginatedResponse<BlogComment>>(`${blogContentId}`);

  if (isPending) {
    return <CustomLoader />;
  }

  return (
    <>
      <div className="flex justify-end">
        <Link
          href={`/dashboard/blog/edit?blogId=${blogContentId}`}
          className="bg-[#0096FF] text-white hover:bg-[#007ACC] focus:ring-[#007ACC] p-2 px-4 items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
        >
          Edit Post
        </Link>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: data?.content || "",
        }}
        className="prose prose-lg max-w-none tiptap"
      ></div>



      <div className="mt-12 flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Discussion ({comments?.content?.length || 0})
        </h3>
      </div>

      {/* View-Only Comment Feed */}
      <section className="mt-8 space-y-6">
        {comments && comments.content.length > 0 ? (
          comments.content.map((comment) => (
            <div
              key={comment.id}
              className="border-l-4 border-gray-200 pl-6 py-2 hover:border-indigo-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div>
                  <span className="font-bold text-gray-900 block">
                    {comment.authorName || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.authorEmail}
                  </span>
                </div>
                <time className="text-xs text-gray-400">
                  {format(parseISO(comment.createdAt), "MMM dd, yyyy, h:mm a")}
                </time>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm italic">
                "{comment.content}"
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-8">
            No comments yet.
          </p>
        )}
      </section>
    </>
  );
};

export default BlogContent;
