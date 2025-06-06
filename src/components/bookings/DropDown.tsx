
import { useEffect, Dispatch, SetStateAction, RefObject } from "react";

import { LucideIconType } from "@/utils/types";

interface DropDownProps {
    formik: any;
    Icon: LucideIconType,
    values: string[],
    headerText: string,
    setIsDropdownOpen: Dispatch<SetStateAction<boolean>>,
    drowdownRef: RefObject<HTMLDivElement | null>,
    handleSelect: (name: string) => void,
    isDriver: boolean

}
export const DropDown = ({ formik, Icon, handleSelect, values, headerText, setIsDropdownOpen, drowdownRef, isDriver }: DropDownProps) => {


    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (drowdownRef?.current && !drowdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return <>
        <div>


            {/* Dropdown List (conditionally rendered) */}

            <div className="absolute z-10 p-5 text-start w-full bottom-full bg-white border border-[#d0d5dd] rounded-xl shadow-lg  ">
                <h4 className="font-bold">{headerText}</h4>
                <div className="flex flex-col md:flex-row mt-3 items-center gap-4">
                    {/* Search Input Field */}
                    <div className="relative flex-grow w-full ">
                        <Icon
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                            color="#667185" />
                        <input
                            type="text"
                            id="searchQuery"
                            name="searchQuery"
                            placeholder="Search by name, ID or email"
                            className={`${isDriver ? " w-[64%] me-[1%]" : "w-full"} pl-8 text-xs pr-4 py-2 border border-[#d0d5dd] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                            onChange={formik.handleChange}
                        // value={formik.values.searchQuery}
                        />
                        {
                            isDriver ? <button className="w-[35%] px-1 py-3 text-xs  text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200">
                                + Add New Host
                            </button> : <></>
                        }

                    </div>

                </div>
                <div className="mb-4 "></div>
                <div className=" h-[155px] overflow-y-auto">
                    {values.length > 0 ? (
                        values.map((value, index) => (
                            <div
                                key={index}
                                className="py-1 cursor-pointer hover:bg-blue-50 text-gray-700 text-sm font-medium transition duration-150"
                                onClick={() => handleSelect(value)}
                            >
                                {value}

                                {!isDriver && <span><br></br>Host: Amelia Okonkwo</span>}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No {headerText} available.</p>
                    )}
                </div>
            </div>

        </div>


    </>
}