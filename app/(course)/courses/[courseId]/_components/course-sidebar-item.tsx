"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

interface CourseSideBarItemProrps {
    id: string;
    label: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean
}

export const CourseSideBarItem = ({
    id,
    label,
    isCompleted,
    courseId,
    isLocked
}: CourseSideBarItemProrps) => {
    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle2 : PlayCircle);
    const isActive = pathname?.includes(id);

    const handleChapterOpen = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }

    return (
        <button
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500]  pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-slate-700 bg-slate-200/20 hover:text-slate-700 hover:bg-slate-200/20",
                isCompleted && "text-emerald-700 hover:text-emerald-600",
                isCompleted && isActive && "bg-emerald-200/20"
            )}
            onClick={handleChapterOpen}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-emerald-500",
                        isActive && "text-slate-700",
                        isCompleted && "text-emerald-700"
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2  border-slate-700 h-full transition-all",
                isActive && "opacity-100",
                isCompleted && "border-emerald-700"
            )} />
        </button>
    );
}