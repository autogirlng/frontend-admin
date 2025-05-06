"use client";

import React from "react";
import { AiOutlineFilter } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import InputField2 from "../form-field/inputFiel";
import Icons from "@/utils/Icon";
type Props = {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick?: () => void;
  placeholder?: string;
};

const TableSearchFilter: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      {/* <input
        type="text"
        placeholder={placeholder}
        className="w-full md:w-1/3 px-4 py-3 mt-1 border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black transition cursor-pointer"
        value={searchQuery}
        onChange={onSearchChange}
      /> */}
      <div className="w-full md:w-1/3">
        <InputField2
          icon={Icons.ic_search}
          name="searchFilter"
          id="searchFilter"
          placeholder={placeholder}
          onChange={onSearchChange}
          value={searchQuery}
        />
      </div>
      <div
        className="flex items-center gap-2 px-4 py-3 text-[#667185] bg-white shadow rounded-xl cursor-pointer"
        onClick={onFilterClick}
      >
        <AiOutlineFilter />
        <p className="hidden md:block">Filter</p>
        <FaChevronDown />
      </div>
    </div>
  );
};

export default TableSearchFilter;
