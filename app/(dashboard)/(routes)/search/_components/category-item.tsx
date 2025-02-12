"use client";

import { cn } from "@/lib/utils";

import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";
import { IconType } from "react-icons";
import qs from 'query-string';

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: IconType;
}

const CategoryItem = ({
    label,
    value,
    icon: Icon
}: CategoryItemProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentTitle = searchParams.get('title');
    const currentCategoryId = searchParams.get('categoryId');
    const isSelected = currentCategoryId === value;


    const handleCategorySelect = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <button
            className={cn(
                "py-2 px-3 text-sm border border-s-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
                isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
            )}
            type="button"
            onClick={handleCategorySelect}
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )

}

export default CategoryItem;