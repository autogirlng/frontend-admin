import { Option } from "@/components/generic/ui/Select";

export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
export const CLOUDINARY_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export const formatPrice = (price: number) => {
  return `₦${price.toLocaleString()}`;
};

export const enumToOptions = (e: object): Option[] =>
  Object.entries(e).map(([key, value]) => ({
    id: value,
    name: key.replace(/_/g, " "),
  }));

export async function uploadToCloudinary(
  file: File
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
