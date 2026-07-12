"use client"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils";
import { use } from "react";

export const Topbar = ({ title = "Dashboard" }) => {
    const isMobile = useIsMobile();

    return (
        <div className={cn(
            "w-full px-6 flex items-center justify-between border-b border-sidebar-border",
            isMobile ? "h-12" : "h-14"
            )}>
            <div className={cn("font-medium text-lg", isMobile && "text-base")}>
                {title}
            </div>
        </div>
    )
}