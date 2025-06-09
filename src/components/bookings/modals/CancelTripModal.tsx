import ModalLayout from "./ModalLayout"
import { ModalHeader } from "./ModalHeader"
import { FileQuestion } from "lucide-react"
interface CancelTripModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

export const CancelTripModal = ({ isOpen, setIsOpen }: CancelTripModalProps) => {

    const closeModal = () => {
        setIsOpen(false)
    }
    return (isOpen && <ModalLayout>
        <ModalHeader
            LucideIcon={FileQuestion}
            modalContent={`Are you sure you want to cancel this trip? This action cannot be undone.`}
            iconBackgroundColor="#f3a218"
            iconColor="white"
            headerText="Cancel Trip"
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
                Cancle Trip
            </button>
        </div>

    </ModalLayout>)
}