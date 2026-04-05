import { AddButton, HomeButton, ScreenMessage } from "@/components/screen-message";

export default function NotFound() {
    return (
        <ScreenMessage
            title="404 Page Not Found"
            description="Seems like this page is invalid"
            buttons={<>
                <HomeButton />
                <AddButton />
            </>}
        >
        </ScreenMessage>
    );
}