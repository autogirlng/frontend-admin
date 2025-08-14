import ModalLayout from "./ModalLayout"
import { ModalHeader } from "./ModalHeader"
import { FileQuestion } from "lucide-react"
import { useState } from "react"
import { useHttp } from "@/utils/useHttp"
import { Spinner } from "@/components/shared/spinner"
interface CancelTripModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tripId: string;

}

export const CancelTripModal = ({ isOpen, setIsOpen, tripId }: CancelTripModalProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const http = useHttp();
    const closeModal = () => {
        setIsOpen(false)
    }
    const cancelTrip = async () => {
        setLoading(true)
        try {
            await http.put(`admin/trips/status/${tripId}`, { status: "CANCELLED" })
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
        window.location.reload();
        closeModal()
    }

    return (isOpen && <ModalLayout>
        <ModalHeader
            LucideIcon={FileQuestion}
            modalContent={`Are you sure you want to cancel this trip? This action cannot be undone.`}
            iconBackgroundColor="#f3a218"
            iconColor="white"
            headerText="Cancel Trip"
        />


        <div className="flex flex-row">

            <button
                className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                onClick={closeModal}
            >
                Cancel
            </button>

            <button
                onClick={cancelTrip}
                className="w-[45%] px-4 py-3 text-sm  my-5 text-white bg-[#0673ff] flex items-center justify-center  rounded-2xl  hover:shadow-md transition-all duration-200"
            >
                Cancle Trip
                {loading && <Spinner className="text-white" />}
            </button>
        </div>

    </ModalLayout>)
}