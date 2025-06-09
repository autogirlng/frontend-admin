import { MapPinned } from "lucide-react";
import ModalLayout from "./ModalLayout";
import { ModalHeader } from "./ModalHeader";


interface IAddressModal {
    isOpen: boolean;
    modalContent: string;
    closeModal: () => void;
}


export const AddressModal = ({ isOpen, modalContent, closeModal }: IAddressModal) => {
    return (
        <>
            {isOpen && (

                <ModalLayout>
                    <ModalHeader
                        LucideIcon={MapPinned}
                        iconBackgroundColor="#d9ffde"
                        iconColor="#0f6c1f"
                        modalContent={modalContent}
                        headerText="Address" />
                    <button
                        onClick={closeModal}
                        className="w-full px-4 py-2 text-sm font-bold my-5 text-[#344054] bg-[#f0f2f5] text-center rounded hover:bg-[#e0e2e5] hover:shadow-md transition-all duration-200"
                    >
                        Close
                    </button>
                </ModalLayout>


            )}
        </>
    );
};
