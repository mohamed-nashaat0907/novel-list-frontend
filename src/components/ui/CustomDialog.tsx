import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// import { useState } from 'react'
// import Button from './Button'

interface Iprobs {
    isOpen: boolean;
    closeDialog: () => void;
    title: string;
    description: string;
    children?: React.ReactNode;
    // actionFunction: () => void;
    // userId?: string;
}

function CustomDialog({ isOpen, closeDialog,title,description,children }: Iprobs) {

    return (
        <>
            {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
            <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold capitalize text-center">{title}</DialogTitle>
                        <Description className="capitalize text-center">{description}</Description>
                        {children}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
export default CustomDialog;