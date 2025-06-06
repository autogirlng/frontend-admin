import { FormikProps } from 'formik';


interface TimeValues {
    hourOne: string;
    hourTwo: string;
    minuteOne: string;
    minuteTwo: string;
    ampm: string;
}

interface TimeSelectionProps<T extends TimeValues> {
    formik: FormikProps<T>;
}
export const TimeSelection = <T extends TimeValues>({ formik }: TimeSelectionProps<T>) => {
    return (
        <>
            <div className="flex items-start w-full">
                <div className="w-[20%]">
                    <input
                        type="number"
                        inputMode="numeric"
                        id="hourOne"
                        name="hourOne"
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                            formik.setFieldValue('hourOne', value);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.hourOne}
                        className={`w-full h-10 ps-3 border border-[#d0d5dd] text-center text-xs font-semibold rounded-lg focus:outline-none transition-all
               flex items-center justify-center ${formik.touched.hourOne && formik.errors.hourOne ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="00"
                        min="0"
                        max="1"
                    />

                </div>

                <div className="w-[20%] ms-1">
                    <input
                        type="number"
                        inputMode="numeric"
                        id="hourTwo"
                        name="hourTwo"
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                            formik.setFieldValue('hourTwo', value);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.hourTwo}
                        className={`w-full h-10 ps-3 border border-[#d0d5dd] text-center text-xs font-semibold rounded-lg focus:outline-none transition-all
               flex items-center justify-center ${formik.touched.hourTwo && formik.errors.hourTwo ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="00"
                        min="0"
                        max="9"
                    />

                </div>
                <span className="text-2xl font-bold text-gray-700 px-1 mt-2">:</span>
                <div className="w-[20%] ms-1">
                    <input
                        type="number"
                        inputMode="numeric"
                        id="minuteOne"
                        name="minuteOne"
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                            formik.setFieldValue('minuteOne', value);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.minuteOne}
                        className={`w-full h-10 ps-3 border border-[#d0d5dd] text-center text-xs font-semibold rounded-lg focus:outline-none transition-all
               flex items-center justify-center ${formik.touched.minuteOne && formik.errors.minuteOne ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="00"
                        min="0"
                        max="5"
                    />

                </div>
                <div className="w-[20%] ms-1">
                    <input
                        type="number"
                        inputMode="numeric"
                        id="minuteTwo"
                        name="minuteTwo"
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                            formik.setFieldValue('minuteTwo', value);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.minuteTwo}
                        className={`w-full h-10 ps-3 border border-[#d0d5dd] text-center text-xs font-semibold rounded-lg focus:outline-none transition-all
               flex items-center justify-center ${formik.touched.minuteTwo && formik.errors.minuteTwo ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="00"
                        min="0"
                        max="9"
                    />

                </div>
                <div className="w-[20%]">
                    <select
                        id="ampm"
                        name="ampm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ampm}
                        className={`w-full h-10 ms-5 border border-[#d0d5dd] text-center text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none bg-white ${formik.touched.ampm && formik.errors.ampm ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >


                        <option value="AM">AM</option>
                        <option value="PM">PM</option>

                    </select>
                    {formik.touched.ampm && formik.errors.ampm && (
                        <div className="text-red-500 text-xs mt-1 text-center">{formik.errors.ampm as React.ReactNode}</div>
                    )}
                </div>
            </div>

            <p className="text-gray-500 text-xs  text-start">
                Edit if the trip ended at a different time.
            </p>
        </>
    )
}