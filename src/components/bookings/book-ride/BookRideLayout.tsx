
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useFormik } from "formik";
import * as Yup from 'yup';
import { ChevronRight } from "lucide-react";
import { ProgressBar } from "@/components/bookings/book-ride/ProgressBar";


const BookRideLayout = () => {

    const stops = ['Ikorodu', 'Bagagry', 'Epe', 'Ibeju-Lekki', 'Ojo', 'Alimosho', 'Agege', 'Ajah', 'Agbara', 'Sango', 'Ijede', 'Ikotun', 'Egbeda']

    const validation = Yup.object().shape({
        pickupLocation: Yup.string().required('The pick-up location is required'),
        pickupDate: Yup.date().required("Pick up date is required"),
        pickupTime: Yup.string().required('The pick-up time is required'),
        dropOffLocation: Yup.string().required('The drop off location is required'),
        areaOfUse: Yup.string().required('Area of use is required'),
        stops: Yup.array().min(1, 'Please select at least one stop').of(Yup.string().oneOf(stops, 'Invalid stop selected')).required('Required'),
        extraDetails: Yup.string().optional(),
        purposeOfRide: Yup.string().optional(),
    })
    interface FormValues {
        pickupLocation: string,
        pickupDate: string,
        pickupTime: string,
        dropOffLocation: string,
        stops: string[],
        extraDetails?: string,
        purposeOfRide?: string,
        areaOfUse: string,
        toggleOption: 'no' | 'yes',
        moreHoursNeeded: number,
    }
    const formik = useFormik<FormValues>({
        initialValues: {
            pickupLocation: '',
            pickupDate: new Date().toISOString().split('T')[0],
            pickupTime: '',
            dropOffLocation: '',
            stops: [],
            extraDetails: '',
            purposeOfRide: '',
            areaOfUse: '',
            toggleOption: 'yes',
            moreHoursNeeded: 1,

        },
        validationSchema: validation,
        onSubmit: values => {
            console.log(values);
        },
    });


    const isStopChecked = (stop: string): boolean => formik.values.stops.includes(stop);
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        let stops: string[] = [...formik.values.stops];

        if (checked) {
            stops.push(value);
        } else {
            stops = stops.filter((stop) => stop !== value);
        }
        formik.setFieldValue('stops', stops);
    };

    return <>

        return <DashboardLayout title="Book Ride" currentPage="/dashboard/booking/new-customer/book-ride">
            <div className=" bg-gray-50 p-1 font-inter">

                <ProgressBar />

                {/* Daily Rental*/}


                <form className="flex flex-col min-h-screen w-full max-w-5xl mx-auto p-4 md:p-8 bg-gray-50">
                    <div className="flex-grow flex flex-col lg:flex-row gap-8">

                        <div className="flex-1 l w-full max-w-3xl">
                            <h1 className="text-2xl font-bold mt-3 mb-5 text-[#101928]">Daily Rental</h1>

                            <div className="mb-4 w-full">
                                <label htmlFor="pickupLocation" className="text-sm mb-1 block">Pickup Location</label>
                                <input
                                    id="pickupLocation"
                                    name="pickupLocation"
                                    type="text"
                                    className="p-3 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                    value={formik.values.pickupLocation}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.pickupLocation && formik.errors.pickupLocation ? (
                                    <div className="text-[#f83677] text-sm mt-1">{formik.errors.pickupLocation}</div>
                                ) : null}
                            </div>

                            <div className="flex gap-4 mb-5 w-full">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="pickupDate" className="text-sm mb-1">Pick-up Date</label>
                                    <input
                                        id="pickupDate"
                                        name="pickupDate"
                                        type="date"
                                        className="p-3 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                        value={formik.values.pickupDate}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.pickupDate && formik.errors.pickupDate ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.pickupDate}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="pickupTime" className="text-sm mb-1">Pick-up Time</label>
                                    <input
                                        id="pickupTime"
                                        name="pickupTime"
                                        type="time"
                                        className="p-3 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                        value={formik.values.pickupTime}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.pickupTime && formik.errors.pickupTime ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.pickupTime}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mb-4 w-full">
                                <label htmlFor="dropoffLocation" className="text-sm mb-1 block">Drop-off Location</label>
                                <input
                                    id="dropOffLocation"
                                    name="dropOffLocation"
                                    type="text"
                                    className="p-3 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                    value={formik.values.dropOffLocation}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.dropOffLocation && formik.errors.dropOffLocation ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.dropOffLocation}</div>
                                ) : null}
                            </div>

                            <div className="mb-4 w-full">
                                <label htmlFor="areaOfUse" className="text-sm mb-1 block">Area of use</label>
                                <select
                                    id="areaOfUse"
                                    className=" py-3 ps-2 pe-5 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                    name="areaOfUse"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                >
                                    <option value="island"> Island</option>
                                    <option value="mainland">Mainland</option>

                                </select>
                                {formik.touched.areaOfUse && formik.errors.areaOfUse ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.pickupLocation}</div>
                                ) : null}
                            </div>

                            <div className="mb-4 w-full">
                                <label htmlFor="outskirtLocations" className="text-sm mb-1 block">Outskirt Locations </label>
                                <p className="text-xs text-[#667185]">Stops here will incur an additional cost of <span className="text-[#0673ff]">N6,500</span> set by the host of the vehicle</p>
                                <div className="grid grid-cols-5 gap-1">
                                    {
                                        stops.map((stop, index) => {
                                            return <label key={index} className="flex items-center mt-2 space-x-2">
                                                <input
                                                    type="checkbox"
                                                    onBlur={formik.handleBlur}
                                                    checked={isStopChecked(stop)}
                                                    onChange={handleCheckboxChange}
                                                    value={stop}
                                                    className="form-checkbox h-5 w-5" />
                                                <span className="text-sm">{stop}</span>
                                            </label>
                                        })
                                    }
                                </div>
                            </div>

                            <div className="mb-4 w-full">
                                <label htmlFor="extraDetails" className="text-sm mb-1 block">Extra details(optional)</label>
                                <textarea
                                    id="extraDetails"
                                    name="extraDetails"
                                    className=" border border-[#d0d5dd] p-2 w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                    value={formik.values.extraDetails}
                                    onChange={formik.handleChange}
                                    placeholder="Add extra trips details you would like to share"
                                    rows={8}
                                ></textarea>
                            </div>

                            <div className="mb-4 w-full">
                                <label htmlFor="purposeOfRide" className="text-sm mb-1 block">Purpose of ride(optional)</label>
                                <select
                                    id="purposeOfRide"
                                    className=" py-3 ps-2 pe-5 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                    name="purposeOfRide"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                >
                                    <option value="recreation"> Recreation</option>
                                    <option value="meeting">Meeting</option>

                                </select>

                            </div>
                            <div className="flex flex-row items-between justify-between mb-2 w-full">
                                <label htmlFor="toggleOption" className="text-sm mb-1 block">Will 12 hours be sufficient for you?</label>

                                <div className="relative w-[144px] text-xs h-[36px] bg-[#f7f9fc] rounded-full flex items-center border border-[#e4e7ec] overflow-hidden">
                                    <input
                                        type="radio"
                                        id="toggle-no"
                                        name="toggleOption"
                                        value="no"
                                        className="sr-only peer/no"
                                        checked={formik.values.toggleOption === 'no'}
                                        onChange={formik.handleChange}
                                    />
                                    <input
                                        type="radio"
                                        id="toggle-yes"
                                        name="toggleOption"
                                        value="yes"
                                        className="sr-only peer/yes"
                                        checked={formik.values.toggleOption === 'yes'}
                                        onChange={formik.handleChange}
                                    />
                                    <div className={`absolute top-[2px] w-[68px] h-[30px] bg-[#21212B] rounded-full z-0 transition-all duration-300 ease-in-out ${formik.values.toggleOption === 'yes' ? 'left-[72px]' : 'left-[2px]'
                                        }`}>
                                    </div>
                                    <label
                                        htmlFor="toggle-no"
                                        className={`relative z-10 flex-1 text-center font-medium py-2 px-4 cursor-pointer select-none ${formik.values.toggleOption === 'no' ? 'text-white' : 'text-gray-500'
                                            }`}
                                    >
                                        No
                                    </label>
                                    <label
                                        htmlFor="toggle-yes"
                                        className={`relative z-10 flex-1 text-center font-medium py-2 px-4 cursor-pointer select-none ${formik.values.toggleOption === 'yes' ? 'text-white' : 'text-gray-500'
                                            }`}
                                    >
                                        Yes
                                    </label>
                                </div>
                            </div>
                            {
                                formik.values.toggleOption === 'no' &&
                                <div className="mb-4 w-full">
                                    <label htmlFor="dropoffLocation" className="text-sm mb-1 block">How much more time do you need in hours</label>
                                    <input
                                        id="moreHoursNeeded"
                                        name="moreHoursNeeded"
                                        type="number"
                                        className="p-3 border border-[#d0d5dd] w-full rounded-2xl text-xs focus:border-[#d0d5dd] focus:outline-none"
                                        value={formik.values.moreHoursNeeded}
                                        onChange={formik.handleChange}
                                    />
                                    <div className="text-xs">Please note that enabling extra time will incur a fee of <span className="text-[blue]">₦2,700</span> per hour.</div>
                                </div>
                            }

                        </div>
                        <div className="w-full lg:w-80 flex flex-col mt-[80px]">
                            {/* Customer Info Section (Static Display - Reused from previous UI) */}
                            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e4e7ec] h-fit">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Info</h3>

                                <div className="space-y-4">
                                    <div className="flex flex-row justify-between">
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="text-base text-gray-800 font-medium">Mamudu Jeffrey</p>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-base text-gray-800 font-medium">jeffmamudu@gmail.com</p>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="text-base text-gray-800 font-medium">09039032585</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="mt-auto w-full flex justify-end pt-8">
                        <button
                            type="submit"
                            className="px-6 py-3 text-sm text-white bg-[#0673ff] text-center rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Next
                        </button>
                    </div>


                </form>


            </div>


        </DashboardLayout >
    </>
}

export { BookRideLayout }