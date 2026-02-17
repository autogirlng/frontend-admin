"use client";

import React, { useState } from "react";
import { X, Layers } from "lucide-react";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { useGetMyProfile } from "@/lib/hooks/profile/useProfile";
import { useCreateBlogContent } from "@/lib/hooks/blog/useBlog";

interface SubmitBlogContentModalProps {
  onClose: () => void;
  consolidatedInvoiceId?: string;
  customerName?: string;
  blogHTML: string;
}

export function SubmitBlogContentModal({
  onClose,
  blogHTML,
}: SubmitBlogContentModalProps) {
  const { data: myProfile, isPending } = useGetMyProfile();
  const { mutate, isPending: creatingBlogPost } = useCreateBlogContent();

  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [blogCategory, setBlogCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>(["Education"]);

  const handleSubmit = async () => {
    mutate({
      title: title,
      slug: title.charAt(0),
      content: blogHTML,
      excerpt: excerpt,
      authorName: `${myProfile?.firstName} ${myProfile?.lastName}`,
      authorEmail: myProfile?.email || "",
      authorPhoneNumber: myProfile?.phoneNumber || "",
      blogCategory: {
        id: "0d3436f7-54fa-409a-8c32-4658defb4db6",
      },
      tags: ["Education"],
    });
  };

  if (isPending) {
    return <CustomLoader />;
  }

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

              {/* Slug */}
              {/*<div>
                <TextInput label="Slug" id="slug" name="slug" />
              </div>*/}

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

              {/* Blog Category */}
              {/*<div>
                <label className="text-xs font-medium">Category</label>
                <select
                  name="blogCategoryId"
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">Select category</option>
                  <option value="46818352-f16a-47a1-9793-00c4544c7e2d">
                    Education
                  </option>
                </select>
              </div>*/}
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
              isLoading={creatingBlogPost}
              disabled={title.length === 0 || excerpt.length === 0}
              className="flex-1 sm:flex-none shadow-md shadow-blue-500/20"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
