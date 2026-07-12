"use client"
import {
    Sidebar,
    SidebarProvider,
} from "@/components/meha-ui/sidebar"
import UserProvider from "@/components/UserProvider";

import {
    Compass,
    CreditCard,
    Folder,
    Settings,
    User,
} from "lucide-react"
import SidebarFooter from "@/components/SidebarFooter";

export default function Layout({ children }) {
    return (
        <UserProvider>
            <SidebarProvider>
                <Sidebar
                    menuGroups={[
                        {
                            title: "Home",
                            links: [
                                {
                                    title: "Dashboard",
                                    href: "/dashboard",
                                    icon: Compass,
                                },
                                {
                                    title: "Projects",
                                    icon: Folder,
                                    children: [
                                        { title: "All Projects", href: "/projects" },
                                        { title: "Create Project", href: "/projects/create" },
                                    ],
                                },
                                {
                                    title: "Settings",
                                    href: "/settings",
                                    icon: Settings,
                                },
                            ],
                        },
                        {
                            title: "User",
                            links: [
                                {
                                    title: "Profile",
                                    href: "/dashboard/profile",
                                    icon: User,
                                },
                                {
                                    title: "Billing",
                                    href: "/billing",
                                    icon: CreditCard,
                                },
                                {
                                    title: "Account",
                                    icon: Settings,
                                    children: [
                                        { title: "Security", href: "/security" },
                                        { title: "Privacy", href: "/privacy" },
                                    ],
                                },
                            ],
                        },
                    ]}
                    children={children}
                    footer={<SidebarFooter />}
                />
            </SidebarProvider>
        </UserProvider>
    )
}