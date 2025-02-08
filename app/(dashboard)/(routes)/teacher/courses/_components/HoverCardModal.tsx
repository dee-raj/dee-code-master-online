import { LucideEye } from "lucide-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export const HoverCardModal = ({ value }: any) => {
    return (
        <HoverCard>
            <HoverCardTrigger className="flex flex-row gap-x-1 cursor-pointer">
                <LucideEye /> {" View description"}
            </HoverCardTrigger>
            <HoverCardContent>
                {value && (
                    <div className="flex justify-between space-x-4 w-full h-full text-sm text-amber-600">
                        {value}
                    </div>
                )}
                {!value && (
                    <div className="flex justify-between space-x-4 text-red-500">
                        {"Description is not added."}
                    </div>
                )}
            </HoverCardContent>
        </HoverCard>
    );
}
