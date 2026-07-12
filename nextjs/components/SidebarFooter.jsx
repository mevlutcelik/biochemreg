import { useUserContext } from "@/context/UserContext";
import { useLogoutWithDialog } from "@/hooks/useLogoutWithDialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Bell, LogOut, Sparkles } from "lucide-react";
import { LogoutDialog } from "./LogoutDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme/ThemeToggle";

const SidebarFooter = () => {
    const user = useUserContext();

    const isMobile = useIsMobile();

    const {
        open,
        loading,
        isLogout,
        showDialog,
        closeDialog,
        handleLogout,
    } = useLogoutWithDialog();

    if (!user) {
        return (
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm animate-pulse">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-muted"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-2 text-left text-sm leading-tight">
                    <div className="h-3 rounded border bg-muted max-w-24"></div>
                    <div className="h-2.5 rounded border bg-muted max-w-36"></div>
                </div>
            </div>
        )
    }

    return (
        (<>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="shadow-md border border-sidebar-border bg-background w-full justify-start rounded-lg h-14 gap-3 px-2 cursor-pointer"
                        variant="ghost"
                        size="lg">
                        <Avatar className="h-10 w-10 rounded-lg">
                            {/* <AvatarImage src='/avatars/shadcn.jpg' alt={user.name}/> */}
                            <AvatarFallback
                                className="rounded-lg bg-sky-800/5 text-sky-900 dark:bg-sky-300/20 dark:text-sky-300">{user.name[0].toUpperCase() + user.name[1].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                        <CaretSortIcon className="ml-auto size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}>
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                {/* <AvatarImage src='/avatars/shadcn.jpg' alt={user.name}/> */}
                                <AvatarFallback
                                    className="rounded-lg bg-sky-800/5 text-sky-900 dark:bg-sky-300/20 dark:text-sky-300">{user.name[0].toUpperCase() + user.name[1].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight text-foreground">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ThemeToggle fullButton={true} />
                    {/* <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-not-allowed opacity-50 pointer-events-none">
                            <Sparkles />
                            Agent Mode (Yakında)
                        </DropdownMenuItem>
                    </DropdownMenuGroup> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-not-allowed opacity-50 pointer-events-none">
                            <Bell />
                            Bildirimler
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup asChild>
                        <Button className="w-full justify-start cursor-pointer text-destructive hover:text-destructive" variant="ghost" onClick={showDialog}>
                            <LogOut />
                            Çıkış Yap
                        </Button>
                        {/* <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            showDialog();
                        }} className="text-red-500 hover:!text-red-900 hover:!bg-red-50 dark:text-red-300 dark:hover:!text-red-200 dark:hover:!bg-red-950 cursor-pointer">
                            <LogOut />
                            Çıkış Yap
                        </DropdownMenuItem> */}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <LogoutDialog
                open={open}
                onClose={closeDialog}
                onConfirm={handleLogout}
                loading={loading}
                isLogout={isLogout}
                title={`Çıkış yapmak istediğine emin misin ${user.name}?`}
                description="Çıkış sonrası tekrar giriş yapmanız gerekecek."
            />
        </>)
    );
};

export default SidebarFooter;