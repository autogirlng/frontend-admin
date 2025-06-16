import ModalLayout from "../ModalLayout"
import { ModalHeader } from "../ModalHeader"
import { FileQuestion } from "lucide-react"
interface ConfirmTripModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

export const ConfirmTripModal = ({ isOpen, setIsOpen }: ConfirmTripModalProps) => {

    const closeModal = () => {
        setIsOpen(false)
    }
    return (isOpen && <ModalLayout>
        <ModalHeader
            LucideIcon={FileQuestion}
            modalContent="By confirming this trip you agreed that both the driver and host have been informed and are ready to proceed with the trip today"
            iconBackgroundColor="#f3a218"
            iconColor="white"
            headerText="Confirm Trip"
        />

        <div>
            <button
                className="w-[40%] px-4 py-3 me-[5%] text-sm  my-5 text-[#344054] bg-[#d0d5dd] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
                onClick={closeModal}
            >
                Cancel
            </button>
            <button

                className="w-[45%] px-4 py-3 text-sm  my-5 text-white bg-[#0673ff] text-center rounded-2xl  hover:shadow-md transition-all duration-200"
            >
                Confirm Trip
            </button>
        </div>

    </ModalLayout>)
}