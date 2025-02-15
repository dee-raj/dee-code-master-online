"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isCompleted: boolean;
}

export const CourseProgressButton = ({
    courseId,
    chapterId,
    isCompleted,
    nextChapterId
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetii = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onCompleted = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });

            if (!isCompleted && !nextChapterId) {
                confetii.onOpen();
            }
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    const Icon = isCompleted ? XCircle : CheckCircle;
    return (
        <Button
            onClick={onCompleted}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Not completed" : "Mark as completed"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    );
}