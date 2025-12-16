"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BottomDrawer() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Bottom Drawer</Button>
            </DialogTrigger>
            <DialogContent
                className="fixed bottom-0 left-0 w-full sm:max-w-md rounded-t-xl p-6
                   bg-white shadow-lg animate-slide-up"
            >
                <DialogHeader>
                    <DialogTitle>Bottom Drawer</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                    This drawer slides from the bottom. You can put any content here.
                </p>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
