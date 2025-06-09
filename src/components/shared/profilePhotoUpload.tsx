import { AvatarImage } from "./avatar";
import Icons from "./icons";
import { Spinner } from "./spinner";
import cn from "classnames";

import { ChangeEvent } from "react";

type Props = {
  title: string;
  label: string;
  name: string;
  id: string;
  disabled?: boolean;
  image?: string | null;
  onChange: (name: string, value: File | null) => void;
  value: string | File | null;
  error?: string;
  isLoading: boolean;
  initials?: string;
};
export default function ProfilePhotoUpload({
  title,
  label,
  name,
  id,
  disabled,
  onChange,
  image,
  value,
  error,
  isLoading,
  initials,
  ...rest
}: Props) {
  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      onChange(name, file);
    } else {
      onChange(name, null);
    }
  };

  return (
    <div className="space-y-6">
      <p className="label text-sm block font-medium text-nowrap text-grey-900">
        {title}
      </p>
      <div className="flex flex-col md:flex-row items-center gap-3">
        <AvatarImage
          image={image || ""}
          initials={initials || Icons.ic_user}
          size="!w-[130px] !h-[130px]"
        />
        <label className={cn(!disabled && "cursor-pointer")}>
          <p className="text-grey-800 hover:text-white text-sm 3xl:text-base !font-semibold rounded-2xl border-2 border-grey-800 hover:bg-grey-800 py-2 px-5">
            {isLoading ? <Spinner /> : "Upload Profile Image"}
          </p>
          <input
            type="file"
            id={id}
            name={name}
            accept=".png, .jpg, .jpeg"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            disabled={disabled || isLoading}
            {...rest}
          />
        </label>
      </div>
    </div>
  );
}
