import { FileQuestion } from "lucide-react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import ModalLayout from "./ModalLayout";
import { ModalHeader } from "./ModalHeader";
import { TimeSelection } from "../TimeSelection";

interface IEndTripModal {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export const EndTripModal = ({ isOpen, setIsOpen }: IEndTripModal) => {
    const [endingTrip, setEndingTrip] = useState<boolean>(false)


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
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            hourOne: '',
            hourTwo: '',
            minuteOne: '',
            minuteTwo: '',
            ampm: 'AM',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('Form submitted with values:', values);
            alert(`Trip ended at: ${values.hourOne} ${values.hourTwo}:${values.minuteOne} ${values.minuteTwo} ${values.ampm}`);
        },
    });


    const endTrip = () => {
        setEndingTrip(true);
    }

    const closeEndTripModal = () => {
        setEndingTrip(false);
        setIsOpen(false)
    }


    return (
        <>


            {isOpen && (
                <ModalLayout>
                    <ModalHeader
                        LucideIcon={FileQuestion}
                        iconColor="white"
                        iconBackgroundColor="#f3a218"
                        modalContent="You're about to end this trip. Please confirm the end time or adjust it if needed. "
                        headerText="End Trip">

                    </ModalHeader>
                    {
                        !endingTrip ?
                            <div>

                                <TimeSelection formik={formik} />
                                <p className="text-sm text-start my-3"> Edit if the trip ended at a different time.</p>
                                <div>
                                    <button
                                        className="w-[40%] px-4 py-2 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                        onClick={closeEndTripModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={endTrip}
                                        className="w-[40%] px-4 ms-[5%] py-2 text-sm  my-5 text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                    >
                                        End Trip
                                    </button>
                                </div>

                            </div> :
                            <div>
                                <h3 className="text-xl text-[#1d2739] flex items-center mt-3 font-bold mb-1">
                                    Summary
                                </h3>
                                <p className="text-xs text-start my-3">
                                    Ride Time; 12 hours<br />
                                    Extra Time; 3 hours
                                </p>

                                <div>
                                    <button
                                        className="w-[40%] px-4 py-2 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                        onClick={closeEndTripModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={endTrip}
                                        className="w-[45%] px-4 py-2 text-sm  my-5 text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                    >
                                        Confirm & End Trip
                                    </button>
                                </div>
                            </div>
                    }


                </ModalLayout>

            )}
        </>
    );
};
