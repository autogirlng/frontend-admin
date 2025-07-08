import { AddNewDriver } from "@/components/bookings/modals/AddNewDriver";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { Spinner } from "@/components/shared/spinner";
import { BookingInformation } from "@/utils/types";
import { AssignedDriver, DriverResponse } from "@/utils/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";


const AssignDriverLayout = () => {
    const params = useParams();
    const bookingId = params.id as string;
    const [addNewDriverModalOpen, setAddNewDriverModalOpen] = useState(false)
    const http = useHttp();
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [driverId, setDriverId] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const { data: drivers, isLoading, isError, refetch } = useQuery({
        queryKey: ["drivers", searchTerm],
        queryFn: () => http.get<DriverResponse>(`/drivers/list?search=${encodeURIComponent(searchTerm)}`),
        retry: true,
    });

    const { data: booking } = useQuery({
        queryKey: ["booking"],
        queryFn: () => http.get<BookingInformation>(`/bookings/getSingle/${bookingId}`),
        retry: true,
    });

    const assignDriver = async () => {
        setLoading(true)
        try {
            await http.post<AssignedDriver>('/drivers', { bookingId, driverId, vehicleId: booking?.vehicleId })
            toast.success("Driver assigned to vehicle and booking. ")
            router.push(`/dashboard/bookings/${bookingId}`)


        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    return <>
        <div className="w-full bg-white">
            <div className="p-4">

                <h1 className="text-4xl font-bold mb-6">Assign Driver</h1>

                <div className="flex justify-between mb-6 flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-3xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by driver id, name, email & phone"
                            className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Used text-sm instead of inline style
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="px-4 py-2 text-sm text-white bg-[#0673ff] text-center rounded-2xl hover:shadow-md transition-all duration-200 min-w-[150px] lg:w-auto" // Added min-w, lg:w-auto for better responsiveness
                        onClick={() => setAddNewDriverModalOpen(true)}
                    >
                        + Add New Driver
                    </button>
                </div>
                {
                    isLoading ? isError ? <p>An error occured</p> :
                        <div className="flex justify-center"><Spinner /></div> :
                        <div className="overflow-x-auto rounded-t-lg border border-[#D0D5DD]">
                            <table className="min-w-full divide-y divide-[#D0D5DD]">
                                <thead>
                                    <tr className="bg-[#F7F9FC]">
                                        <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                            Driver Id
                                        </th>
                                        <th className="text-left  py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                            Driver Name
                                        </th>

                                        <th className="text-left  py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                            Phone Number
                                        </th>
                                        <th className="text-left  py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">
                                            Driver Email
                                        </th>


                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#D0D5DD]">
                                    {
                                        drivers?.data.map((driver) => {
                                            return <tr key={driver.id} onClick={() => setDriverId(driver.id)}
                                                className={`border-b border-[#D0D5DD] ${driverId === driver.id && "bg-[#edf8ff]"} hover:bg-[#edf8ff] cursor-pointer`}>
                                                <td className="px-4 py-4 text-sm text-nowrap text-[#344054]">{driver.id}</td>
                                                <td className="px-4 py-4 text-sm text-nowrap text-[#344054]">{driver.firstName} {driver.lastName}</td>
                                                <td className="px-4 py-4 text-sm text-nowrap text-[#344054]">{driver.phoneNumber}</td>
                                                <td className="px-4 py-4 text-sm text-nowrap text-[#344054]">{driver.email}</td>
                                            </tr>
                                        })
                                    }



                                </tbody>
                            </table>  </div>
                }

                <div className="flex flex-row justify-end mt-4">
                    <button
                        onClick={assignDriver}
                        className={`w-[100px] px-2 py-2 text-sm text-white text-center rounded-3xl hover:shadow-md flex items-center justify-center ${driverId ? 'bg-[#0673ff]' : 'bg-[#ebebeb]'}`}
                    >
                        Assign {loading && <Spinner className="text-white" />}
                    </button>
                </div>
            </div>
        </div>
        <AddNewDriver isOpen={addNewDriverModalOpen} modalContent="Add Driver" refetch={refetch} closeModal={() => setAddNewDriverModalOpen(false)} />
    </>
}

export { AssignDriverLayout }