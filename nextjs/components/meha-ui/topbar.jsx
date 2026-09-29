"use client"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

export const Topbar = ({ title = "Dashboard" }) => {
    const isMobile = useIsMobile();

    return (
        <div className={cn(
            "w-full px-6 flex items-center justify-between border-b border-sidebar-border",
            isMobile ? "h-12" : "h-16"
        )}>
            <div className={cn("font-medium text-lg", isMobile && "text-base")}>
                {title}
            </div>
            <Link href="/" target="_blank">
                <Button size="lg" className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>Siteyi Görüntüle</span>
                </Button>
            </Link>
        </div>
    )
}