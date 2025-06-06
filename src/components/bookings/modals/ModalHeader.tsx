import { LucideIconType } from "@/utils/types";



interface IModalHeader {
    LucideIcon: LucideIconType;
    iconColor: string;
    iconBackgroundColor: string;
    modalContent: string;
    headerText: string;
}

export const ModalHeader = ({ LucideIcon, modalContent, iconColor, iconBackgroundColor, headerText }: IModalHeader) => {
    return (
        <>
            <h3 className="text-xl flex items-center font-bold mb-4 space-x-2">
                <span className={`bg-[${iconBackgroundColor}] p-2 rounded-md`}>
                    <LucideIcon color={iconColor} className="w-5 h-5" />
                </span>
                <span>{headerText}</span>
            </h3>

            <p className=" text-start text-sm">{modalContent}</p>
        </>
    )
}