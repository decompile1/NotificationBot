import { useEffect } from "react";

/**
 * This is a hook that handles the closure of a component when clicked outside of the modal class.
 * This component must be mounted within the component that is being closed.
 */
export function ClickOutside({ onClose }: { onClose: () => void; }) {
    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent): void => {
            // @ts-expect-error: because yeah
            if (!event.target?.closest(".suspicious-modal")) {
                onClose();
            }
        };

        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    return <></>;
}