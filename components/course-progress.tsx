"use client";

import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "small";
};

const colorByVariant = {
    default: "text-sky-700",
    success: "ext-emerald-700"
};
const sizeByVariant = {
    default: "text-sm",
    small: "text-xs"
};

export const CourseProgress = ({
    variant,
    value,
    size
}: CourseProgressProps) => {
    return (
        <div>
            <Progress
                value={value}
                className="h-2"
                variant={variant}
            />
            <p className={cn(
                "font-medium mt-2 text-sky-700",
                colorByVariant[variant || "default"],
                sizeByVariant[size || "default"],
            )}> {Math.round(value)} % Completed.</p>
        </div>
    );
}
