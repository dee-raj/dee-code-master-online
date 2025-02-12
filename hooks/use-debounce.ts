import { useEffect, useState } from "react";

export function useDebounce<D>(value: D, delay?: number): D {
    const [debouncedValue, setDebouncedValue] = useState<D>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    return debouncedValue;
}
