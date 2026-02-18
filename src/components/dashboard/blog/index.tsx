"use client";
import React, { useState } from "react";
import { BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BLOG_CONTENT_TYPE,
  ModeratedBlogPostContent,
  BLOG_STATUS,
  ModeratedBlogPost,
} from "@/components/dashboard/blog/types";
import { useFetchBlogContents } from "@/lib/hooks/blog/useBlog";
import CustomLoader from "@/components/generic/CustomLoader";
import { format } from "date-fns";
import { UpdateBlogStatusModal } from "@/components/dashboard/blog/UpdateBlogStatus";
import { Toaster } from "react-hot-toast";

const Blog = () => {
  const router = useRouter();
  const [approvalModal, setApprovalModal] = useState<string>("");

  const { data, isPending, isError } = useFetchBlogContents<ModeratedBlogPost>(
    BLOG_CONTENT_TYPE.POST,
  );

  if (isPending) return <CustomLoader />;

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-red-400 font-medium p-4 text-center">
          Error loading blog posts
        </div>
      </div>
    );
  }
  const statusStyles = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
    DRAFT: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const selectArticle = (content: ModeratedBlogPostContent) => {
    if (content.status !== BLOG_STATUS.APPROVED) {
      setApprovalModal(content.id);
    } else {
      router.push(`/dashboard/blog/${content.id}`);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Manage Posts
              </h1>
              <p className="text-gray-500 mt-2">
                Create, edit, and share your thoughts.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Stories
              </h2>
              {data?.content?.map((post) => {
                const formattedCreatedAtDate = format(
                  new Date(post.createdAt),
                  "MMM dd, yyyy",
                );
                return (
                  <article
                    key={post.id}
                    onClick={() => selectArticle(post)}
                    className="group bg-white p-6  border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="text-sm text-gray-400 font-medium flex flex-row justify-between">
                      <span>Published on {formattedCreatedAtDate}</span>
                      <span
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                          ${statusStyles[post.status as keyof typeof statusStyles] || statusStyles.DRAFT}
                        `}
                      >
                        {/* Dynamic Dot */}
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {post.status}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="space-y-6">
              <div className="bg-indigo-900 text-white p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <BookOpenIcon className="mb-4 opacity-80" size={32} />
                  <h3 className="text-xl font-bold mb-2">Ready to write?</h3>
                  <p className="text-indigo-200 text-sm mb-6">
                    Your audience is waiting for your next big insight.
                  </p>
                  <Link
                    href={"/dashboard/blog/edit"}
                    className="w-full bg-white text-indigo-900 py-3 px-3 font-bold hover:bg-indigo-50 transition-colors"
                  >
                    Open Editor
                  </Link>
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-800 rounded-full opacity-50" />
              </div>

              <Link
                href="/dashboard/blog/comment"
                className="w-full bg-[#0096FF]  hover:bg-[#007ACC] focus:ring-[#007ACC] block text-center text-white py-2 rounded"
              >
                View Comments
              </Link>

              <Link
                href="/dashboard/blog/categories"
                className="w-full bg-[#0096FF] hover:bg-[#007ACC] focus:ring-[#007ACC] block text-center text-white py-2 rounded"
              >
                View Categories
              </Link>
            </aside>
          </div>
        </div>
        {approvalModal && (
          <UpdateBlogStatusModal
            onClose={() => setApprovalModal("")}
            id={approvalModal}
            contentType={BLOG_CONTENT_TYPE.POST}
          />
        )}
      </div>
    </>
  );
};

export { Blog };
