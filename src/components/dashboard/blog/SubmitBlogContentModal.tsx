"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Layers, UploadCloud } from "lucide-react";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { useGetMyProfile } from "@/lib/hooks/profile/useProfile";
import { BlogPost } from "./types";
import {
  useCreateBlogContent,
  useFetchBlogCategories,
  useUpdateBlogContent,
} from "@/lib/hooks/blog/useBlog";
import clsx from "clsx";
import { FilePreviewThumbnail } from "@/components/generic/ui/FilePreviewThumbnail";
import { uploadToCloudinary } from "@/components/dashboard/finance/payments/utils";
import { CreateBlogPostPayload } from "./types";

interface SubmitBlogContentModalProps {
  onClose: () => void;
  consolidatedInvoiceId?: string;
  customerName?: string;
  blogHTML: string;
  postContent?: BlogPost;
  update?: boolean;
}

export function SubmitBlogContentModal({
  onClose,
  blogHTML,
  postContent,
  update,
}: SubmitBlogContentModalProps) {
  const { data: myProfile, isPending } = useGetMyProfile();
  const { mutate: createBlog, isPending: creatingBlogPost } =
    useCreateBlogContent();
  const { mutate: updateBlog, isPending: updatingBlogPost } =
    useUpdateBlogContent(postContent?.id || "");
  const router = useRouter();

  const { data: categories } = useFetchBlogCategories();

  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [blogCategory, setBlogCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");

  const [globalFile, setGlobalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (postContent) {
      setTitle(postContent.title);
      setExcerpt(postContent.excerpt);
      setBlogCategory(postContent.blogCategory.id);
      setSlug(postContent.slug ?? "");
      setTags(postContent.tags);
      setCoverImageUrl(postContent.coverImage || "");
    }
  }, [postContent]);

  const handleSubmit = async () => {
    try {
      const blogData: CreateBlogPostPayload = {
        title: title,
        approvalRef: postContent?.approvalRef,
        content: blogHTML,
        excerpt: excerpt,
        authorName: `${myProfile?.firstName} ${myProfile?.lastName}`,
        authorEmail: myProfile?.email || "",
        authorPhoneNumber: myProfile?.phoneNumber || "",
        blogCategory: {
          id: blogCategory,
        },
        slug:
          slug ||
          title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        tags: tags,
      };
      if (globalFile) {
        setIsUploading(true);

        const uploaded = await uploadToCloudinary(globalFile);
        if (uploaded?.url) {
          blogData.coverImage = uploaded.url;
          blogData.coverImagePublicId = uploaded.publicId;
        }
      }

      if (update) {
        updateBlog(
          {
            ...blogData,
          },
          {
            onSuccess: () => {
              router.push("/dashboard/blog");
            },
          },
        );
      } else {
        createBlog(
          {
            ...blogData,
          },
          {
            onSuccess: () => {
              router.push("/dashboard/blog");
            },
          },
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  };

  if (isPending) {
    return <CustomLoader />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGlobalFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  const removeFile = () => {
    setGlobalFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* --- Header (Fixed) --- */}
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              Submit Blog Content
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Describe key information for your blog content
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            // disabled={createMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
          {/* Sticky Search Bar within body */}

          {/* List Content */}
          <div className="p-4 space-y-2 flex-1">
            {/*<div className="font-bold text-xs  mb-2">FORM: </div>*/}
            <form className="space-y-3">
              {/* Title */}
              <div>
                <TextInput
                  label="Title"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter or comma"
                  className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Excerpt */}
              <div>
                <TextInput
                  label="Excerpt"
                  id="excerpt"
                  name="excerpt"
                  placeholder="Short summary of the blog post"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="blogCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="blogCategory"
                  name="blogCategory"
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories?.content
                    ?.filter((cat) => cat.status === "APPROVED")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Cover Image
                </label>
                <label
                  htmlFor="global-proof-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={clsx(
                    "block border-2 border-dashed p-6 text-center transition-all relative",
                    // If coverImageUrl exists, make it look disabled
                    coverImageUrl
                      ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                      : "cursor-pointer",
                    isDragging ? "border-blue-500 bg-blue-50" : "",
                    globalFile && !isDragging && !coverImageUrl
                      ? "border-green-400 bg-green-50"
                      : !isDragging &&
                          !coverImageUrl &&
                          "border-gray-300 hover:border-blue-500 hover:bg-gray-50",
                  )}
                >
                  <input
                    id="global-proof-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e)}
                    disabled={!!coverImageUrl} // Disabled if coverImageUrl exists
                  />

                  {/* Show different content based on state */}
                  {coverImageUrl ? (
                    // Case 1: There's already a cover image (DISABLED STATE)
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Image
                          src={coverImageUrl}
                          alt="Cover"
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full">
                            Existing
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-500">
                        Cover image already exists
                      </p>
                      <p className="text-xs text-gray-400">
                        Remove existing image to upload new one
                      </p>
                    </div>
                  ) : globalFile ? (
                    // Case 2: New file selected (ENABLED STATE with file)
                    <div className="flex flex-col items-center">
                      <FilePreviewThumbnail
                        file={globalFile}
                        onRemove={() => removeFile()}
                      />
                      <p className="mt-2 text-sm font-medium text-green-700">
                        File Attached
                      </p>
                      <p className="text-xs text-gray-500">{globalFile.name}</p>
                    </div>
                  ) : (
                    // Case 3: No file and no cover image (ENABLED STATE)
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Author Name */}
              <div>
                <TextInput
                  label="Author Name"
                  id="authorName"
                  name="authorName"
                  value={myProfile?.firstName + " " + myProfile?.lastName || ""}
                  disabled={true}
                />
              </div>

              {/* Author Email */}
              <div>
                <TextInput
                  label="Author Email"
                  id="email"
                  name="email"
                  value={myProfile?.email || ""}
                  disabled={true}
                />
              </div>

              {/* Author Phone */}
              <div>
                <TextInput
                  type="tel"
                  name="authorPhoneNumber"
                  label="Author Phone Number"
                  id="authorPhoneNumber"
                  value={myProfile?.phoneNumber}
                />
              </div>
            </form>
          </div>
        </div>

        {/* --- Footer (Fixed) --- */}
        <div className="flex-none p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={creatingBlogPost || updatingBlogPost || isUploading}
              disabled={
                title.length === 0 ||
                excerpt.length === 0 ||
                blogCategory.length === 0
              }
              className="flex-1 sm:flex-none shadow-md shadow-blue-500/20"
            >
              {update ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
