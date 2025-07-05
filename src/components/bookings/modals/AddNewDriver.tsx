import { User } from "lucide-react";
import ModalLayout from "./ModalLayout";
import { ModalHeader } from "./ModalHeader";
import * as Yup from 'yup';
import { useFormik } from "formik"
import { toast } from "react-toastify";
import { useHttp } from "@/utils/useHttp";
import { UseQueryResult } from "@tanstack/react-query";
import { DriverResponse } from "@/utils/types";
import { Spinner } from "@/components/shared/spinner";
import { useState } from "react";

interface IAddNewDriver {
    isOpen: boolean;
    modalContent: string;
    refetch: () => Promise<UseQueryResult<DriverResponse | undefined, Error>>
    closeModal: () => void;
}


export const AddNewDriver = ({ isOpen, closeModal, refetch }: IAddNewDriver) => {

    const http = useHttp();
    const [loading, setLoading] = useState<boolean>(false)
    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is missing'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().required('Email is required').email(),
        phoneNumber: Yup.number().required('Phone number is required'),
    });
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phoneNumber: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await http.post('/drivers/add-driver',
                    {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        email: values.email,
                    }
                )
                refetch().then(() => {
                    closeModal()
                    formik.resetForm();
                    setLoading(false)


                })
            } catch (err) {
                console.log(err)
                toast.error("Could not add driver");
                setLoading(false)

            }

        },
    });

    return (
        <>
            {isOpen && (

                <ModalLayout>
                    <ModalHeader
                        LucideIcon={User}
                        iconBackgroundColor="#d9ffde"
                        iconColor="#0f6c1f"
                        modalContent=""
                        headerText="Add New Driver" />


                    <form onSubmit={formik.handleSubmit}>
                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-3">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.firstName}
                                    className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter first name"
                                />
                                {formik.touched.firstName && formik.errors.firstName ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.firstName}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                    className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter last name"
                                />
                                {formik.touched.lastName && formik.errors.lastName ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.lastName}</div>
                                ) : null}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter email"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-[#d82a39] text-xs mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>



                        {/* Phone Number */}
                        <div className="mb-6">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="flex">

                                <div className="flex-shrink-0 appearance-none bg-white border pt-2 text-sm border-[#d0d5dd] rounded-l-md pl-2 pr-6 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <span>+234</span>
                                </div>


                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phoneNumber}
                                    className="flex-grow w-full px-3 py-2 text-sm border  border-[#d0d5dd] rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                <div className="text-[#d82a39] text-xs mt-1">{formik.errors.phoneNumber}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-row justify-center">
                            <button
                                className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                onClick={() => {
                                    formik.resetForm();
                                    closeModal()

                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-[45%] px-4 py-3 text-sm my-5 text-white bg-[#0673ff] text-center rounded-2xl hover:shadow-md  flex items-center justify-center"
                            >
                                <span>Add New Driver</span>
                                {loading && <Spinner className="text-white" />}
                            </button>
                        </div>

                    </form>

                </ModalLayout>


            )}
        </>
    );
};
