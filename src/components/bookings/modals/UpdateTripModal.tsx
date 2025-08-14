
import { FileQuestion, UserIcon } from "lucide-react";
import ModalLayout from "./ModalLayout";
import { ModalHeader } from "./ModalHeader";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { TimeSelection } from "../TimeSelection";
import { useState, useEffect, useRef } from "react";
import { TripBookingItem, SingleTrip, Driver } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { parse, format, parseISO } from 'date-fns';
import { Spinner } from "@/components/shared/spinner";
import { useRouter } from "next/navigation";
interface IAddressModal {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    trip: TripBookingItem;
}

export const UpdateTripModal = ({ isOpen, setIsOpen, trip }: IAddressModal) => {
    const http = useHttp();
    const [isReady, setIsReady] = useState(false);
    const [timeValues, setTimeValues] = useState({
        minute: "",
        hour: "",
        period: ""
    })
    const router = useRouter()

    const [drivers, setDrivers] = useState<Driver[]>()
    const [loading, setLoading] = useState<boolean>(false)

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
        pickupLocation: Yup.string().required('Pickup location is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            pickupLocation: trip?.pickupLocation || "",
            hourOne: timeValues.hour[0] || "",
            hourTwo: timeValues.hour[1] || "",
            minuteOne: timeValues.minute[0] || "",
            minuteTwo: timeValues.minute[1] || "",
            ampm: timeValues.period || '',
            driverName: drivers?.find(
                (driver) => driver.status === "ASSIGNED"
            )?.firstName + " " + drivers?.find(
                (driver) => driver.status === "ASSIGNED"
            )?.lastName || ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const time = `${values.hourOne}${values.hourTwo}:${values.minuteOne}${values.minuteTwo}${values.ampm}`;
                // convert to ISO 24 hour time format
                const parsed = parse(time, "hh:mma", new Date());
                const timeValue = format(parsed, "HH:mm");
                const endDate = trip.booking.endDate.split("T")[0]
                const combinedDateTimeString = `${endDate}T${timeValue}:00`;
                const finalISODateTime = parseISO(combinedDateTimeString).toISOString();

                const data = {
                    pickupLocation: values.pickupLocation,
                    pickupTime: finalISODateTime,
                    driverFirstName: values.driverName.split(" ")[0] || "",
                    driverLastName: values.driverName.split(" ")[1] || "",
                }
                await http.put(`/admin/trips/update/${trip.id}`, data)
                    .then(() => {
                        window.location.reload()
                    })


            } catch (error) {
                console.log(error)
            }

            setLoading(false)
        },
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    // Ref to detect clicks outside the dropdown
    const dropdownRef = useRef(null);



    const fetchAllTripOtherDetails = async () => {
        const allTripData = await http.get<SingleTrip>(`admin/trips/getSingle/${trip?.id}`)
        const assignedDriver = allTripData?.booking.vehicle.AssignedDriver
        setDrivers(assignedDriver)
    }

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
    useEffect(() => {
        const parsed = parseISO(trip.pickupTime);

        const hour = format(parsed, "hh");
        const minute = format(parsed, "mm");
        const period = format(parsed, "a");

        setTimeValues({
            hour,
            minute,
            period
        });
        fetchAllTripOtherDetails().then(() => {
            setIsReady(true);
        });

    }, [isOpen])


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


                            <textarea
                                id="pickupLocation"
                                name="pickupLocation"
                                value={formik.values.pickupLocation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full p-3 mt-2 border border-[#d0d5dd] rounded-2xl bg-gray-50 text-gray-800 break-words whitespace-pre-wrap"
                                style={{ minHeight: '100px' }}
                            />
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
                        {/* <div>
                            <label htmlFor="driverName" className="block text-gray-700 text-sm text-start mt-3">
                                Driver
                            </label>
                            <div className="relative mb-6">
                                <div className="flex items-center justify-between bg-white border border-[#f0f2f5] rounded-xl shadow-sm hover:shadow-md transition duration-200">
                                    <div
                                        className="flex items-center bg-[#f0f2f5] border border-[#f0f2f5] text-gray-800 text-sm py-2 px-2 rounded-lg m-1 shadow-sm whitespace-nowrap w-full"
                                    >
                                        <UserIcon size={20} className="mr-2 text-gray-600" />
                                        <select
                                            id="driverName"
                                            name="driverName"
                                            value={formik.values.driverName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-transparent outline-none text-sm text-gray-800 w-full"
                                        >
                                            <option value="" disabled>Select a driver</option>
                                            {
                                                drivers?.map((driver, index) => {

                                                    return <option key={index} value={`${driver.firstName} ${driver.lastName}`}>
                                                        {driver.firstName} {driver.lastName}
                                                    </option>
                                                })
                                            }

                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div> */}




                        <div className="flex flex-row">
                            <button
                                className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-[45%] px-4 py-3 text-sm  my-5 text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                            >
                                Update Trip
                                {loading && <Spinner className="text-white" />}
                            </button>

                        </div>

                    </form>


                </ModalLayout>


            )}
        </>
    );
};
