"use client";

import { ReactNode } from "react";


export default function ModalLayout({ children }: { children: ReactNode; }) {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[50px] shadow-xl max-w-md w-full p-10">
                {children}
            </div>
        </div>
    );
}
