"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Toaster } from "react-hot-toast";

import {
  useApproveBlogContent,
  useFetchBlogContents,
} from "@/lib/hooks/blog/useBlog";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import {
  BLOG_CONTENT_TYPE,
  BLOG_STATUS,
  BlogCategory,
  PaginatedResponse,
} from "@/components/dashboard/blog/types";
import { CreateCategoryModal } from "@/components/dashboard/blog/CreateCategoryModal";

const Categories = () => {
  const { mutate } = useApproveBlogContent();
  const [isOpenCategoryModal, setIsOpenCategoryModal] =
    useState<boolean>(false);

  const { data, isPending: loadingCategories } = useFetchBlogContents<
    PaginatedResponse<BlogCategory>
  >(BLOG_CONTENT_TYPE.CATEGORY);
  const [approvingCategoryId, setApprovingCategoryId] = useState<string>("");

  const approveCategory = (id: string) => {
    setApprovingCategoryId(id);
    const contentType = BLOG_CONTENT_TYPE.CATEGORY;
    mutate(
      {
        contentType,
        id,
      },
      {
        onSettled: () => setApprovingCategoryId(""),
      },
    );
  };

  if (loadingCategories) {
    return <CustomLoader />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                Categories Moderation
              </h1>
              <p className="text-gray-600">
                Review and approve reader feedback.
              </p>
            </div>
            <div>
              <Button
                className=" w-full"
                onClick={() => setIsOpenCategoryModal(true)}
              >
                {" "}
                Create New Category
              </Button>
            </div>
          </header>

          <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Post Count</th>
                  <th className="px-6 py-4 text-right">Author Name</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.content.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {category.name}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm text-gray-600 italic">
                        {category.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          category.status === BLOG_STATUS.APPROVED
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td>
                      <p className="text-sm text-gray-600  text-center italic">
                        {category.postCount}
                      </p>
                    </td>

                    <td>
                      <p className="text-sm text-gray-600  text-center italic">
                        {category.authorName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {category.status === BLOG_STATUS.PENDING && (
                        <Button
                          variant="primary"
                          isLoading={category.id === approvingCategoryId}
                          onClick={() => approveCategory(category.id)}
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

        {isOpenCategoryModal && (
          <CreateCategoryModal onClose={() => setIsOpenCategoryModal(false)} />
        )}
      </div>
    </>
  );
};

export { Categories };
