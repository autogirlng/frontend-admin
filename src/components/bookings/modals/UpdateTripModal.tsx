import { FileQuestion, UserIcon, User, ChevronDown, ChevronUp, Search, Plus } from "lucide-react";
import ModalLayout from "./ModalLayout";
import { ModalHeader } from "./ModalHeader";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { TimeSelection } from "../TimeSelection";
import { useState, useEffect, useRef } from "react";
import { DropDown } from "../DropDown";

interface IAddressModal {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export const UpdateTripModal = ({ isOpen, setIsOpen }: IAddressModal) => {

    const closeModal = () => {
        setIsOpen(false)
    }

    const validationSchema = Yup.object({
        hourOne: Yup.number()
            .required('Hour is required')
            .integer('Hour must be an integer')
            .min(0, 'First hour number can only be 0 or 1')
            .max(1, 'First hour number can only be 0 or 1')
            .typeError('Hour must be a number'),
        hourTwo: Yup.number()
            .required('Hour is required')
            .integer('Hour must be an integer')
            .min(0, 'Second hour number must be between 0 and 9')
            .max(9, 'Second hour number must be between 0 and 9')
            .typeError('Hour must be a number'),

        minuteOne: Yup.number()
            .required('Minute is required')
            .integer('Minute must be an integer')
            .min(0, 'First minute number must be between 0 and 5')
            .max(5, 'First minute number must be between 0 and 5')
            .typeError('Minute must be a number'),

        minuteTwo: Yup.number()
            .required('Minute is required')
            .integer('Minute must be an integer')
            .min(0, 'Second minute number must be between 0 and 9')
            .max(9, 'Second minute number must be between 0 and 9')
            .typeError('Minute must be a number'),

        ampm: Yup.string()
            .required('AM/PM is required')
            .oneOf(['AM', 'PM'], 'Invalid AM/PM value'),
        driverName: Yup.string().required('Driver name is required'),
        vehicle: Yup.string().required('Vehicle is required'),
        pickupLocation: Yup.string().required('Pickup location is required'),
    });
    const formik = useFormik({
        initialValues: {
            pickupLocation: "Flat 2B, Block C, Harmony Court Apartments\n15A Fola Osibo Street\nLekki Phase 1\nEti-Osa LGA",
            hourOne: '',
            hourTwo: '',
            minuteOne: '',
            minuteTwo: '',
            ampm: 'AM',
            driverName: 'Chris Madu',
            vehicle: 'Toyota Corolla 2023',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('Form submitted with values:', values);
            // alert('Trip details saved: ' + JSON.stringify(values, null, 2));
        },
    });

    const allDrivers = [
        'Amelia Okonkwo',
        'Benjamin Adeyemi',
        'Chloe Nwafor',
        'Daniel Oladipo',
        'Ella Obiakor',
        'Femi Adewale',
        'Grace Chukwu',
        'Henry Eze',
        'Ifeoma James',
        'John Doe',
        'Chris Madu'
    ];

    const allVehicles = [
        "Kia Rio",
        "Toyota Highlander",
        "Honda CR-V",
        "Ford Explorer",

    ]

    // State to control the visibility of the dropdown list
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);


    // Ref to detect clicks outside the dropdown
    const dropdownRef = useRef(null);
    const vehicleDropdownRef = useRef(null);



    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            // @ts-ignore
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to toggle the dropdown's visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };
    const toggleVehicleDropdown = () => {
        setIsVehicleDropdownOpen(prev => !prev);
    };

    // Function to handle driver selection from the list
    const handleDriverSelect = (driver: string) => {
        formik.values.driverName = driver
        setIsDropdownOpen(false); // Close dropdown after selection
    };
    const handleVehicleSelect = (driver: string) => {
        formik.values.vehicle = driver
        setIsVehicleDropdownOpen(false); // Close dropdown after selection
    };
    return (
        <>
            {isOpen && (

                <ModalLayout>
                    <ModalHeader
                        LucideIcon={FileQuestion}
                        iconBackgroundColor="#f3a218"
                        iconColor="white"
                        modalContent="Change trip information"
                        headerText="Update Trip" />

                    <form onSubmit={formik.handleSubmit} className="mt-[30px]">

                        {/* Pickup Location */}
                        <div className="text-sm text-start">
                            <label htmlFor="pickupLocation" className="text-start text-sm mt-2">
                                Pickup Location
                            </label>
                            <div
                                id="pickupLocation"
                                className="w-full p-3 mt-2 border border-[#d0d5dd] rounded-2xl bg-gray-50 text-gray-800 break-words whitespace-pre-wrap"
                                style={{ minHeight: '100px' }} // Give it some height
                            >
                                {formik.values.pickupLocation}
                            </div>
                            {formik.touched.pickupLocation && formik.errors.pickupLocation ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.pickupLocation}</div>
                            ) : null}
                        </div>
                        <div className="text-sm text-start mt-3">
                            <label htmlFor="pickupTime" >
                                Pickup Time
                            </label>
                            <TimeSelection formik={formik} />

                        </div>

                        {/* Driver */}
                        <div>
                            <label htmlFor="driverName" className="block text-gray-700 text-sm text-start mt-3">
                                Driver
                            </label>
                            <div className="relative mb-6" ref={dropdownRef}>
                                {/* Display area for the selected driver, acts as the dropdown trigger */}
                                <div
                                    className="flex items-center justify-between bg-white border border-[#f0f2f5] rounded-xl cursor-pointer shadow-sm hover:shadow-md transition duration-200"
                                    onClick={toggleDropdown}
                                >
                                    <div
                                        id="driverField"
                                        className="flex items-center bg-[#f0f2f5] border border-[#f0f2f5] text-gray-800 font-sm text-sm py-2 px-2 rounded-lg m-1 shadow-sm whitespace-nowrap"
                                        aria-readonly="true"
                                    >
                                        <UserIcon size={20} className="mr-2 text-gray-600" />
                                        {formik.values.driverName}
                                    </div>
                                </div>

                                {/* Dropdown List (conditionally rendered) */}

                                {isDropdownOpen && (

                                    <DropDown
                                        formik={formik}
                                        Icon={Search}
                                        values={allDrivers}
                                        headerText="Search Drivers"
                                        setIsDropdownOpen={setIsDropdownOpen}
                                        drowdownRef={dropdownRef}
                                        handleSelect={handleDriverSelect}
                                        isDriver={true}
                                    />
                                )}
                            </div>

                        </div>

                        {/* Vehicle */}
                        <div>
                            <label htmlFor="vehicle" className="block text-gray-700 text-sm text-start mt-1">
                                Vehicle
                            </label>
                            <div className="relative mb-6" ref={vehicleDropdownRef}>
                                {/* Display area for the selected driver, acts as the dropdown trigger */}
                                <div
                                    className="flex items-center justify-between bg-white border border-[#f0f2f5] rounded-xl cursor-pointer shadow-sm hover:shadow-md transition duration-200"
                                    onClick={toggleVehicleDropdown}
                                >
                                    <div
                                        id="vehicleField"
                                        className="flex items-center  text-gray-800 font-sm text-sm py-2 px-2 rounded-lg m-1 shadow-sm whitespace-nowrap"
                                        aria-readonly="true"
                                    >
                                        <UserIcon size={20} className="mr-2 text-gray-600" />
                                        {formik.values.vehicle}
                                    </div>
                                </div>

                                {/* Dropdown List (conditionally rendered) */}

                                {isVehicleDropdownOpen && (

                                    <DropDown
                                        formik={formik}
                                        Icon={Search}
                                        values={allVehicles}
                                        headerText="Search Vehicles"
                                        setIsDropdownOpen={setIsVehicleDropdownOpen}
                                        drowdownRef={vehicleDropdownRef}
                                        handleSelect={handleVehicleSelect}
                                        isDriver={false}
                                    />
                                )}
                            </div>

                        </div>



                        <div>
                            <button
                                className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button

                                className="w-[45%] px-4 py-3 text-sm  my-5 text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                            >
                                Update Trip
                            </button>
                        </div>

                    </form>


                </ModalLayout>


            )}
        </>
    );
};
