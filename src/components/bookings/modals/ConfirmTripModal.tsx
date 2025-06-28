import ModalLayout from "./ModalLayout"
import { ModalHeader } from "./ModalHeader"
import { FileQuestion } from "lucide-react"
import { useHttp } from "@/utils/useHttp"
import { useState } from "react"
import { Spinner } from "@/components/shared/spinner"
interface ConfirmTripModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tripId: string;

}

export const ConfirmTripModal = ({ isOpen, setIsOpen, tripId }: ConfirmTripModalProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const http = useHttp()
    const closeModal = () => {
        setIsOpen(false)
    }

    const confirmTrip = async () => {
        setLoading(true)
        try {
            await http.put(`admin/trips/status/${tripId}`, { status: "CONFIRMED" })
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
            modalContent="By confirming this trip you agreed that both the driver and host have been informed and are ready to proceed with the trip today"
            iconBackgroundColor="#f3a218"
            iconColor="white"
            headerText="Confirm Trip"
        />
        <div className="flex flex-row">
            <button
                className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                onClick={closeModal}
            >
                Cancel
            </button>
            <button
                onClick={confirmTrip}
                className="w-[45%] px-4 py-3 text-sm  my-5 text-white bg-[#0673ff] flex items-center justify-center  rounded-2xl  hover:shadow-md transition-all duration-200"
            >
                Confirm Trip

                {loading && <Spinner className="text-white" />}
            </button>
        </div>

    </ModalLayout>)
}