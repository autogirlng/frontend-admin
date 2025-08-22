import ModalLayout from "../ModalLayout";
// Country/country code options (can be moved to a separate file if needed)
const countryOptions = [
  { name: "Nigeria", code: "+234", iso: "NG" },
  { name: "Ghana", code: "+233", iso: "GH" },
  { name: "United States", code: "+1", iso: "US" },
  { name: "United Kingdom", code: "+44", iso: "GB" },
  { name: "South Africa", code: "+27", iso: "ZA" },
  // Add more countries as needed
];
import * as Yup from 'yup';
import { useFormik } from "formik"
import { toast, ToastContainer } from "react-toastify";
import { useHttp } from "@/utils/useHttp";
import useUser from "@/hooks/useUser";

interface INewCustomerModal {
    isOpen: boolean;
    closeModal: () => void;
}

export const AddNewCustomerModal = ({ isOpen, closeModal }: INewCustomerModal) => {
    const http = useHttp();
    const { getUser } = useUser();
    const userEmail = getUser.data?.email || '';

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phoneNumber: '',
            businessLogo: '',
            businessName: '',
            businessAddress: '',
            businessPhoneNumber: '',
            businessEmail: '',
            onBoardedBy: userEmail,
            mouDocument: '',
            isBusiness: false,
            userRole: 'CUSTOMER',
            country: countryOptions[0].iso,
            countryCode: countryOptions[0].code,
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is missing'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().required('Email is required').email('Invalid email'),
            address: Yup.string().required('Your address is required'),
            phoneNumber: Yup.string()
                .required('Phone number is required')
                .matches(/^[0-9\-\+\s]{7,20}$/, 'Invalid phone number'),
            mouDocument: Yup.string().url('MOU document must be a valid URL').required('MOU document is required'),
            userRole: Yup.string().required('User role is required'),
            isBusiness: Yup.boolean(),
            country: Yup.string().required('Country is required'),
            countryCode: Yup.string().required('Country code is required'),
            // Business fields only required if isBusiness is true
            businessName: Yup.string().when('isBusiness', {
                is: true,
                then: schema => schema.required('Business name is required'),
                otherwise: schema => schema.notRequired()
            }),
            businessLogo: Yup.string().when('isBusiness', {
                is: true,
                then: schema => schema.url('Business logo must be a valid URL').required('Business logo is required'),
                otherwise: schema => schema.notRequired()
            }),
            businessAddress: Yup.string().when('isBusiness', {
                is: true,
                then: schema => schema.required('Business address is required'),
                otherwise: schema => schema.notRequired()
            }),
            businessPhoneNumber: Yup.string().when('isBusiness', {
                is: true,
                then: schema => schema.required('Business phone number is required'),
                otherwise: schema => schema.notRequired()
            }),
            businessEmail: Yup.string().when('isBusiness', {
                is: true,
                then: schema => schema.email('Business email must be valid').required('Business email is required'),
                otherwise: schema => schema.notRequired()
            }),
            onBoardedBy: Yup.string().notRequired(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            // Always set onBoardedBy to userEmail before submit
            const submitValues = {
                ...values,
                onBoardedBy: userEmail
            };
            console.log('Submitting form with values:', submitValues);
            try {
                // Prepare data to submit - exclude business fields if isBusiness is false
                const submitData = {
                    firstName: submitValues.firstName,
                    lastName: submitValues.lastName,
                    phoneNumber: submitValues.phoneNumber,
                    countryCode: submitValues.countryCode,
                    country: submitValues.country,
                    email: submitValues.email,
                    userRole: 'CUSTOMER',
                    isBusiness: submitValues.isBusiness,
                    onBoardedBy: userEmail,
                    mouDocument: submitValues.mouDocument,
                    // Only include business fields if isBusiness is true
                    ...(submitValues.isBusiness && {
                        businessLogo: submitValues.businessLogo,
                        businessName: submitValues.businessName,
                        businessAddress: submitValues.businessAddress,
                        businessPhoneNumber: submitValues.businessPhoneNumber,
                        businessEmail: submitValues.businessEmail
                    })
                };
                const request = await http.post<{ message: string }>('/auth/createUser', submitData);
                console.log('API response:', request);
                toast.success(request?.message || 'Customer added successfully!');
                formik.resetForm();
                closeModal();
            } catch (err) {
                console.error('Error submitting form:', err);
                toast.error("Could not add customer");
            }
            setSubmitting(false);
        },
    });

    return (
        <>
            {isOpen && (
                <ModalLayout>
                    <ToastContainer position="top-right" autoClose={2000} />
                    <h3 className="text-xl flex items-center font-bold mb-4 space-x-2">
                        <span>Add New Customer </span>
                    </h3>
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {/* Error summary */}
                        {Object.keys(formik.errors).length > 0 && (
                            <div className="bg-red-50 border border-red-300 text-red-700 rounded-md p-3 mb-4">
                                <div className="font-semibold mb-2">Please fix the following errors:</div>
                                <ul className="list-disc pl-5">
                                    {Object.entries(formik.errors).map(([field, error]) => (
                                        <li key={field}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <form onSubmit={e => { console.log('Form submit event fired'); formik.handleSubmit(e); }}>
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
                                    Email
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

                            {/* Address */}
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                    className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter address"
                                />
                                {formik.touched.address && formik.errors.address ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.address}</div>
                                ) : null}
                            </div>

                            {/* Country & Phone Number */}
                            <div className="mb-6">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="flex">
                                    <select
                                        id="country"
                                        name="country"
                                        value={formik.values.country}
                                        onChange={e => {
                                            const selected = countryOptions.find(c => c.iso === e.target.value);
                                            formik.setFieldValue('country', selected?.iso || '');
                                            formik.setFieldValue('countryCode', selected?.code || '');
                                        }}
                                        onBlur={formik.handleBlur}
                                        className="flex-shrink-0 bg-white border pt-2 text-sm border-[#d0d5dd] rounded-l-md pl-2 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        style={{ minWidth: '110px' }}
                                    >
                                        {countryOptions.map(opt => (
                                            <option key={opt.iso} value={opt.iso}>{opt.name} ({opt.code})</option>
                                        ))}
                                    </select>
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
                                {formik.touched.country && formik.errors.country ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.country}</div>
                                ) : null}
                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.phoneNumber}</div>
                                ) : null}
                            </div>

                            {/* Is Business */}
                            <div className="mb-4">
                                <label htmlFor="isBusiness" className="block text-sm font-medium text-gray-700 mb-1">
                                    Is Business?
                                </label>
                                <div className="flex items-center">
                                    <input
                                        id="isBusiness"
                                        name="isBusiness"
                                        type="checkbox"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.isBusiness}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Check if this customer is a business
                                    </span>
                                </div>
                                {formik.touched.isBusiness && formik.errors.isBusiness ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.isBusiness}</div>
                                ) : null}
                            </div>

                            {/* Business fields only if isBusiness is true */}
                            {formik.values.isBusiness && (
                                <>
                                    {/* Business Name */}
                                    <div className="mb-4">
                                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Name
                                        </label>
                                        <input
                                            id="businessName"
                                            name="businessName"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.businessName}
                                            className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter business name"
                                        />
                                        {formik.touched.businessName && formik.errors.businessName ? (
                                            <div className="text-[#d82a39] text-xs mt-1">{formik.errors.businessName}</div>
                                        ) : null}
                                    </div>

                                    {/* Business Logo */}
                                    <div className="mb-4">
                                        <label htmlFor="businessLogo" className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Logo (URL)
                                        </label>
                                        <input
                                            id="businessLogo"
                                            name="businessLogo"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.businessLogo}
                                            className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter business logo URL"
                                        />
                                        {formik.touched.businessLogo && formik.errors.businessLogo ? (
                                            <div className="text-[#d82a39] text-xs mt-1">{formik.errors.businessLogo}</div>
                                        ) : null}
                                    </div>

                                    {/* Business Address */}
                                    <div className="mb-4">
                                        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Address
                                        </label>
                                        <input
                                            id="businessAddress"
                                            name="businessAddress"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.businessAddress}
                                            className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter business address"
                                        />
                                        {formik.touched.businessAddress && formik.errors.businessAddress ? (
                                            <div className="text-[#d82a39] text-xs mt-1">{formik.errors.businessAddress}</div>
                                        ) : null}
                                    </div>

                                    {/* Business Phone Number */}
                                    <div className="mb-4">
                                        <label htmlFor="businessPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Phone Number
                                        </label>
                                        <div className="flex">
                                            <select
                                                id="businessCountry"
                                                name="businessCountry"
                                                value={formik.values.country}
                                                onChange={e => {
                                                    const selected = countryOptions.find(c => c.iso === e.target.value);
                                                    formik.setFieldValue('country', selected?.iso || '');
                                                    formik.setFieldValue('countryCode', selected?.code || '');
                                                }}
                                                onBlur={formik.handleBlur}
                                                className="flex-shrink-0 bg-white border pt-2 text-sm border-[#d0d5dd] rounded-l-md pl-2 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                style={{ minWidth: '110px' }}
                                            >
                                                {countryOptions.map(opt => (
                                                    <option key={opt.iso} value={opt.iso}>{opt.name} ({opt.code})</option>
                                                ))}
                                            </select>
                                            <input
                                                id="businessPhoneNumber"
                                                name="businessPhoneNumber"
                                                type="tel"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.businessPhoneNumber}
                                                className="flex-grow w-full px-3 py-2 text-sm border  border-[#d0d5dd] rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Enter business phone number"
                                            />
                                        </div>
                                        {formik.touched.businessPhoneNumber && formik.errors.businessPhoneNumber ? (
                                            <div className="text-[#d82a39] text-xs mt-1">{formik.errors.businessPhoneNumber}</div>
                                        ) : null}
                                    </div>

                                    {/* Business Email */}
                                    <div className="mb-4">
                                        <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Email
                                        </label>
                                        <input
                                            id="businessEmail"
                                            name="businessEmail"
                                            type="email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.businessEmail}
                                            className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter business email"
                                        />
                                        {formik.touched.businessEmail && formik.errors.businessEmail ? (
                                            <div className="text-[#d82a39] text-xs mt-1">{formik.errors.businessEmail}</div>
                                        ) : null}
                                    </div>
                                </>
                            )}

                            {/* MOU Document */}
                            <div className="mb-4">
                                <label htmlFor="mouDocument" className="block text-sm font-medium text-gray-700 mb-1">
                                    MOU Document (URL)
                                </label>
                                <input
                                    id="mouDocument"
                                    name="mouDocument"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.mouDocument}
                                    className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter MOU document URL"
                                />
                                {formik.touched.mouDocument && formik.errors.mouDocument ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.mouDocument}</div>
                                ) : null}
                            </div>

                            {/* User Role */}
                            <div className="mb-4">
                                <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
                                    User Role
                                </label>
                                <select
                                    id="userRole"
                                    name="userRole"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.userRole}
                                    className="w-full px-3 py-2 text-sm border border-[#d0d5dd] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="CUSTOMER">Customer</option>
                                </select>
                                {formik.touched.userRole && formik.errors.userRole ? (
                                    <div className="text-[#d82a39] text-xs mt-1">{formik.errors.userRole}</div>
                                ) : null}
                            </div>

                            <div className="flex flex-row justify-center">
                                <button
                                    type="button"
                                    className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                                    onClick={e => {
                                        e.preventDefault();
                                        formik.resetForm();
                                        closeModal();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-[45%] px-4 py-3 text-sm  my-5 text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'Adding...' : 'Add New Customer'}
                                </button>
                            </div>

                        </form>
                    </div>
                </ModalLayout>
            )}
        </>
    );
};