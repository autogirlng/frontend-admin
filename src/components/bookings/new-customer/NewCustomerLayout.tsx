'use client';
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { AddNewCustomerModal } from "../modals/new-customer/AddNewCustomerModal"
import { useHttp } from "@/utils/useHttp";
import { User, Customers } from "@/types";
import Image from "next/image";
import { Spinner } from "@/components/shared/spinner";


const NewCustomerLayout = () => {
    const [selectedCustomerID, setSelectedCustomerID] = useState<string>('');
    const [filteredCustomers, setFilteredCustomers] = useState<User[]>([])
    const [loadingCustomersData, setLoadingCustomerData] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isAddNewCustomerModalOpen, setIsAddNewCustomerModalOpen] = useState<boolean>(false)
    const router = useRouter()
    const http = useHttp()
    const baseURL = `/user/all?limit=10&page=1&userRole=CUSTOMER&search=${searchTerm}`


    const closeAddNewCustomerModal = () => {
        setIsAddNewCustomerModalOpen(false)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentSearchTerm = e.target.value;
        setSearchTerm(currentSearchTerm);
    };

    const handleNextPageClick = () => {
        if (selectedCustomerID) {
            router.push(`/dashboard/booking/new-customer/book-ride?customerID=${selectedCustomerID}`)
        }
    }

    const fetchCustomers = async (url: string) => {
        setLoadingCustomerData(true)
        const customers = await http.get<Customers>(url)
        if (customers) {
            setFilteredCustomers(customers.data)
        }
        setLoadingCustomerData(false)
    }
    useEffect(() => {
        fetchCustomers(baseURL)
    }, [searchTerm])

    return (
        <>
            <DashboardLayout title="Select Customer" currentPage="/dashboard/customer/new-customer">
                <div className="w-full bg-white">
                    <div className="p-4">

                        <h1 className="text-4xl font-bold mb-6">Select Customer</h1>

                        <div className="flex justify-between mb-6 flex-wrap gap-4">
                            <div className="relative flex-1 min-w-[200px] max-w-3xl">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by customer, customer ID"
                                    className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Used text-sm instead of inline style
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            <button
                                className="px-4 py-2 text-sm text-white bg-[#0673ff] text-center rounded-2xl hover:shadow-md transition-all duration-200 min-w-[150px] lg:w-auto" // Added min-w, lg:w-auto for better responsiveness
                                onClick={() => setIsAddNewCustomerModalOpen(true)}
                            >
                                + Add New Customer
                            </button>
                        </div>
                        {
                            loadingCustomersData ?
                                <div className="flex flex-row items-center justify-center mt-4 ">
                                    <Spinner />
                                </div>
                                : filteredCustomers.length !== 0 ? <div
                                    className="overflow-x-auto rounded-t-lg border border-[#D0D5DD]"
                                >

                                    <table className="min-w-full divide-y divide-[#D0D5DD]">
                                        <thead>
                                            <tr className="bg-[#F7F9FC]">
                                                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                                    Customer ID
                                                </th>
                                                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                                    First Name
                                                </th>
                                                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                                    Last Name
                                                </th>
                                                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                                    Email
                                                </th>
                                                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                                    Phone Number
                                                </th>
                                                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                                    Date Added
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-[#D0D5DD]">
                                            {
                                                filteredCustomers.length > 0 && (
                                                    filteredCustomers.map((customer) => (
                                                        <tr
                                                            key={customer.id}
                                                            className={`cursor-pointer ${customer.id === selectedCustomerID ? 'bg-[#edf8ff]' : ''} hover:bg-[#edf8ff]`}
                                                            onClick={() => setSelectedCustomerID(customer.id)}
                                                        >
                                                            <td className="px-4 py-4 text-sm font-medium text-[#344054]">
                                                                {customer.id}
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
                                                                {customer.createdAt.split('T')[0]}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }
                                        </tbody>
                                    </table>

                                </div> : <></>
                        }


                        {
                            filteredCustomers.length === 0 && !loadingCustomersData && <div className="flex text-center flex-col justify-center items-center py-8 text-gray-500 w-full">
                                <Image src="/icons/empty_search.png" alt="Empty Search" width={200} height={200} />
                                <h3 className="text-[#667185]">No Results for "{searchTerm}"</h3>
                                <button
                                    className="px-4 mt-3 py-2 text-sm text-white bg-[#0673ff] text-center rounded-2xl hover:shadow-md transition-all duration-200 min-w-[150px] lg:w-auto" // Added min-w, lg:w-auto for better responsiveness
                                    onClick={() => setIsAddNewCustomerModalOpen(true)}
                                >
                                    + Add New Customer
                                </button>
                            </div>
                        }
                        <div className="flex flex-row justify-end mt-4">

                            <button
                                className={`w-[100px] px-2 py-2 text-sm text-white text-center rounded-3xl hover:shadow-md transition-all duration-200 ${selectedCustomerID.length > 0 ? 'bg-[#0673ff]' : 'bg-[#d0d5dd] cursor-not-allowed'
                                    }`}
                                onClick={handleNextPageClick}
                                disabled={selectedCustomerID.length === 0}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <AddNewCustomerModal isOpen={isAddNewCustomerModalOpen} closeModal={closeAddNewCustomerModal} />
            </DashboardLayout>
        </>
    )
}

export default NewCustomerLayout