import DashboardLayout from "@/components/dashboard/DashboardLayout"
import BackButton from "@/components/core/button/BackButton"
import { useRouter } from "next/navigation"
import SideNav from "@/components/Navbar/SideNav"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { newCustomerData } from "@/utils/data"
import { useState } from "react"
import { AddNewCustomerModal } from "../modals/new-customer/AddNewCustomerModal"


interface ICustomerData {

    customerID: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
    dateAdded: string

}

const NewCustomerLayout = () => {
    const [selectedCustomerID, setSelectedCustomerID] = useState<string>('');
    const [filtedCustomer, setFilteredCustomers] = useState<ICustomerData[]>(newCustomerData)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const router = useRouter()

    const closeModal = () => {
        setIsOpen(false)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        const results = newCustomerData.filter(customer =>
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.customerID.includes(searchTerm)
        );
        if (searchTerm.length < 1) {
            setFilteredCustomers(newCustomerData)
        } else {
            setFilteredCustomers(results);
        }
    };



    return <>
        <DashboardLayout title="Select Customer" currentPage="/dashboard/customer/new-customer">
            <div className="w-full bg-white">
                <div className="p-4">

                    <h1 className="text-4xl font-bold mb-6">Select Customer</h1>

                    <div className="flex justify-between mb-6 flex-wrap">
                        <div className="relative w-full w-[75%]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by customer, customer ID"
                                className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ fontSize: "14px" }}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e)}
                            />
                        </div>
                        <button
                            className="w-[20%] px-2 py-2 text-sm  text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                            onClick={() => setIsOpen(true)}
                        >
                            + Add New Customer
                        </button>
                    </div>

                    <div
                        className="overflow-x-auto"
                        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    >
                        <table className="min-w-full">
                            <thead>
                                <tr
                                    className="bg-[#F7F9FC] border-b border-[#D0D5DD]"
                                >
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500  tracking-wider">
                                        Customer ID
                                    </th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500  tracking-wider">
                                        First Name
                                    </th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500  tracking-wider">
                                        Last Name
                                    </th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500  tracking-wider">
                                        Email
                                    </th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500  tracking-wider">
                                        Phone Number
                                    </th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500  tracking-wider">
                                        Date Added
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filtedCustomer.length !== 0 ? filtedCustomer.map((customer, index) => (
                                        <tr
                                            key={`${customer.customerID}-${index}`}
                                            className={`border-b border-[#D0D5DD] cursor-pointer ${`${customer.customerID}` === selectedCustomerID && 'bg-[#edf8ff]'} hover:bg-[#edf8ff]`}
                                            onClick={() => setSelectedCustomerID(`${customer.customerID}`)}

                                        >
                                            <td className="px-4 py-4 text-sm font-medium text-[#344054]">
                                                {customer.customerID}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#344054]">
                                                {customer.firstName}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#344054]">
                                                {customer.lastName}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#344054]">
                                                {customer.email}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#344054]">
                                                {customer.phoneNumber}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#344054]">
                                                {customer.dateAdded}
                                            </td>


                                        </tr>
                                    )) : <tr><p>No Results for {`${searchTerm}`}</p></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-row justify-end mt-3">
                        {
                            selectedCustomerID.length > 0
                                ? <button
                                    className={`w-[100px] px-2 py-2 text-sm  text-white ${selectedCustomerID.length > 0 ? 'bg-[#0673ff] ' : 'bg-[#d0d5dd]'}  text-center rounded-3xl  hover:shadow-md transition-all duration-200`}
                                    onClick={() => router.push('/dashboard/booking/new-customer/book-ride')}
                                >
                                    Next
                                </button>

                                : <button
                                    className={`w-[100px] px-2 py-2 text-sm  text-white.length  bg-[#d0d5dd]  text-center rounded-3xl  hover:shadow-md transition-all duration-200`}
                                >
                                    Next
                                </button>
                        }


                    </div>
                </div>
            </div>
            <AddNewCustomerModal isOpen={isOpen} closeModal={closeModal} />
        </DashboardLayout>
    </>
}

export default NewCustomerLayout