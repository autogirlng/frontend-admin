import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

export const FilePreviewThumbnail = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const isImage = file.type.startsWith("image/");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className="relative group inline-block">
      {isImage && previewUrl ? (
        <Image
          src={previewUrl}
          alt="Preview"
          width={80}
          height={80}
          className="h-20 w-20 object-cover rounded-md border border-gray-200"
        />
      ) : (
        <div className="h-20 w-20 bg-gray-100 rounded-md border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <FileIcon className="h-8 w-8 text-red-500" />
          <span className="text-[9px] mt-1 px-1 truncate max-w-full">PDF</span>
        </div>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
