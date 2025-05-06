import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import Icons from "./icons";
import cn from "classnames";

type Props = {
  label: string;
  name: string;
  id: string;
  disabled?: boolean;
  image: ReactNode;
  onChange: (name: string, value: File | null) => void;
  value: string | File | null;
  error?: string;
};

export default function PhotoUpload({
  label,
  name,
  id,
  disabled,
  onChange,
  image,
  value,
  error,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onChange(name, file);
    }
  };

  const handleDelete = () => {
    setPreviewUrl("");
    onChange(name, null);
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!previewUrl && typeof value === "string" && value.includes("http")) {
      setPreviewUrl(value);
    }
  }, [previewUrl, value]);

  return (
    <div>
      <div
        className={cn(
          "bg-grey-50 border-2 border-dashed border-grey-300 rounded-[59px]",
          disabled ? "opacity-50" : ""
        )}
      >
        <div className="h-[270px] sm:h-[400px] 3xl:h-[600px] w-full flex flex-col items-center justify-center relative">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="h-full w-full object-cover rounded-[59px]"
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={handleDelete}
                  className="w-10 h-10 md:w-12 md:h-12 3xl:w-20 3xl:h-20 rounded-full bg-error-50 text-error-500 flex items-center justify-center p-3"
                  type="button"
                >
                  {Icons.ic_delete}
                </button>
                <button
                  onClick={handleChangeImage}
                  className="w-10 h-10 md:w-12 md:h-12 3xl:w-20 3xl:h-20 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center p-3"
                  type="button"
                >
                  {Icons.ic_edit}
                </button>
              </div>
            </>
          ) : (
            <label
              htmlFor={id}
              className="w-full h-full flex flex-col gap-6 items-center justify-center cursor-pointer"
            >
              {image}
              <p className="text-grey-600 text-base md:text-xl 3xl:text-h5 !font-medium">
                {label}
              </p>
              <p className="text-primary-500 text-sm md:text-base 3xl:text-h6 flex items-center gap-1">
                {Icons.ic_add_circle} <span>Add Image</span>
              </p>
            </label>
          )}

          <input
            ref={fileInputRef}
            type="file"
            id={id}
            name={name}
            accept=".png, .jpg, .jpeg, .webp"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            disabled={disabled}
          />
        </div>
      </div>

      {error && (
        <p className="text-error-500 text-sm mt-2 text-nowrap">{error}</p>
      )}
    </div>
  );
}
