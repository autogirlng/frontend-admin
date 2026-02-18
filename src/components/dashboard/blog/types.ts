export type ToolbarSection = {
  tools: ToolbarItem[];
};

export type ToolbarItem = {
  icon: React.ElementType;
  action: () => void;
  active?: boolean;
  title: string;
};

export interface RichTextEditorProps {
  onChange?: (html: string, json: object) => void;
  placeholder?: string;
  characterLimit?: number;
  editable?: boolean;
}

export interface UseUploadImageReturn {
  uploadImage: (
    file: File,
  ) => Promise<{ url: string; publicId: string } | null>;
  isUploading: boolean;
  error: string | null;
}

export enum BLOG_STATUS {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SENT = "SENT",
  ACTIVE = "ACTIVE",
  VERIFIED = "VERIFIED",
}

export enum BLOG_CONTENT_TYPE {
  CATEGORY = "CATEGORY",
  POST = "POST",
  COMMENT = "COMMENT",
}

export interface CreateBlogPostPayload {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  blogCategory: {
    id: string;
  };
  tags: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  status: string;
  postCount: number;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvedAt?: string;
  approvedById?: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  authAuthorName?: string;
  authAuthorEmail?: string;
  authAuthorPhoneNumber?: string;
}

export interface CreateBlogPostResponseData {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BLOG_STATUS;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvedAt: string;
  approvedById: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  authAuthorName: string;
  authAuthorEmail: string;
  authAuthorPhoneNumber: string;
  blogCategory: BlogCategory;
  tags: string[];
  metrics: {
    views: number;
    likes: number;
    commentCount: number;
  };
}

export interface ModeratedBlogPostContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  blogCategory: BlogCategory;
  tags: string[];
}
export interface ModeratedBlogPost {
  content: ModeratedBlogPostContent[];
  page: 0;
  size: 0;
  totalElements: 0;
  totalPages: 1;
  last: true;
  first: true;
}

export interface ModeratedBlogApprovalPayload {
  contentType: BLOG_CONTENT_TYPE;
  id: string;
}

export type BlogStatus =
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "FAILED"
  | "ACTIVE";

export interface BlogMetrics {
  views: number;
  likes: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  excerpt: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvedAt: string;
  approvedById: string;
  approvalRef: string;
  createdAt: string;
  updatedAt: string;
  blogCategory: BlogCategory;
  tags: string[];
  metrics: BlogMetrics;
}

export interface BlogComment {
  id: string;
  content: string;
  post: BlogPost;
  status: BlogStatus;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
  approvalRef: string;
  ipAddress: string;
  userAgent: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface CreateBlogCategoryPayload {
  name: string;
  description: string;
  authorName: string;
  authorEmail: string;
  authorPhoneNumber: string;
}
