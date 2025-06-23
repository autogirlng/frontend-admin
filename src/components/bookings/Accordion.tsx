import React, { useState, FC, ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';



interface AccordionItemProps {
    id: string;
    title: string;
    children: ReactNode;
    openItem?: string | null;
    setOpenItem?: React.Dispatch<React.SetStateAction<string | null>>;
    contentRef?: (element: HTMLElement | null) => void;
    containerClasses?: string;
}

export const AccordionItem: FC<AccordionItemProps> = ({ id, title, children, openItem, setOpenItem, contentRef, containerClasses }) => {
    const isTopLevel = setOpenItem !== undefined;
    const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
    const isOpen = isTopLevel ? openItem === id : internalIsOpen;

    const toggleOpen = (): void => {
        if (isTopLevel && setOpenItem) {
            setOpenItem(isOpen ? null : id);
        } else {
            setInternalIsOpen(!internalIsOpen);
        }
    };

    return (
        <div className={`${containerClasses} rounded-2xl mt-3`}>
            <button
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleOpen}
            >
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <ChevronDown
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    size={16}
                />
            </button>
            <div
                ref={isTopLevel && contentRef ? contentRef : null}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                style={{
                    maxHeight: isOpen ? '2000px' : '0px',
                }}
            >
                {children}
            </div>
        </div>
    );
};


const AccoordionVehicleContent = () => {
    return
}

