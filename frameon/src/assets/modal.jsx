import React from "react";

export default function Modal({ open, onClose, children }) {
    return (
        <div onClick={onClose} className={`
        fixed inset-0 flex justify-center items-center 
        transition-colors z-40
        ${open ? "visible bg-black/20" : "invisible"}
        `}>
            <div
            onClick={e => e.stopPropagation()}
            className={`
            bg-gray-900 rounded-xl shadow p-6 transition-all
            ${open ? "scale-100 opactiy-100" : "scale-125 opacity-0"}
            `}>
                <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-lg
                text-white bg-gray-900 hover:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
                {children} 
            </div>
        </div>
    )
}