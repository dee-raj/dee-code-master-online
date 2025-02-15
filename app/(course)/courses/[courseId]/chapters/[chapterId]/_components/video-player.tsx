"use client";

import axios from "axios";
import { cn } from "@/lib/utils";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
    ssr: false,
});

interface VideoPlayerProps {
    chapterId: string;
    title: string;
    courseId: string;
    nextChapterId?: string;
    playbackId: string;
    isLocked: boolean;
    completeOnEnd: boolean;
}

export const VideoPlayer = ({
    chapterId,
    title,
    courseId,
    completeOnEnd,
    nextChapterId,
    isLocked,
    playbackId,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onVideoEnded = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true
                });
            }
            if (!nextChapterId) {
                confetti.onOpen();
            }

            toast.success("Progress updated");
            router.refresh();

            if (nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
        } catch (error) {
            toast.error("Something error");
        }
    }

    return (
        <div className="relative aspect-video">
            {!isLocked && !isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This chapter is locked.</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onVideoEnded}
                    autoPlay={isReady}
                    playbackId={playbackId}
                />
            )}
        </div>
    );
};
