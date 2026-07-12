import { Topbar } from "@/components/meha-ui/topbar";
import * as Typography from "@/components/ui/typography";

export default function Profile() {
    return (
        <>
            <Topbar title="Profile" />
            <div className="p-6">
                <Typography.H1>Profile Page</Typography.H1>
                <Typography.P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nunc, eget aliquam nisl nunc vel nisl. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nunc, eget aliquam nisl nunc vel nisl.
                </Typography.P>
            </div>
        </>
    )
};