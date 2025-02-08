"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean,
    courseId: string,
    isPublished: boolean,
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onDeleteChapter = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deteled");
            router.refresh();
            router.push(`/teacher/courses/`);
        } catch (error) {
            // console.log("[Course DELETE]", error);
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }

    const onPublishChapter = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course Unpulished!!!");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course pulished successfully!");
                confetti.onOpen();
            }
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
                onClick={onPublishChapter}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDeleteChapter}>
                <Button size="sm" disabled={isLoading} >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}