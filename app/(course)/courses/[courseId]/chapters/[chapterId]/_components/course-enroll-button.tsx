"use client";

import axios from "axios";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    courseId: string;
    price: number;
}
export const CourseEnrollButton = ({
    courseId,
    price
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const onEnroll = async () => {
        try {
            const response = await axios.post(`/api/courses/${courseId}/checkout`);

            window.location.assign(response.data.url);
        } catch (error) {
            console.log("Something Error...", error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            size={'sm'}
            className="w-full md:w-auto"
            onClick={onEnroll}
            disabled={isLoading}
        >
            Enroll now for <span className="text-xl font-mono font-semibold">{formatPrice(price)}</span> only!
        </Button>
    );
}
