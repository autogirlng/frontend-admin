"use client";

import { useField, useFormikContext } from "formik";
import Image from "next/image";
import { ChangeEvent } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";

interface PhotoUploadFieldProps {
  name: string;
  label: string;
  icon: string;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  name,
  label,
  icon,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue(name, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFieldValue(name, null);
  };

  return (
    <div className="relative w-full h-64  rounded-lg bg-gray-50 flex items-center justify-center shadow-sm">
      {field.value ? (
        <>
          {/* Full-Size Image */}
          <Image
            src={field.value}
            alt={label}
            layout="fill"
            className="rounded-lg object-cover"
          />

          {/* Button Controls */}
          <div className="absolute bottom-2 left-2 flex space-x-2">
            {/* Remove Button */}
            <button
              onClick={removeImage}
              className="text-red-500 bg-white p-4 text-md rounded-full shadow-sm hover:bg-red-600"
            >
              <FaTrash size={16} />
            </button>

            {/* Change Image Button */}
            <label className="bg-white text-black text-md p-4 rounded-full shadow-sm hover:bg-blue-600 cursor-pointer">
              <FaShuffle size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center space-y-2">
          <Image src={icon} alt={label} width={40} height={40} />
          <p className="text-gray-600 text-sm">{label}</p>
          <label className="text-blue-500 flex items-center justify-center cursor-pointer text-sm gap-2">
            <AiOutlinePlusCircle /> <p>Add Image</p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadField;
