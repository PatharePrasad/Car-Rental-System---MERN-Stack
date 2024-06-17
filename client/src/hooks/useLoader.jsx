import { useState } from "react";

export default function useLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return { isLoading, showLoader, hideLoader };
}
