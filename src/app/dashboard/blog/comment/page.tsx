"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, MessageSquare } from "lucide-react";
import {
  BLOG_CONTENT_TYPE,
  BLOG_STATUS,
  BlogComment,
  useApproveBlogContent,
  useFetchBlogContents,
} from "@/lib/hooks/blog/useBlog";
import { PaginatedResponse } from "@/lib/hooks/blog/useBlog";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";

export default function Comments() {
  const { mutate, isPending } = useApproveBlogContent();

  const { data, isPending: loadingComments } = useFetchBlogContents<
    PaginatedResponse<BlogComment>
  >(BLOG_CONTENT_TYPE.COMMENT);

  const approveComment = (id: string) => {
    const contentType = BLOG_CONTENT_TYPE.COMMENT;
    mutate({
      contentType,
      id,
    });
  };

  if (loadingComments) {
    return <CustomLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Comment Moderation
          </h1>
          <p className="text-gray-600">Review and approve reader feedback.</p>
        </header>

        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Author & Comment</th>
                <th className="px-6 py-4">Blog Post</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.content.map((comment) => (
                <tr
                  key={comment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {comment.authorName}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {comment.content}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/blog/${comment.post.id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium"
                    >
                      {comment.post.title}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        comment.status === BLOG_STATUS.APPROVED
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {comment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {comment.status === BLOG_STATUS.PENDING && (
                      <Button
                        variant="primary"
                        isLoading={isPending}
                        onClick={() => approveComment(comment.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
