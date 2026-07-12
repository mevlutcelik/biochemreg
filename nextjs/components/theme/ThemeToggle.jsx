"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle({ fullButton = false }) {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className='w-7 h-7'>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {!fullButton ? (
                    <Button variant="ghost" size="icon" className="w-7 h-7 cursor-pointer">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                ) : (
                    <Button variant="ghost" className="w-full justify-start cursor-pointer">
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden" />
                        <Moon className="mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hidden dark:block" />
                        {theme === "light" ? "Açık Tema" : theme === "dark" ? "Koyu Tema" : "Sistem Teması"}
                    </Button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Açık Tema
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Koyu Tema
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("system")}>
                    Sistem Teması
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
