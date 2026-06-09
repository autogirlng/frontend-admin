"use client";

import React, { useState } from "react";
import { Edit, Layers, Trash2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import {
  useApproveBlogContent,
  useDeleteBlogCategory,
  useFetchBlogCategories,
} from "@/lib/hooks/blog/useBlog";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import {
  BLOG_CONTENT_TYPE,
  BLOG_STATUS,
  BlogCategory,
} from "@/components/dashboard/blog/types";
import { CreateCategoryModal } from "@/components/dashboard/blog/CreateCategoryModal";

const Categories = () => {
  const { mutate: approveCategory } = useApproveBlogContent();
  const { mutate: deleteCategory, isPending: deletingCategory } =
    useDeleteBlogCategory();

  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null,
  );
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [approvingCategoryId, setApprovingCategoryId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const {
    data,
    isPending: loadingCategories,
    isFetching,
    isError,
  } = useFetchBlogCategories(currentPage, pageSize);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsOpenCategoryModal(true);
  };

  const handleOpenEditModal = (category: BlogCategory) => {
    setEditingCategory(category);
    setIsOpenCategoryModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenCategoryModal(false);
    setEditingCategory(null);
  };

  const handleApproveCategory = (id: string) => {
    setApprovingCategoryId(id);
    approveCategory(
      {
        contentType: BLOG_CONTENT_TYPE.CATEGORY,
        id,
      },
      {
        onSettled: () => setApprovingCategoryId(""),
      },
    );
  };

  const handleDeleteCategory = () => {
    if (!deletingCategoryId) return;

    deleteCategory(deletingCategoryId, {
      onSettled: () => setDeletingCategoryId(null),
    });
  };

  if (loadingCategories) {
    return <CustomLoader />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-red-400 font-medium p-4 text-center">
          Error loading categories
        </div>
      </div>
    );
  }

  const categories = data?.content ?? [];

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-8 h-8 text-blue-600" />
                Blog Categories
              </h1>
              <p className="text-gray-600">
                Manage, edit, and approve blog post categories.
              </p>
            </div>
            <div>
              <Button className="w-full" onClick={handleOpenCreateModal}>
                Create New Category
              </Button>
            </div>
          </header>

          <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No categories found. Create your first category to get started.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Post Count</th>
                    <th className="px-6 py-4 text-center">Author Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {category.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 text-center italic">
                          {category.postCount}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 text-center italic">
                          {category.authorName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {category.status === BLOG_STATUS.PENDING && (
                            <Button
                              variant="primary"
                              size="sm"
                              isLoading={category.id === approvingCategoryId}
                              onClick={() => handleApproveCategory(category.id)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-auto px-2"
                            onClick={() => handleOpenEditModal(category)}
                            aria-label={`Edit ${category.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="w-auto px-2"
                            onClick={() => setDeletingCategoryId(category.id)}
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={data?.totalPages || 0}
            onPageChange={setCurrentPage}
            isLoading={isFetching}
          />
        </div>

        {isOpenCategoryModal && (
          <CreateCategoryModal
            onClose={handleCloseModal}
            category={editingCategory}
          />
        )}

        {deletingCategoryId && (
          <ActionModal
            title="Delete Category"
            message="Are you sure you want to delete this category? This action cannot be undone."
            actionLabel="Delete"
            variant="danger"
            onClose={() => setDeletingCategoryId(null)}
            onConfirm={handleDeleteCategory}
            isLoading={deletingCategory}
          />
        )}
      </div>
    </>
  );
};

export { Categories };
