"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LanguageFlag } from "@/components/LanguageFlag";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className = "", size = "default" }) {
    const { locale, setLocale, languages } = useLanguage();

    return (
        <Select value={locale} onValueChange={(val) => setLocale(val)}>
            <SelectTrigger
                size={size}
                aria-label="Select language"
                className={cn(
                    "min-w-[125px] h-9 rounded-full border-border/80 bg-background/80 px-3 text-xs font-medium shadow-2xs hover:bg-muted/40 transition-colors focus:ring-2 focus:ring-primary/20 cursor-pointer",
                    className
                )}
            >
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent
                align="end"
                className="min-w-[140px] rounded-2xl border-border/80 p-1 shadow-lg bg-popover/95 backdrop-blur-md"
            >
                {languages.map((lang) => (
                    <SelectItem
                        key={lang.code}
                        value={lang.code}
                        className="rounded-xl text-xs py-2 px-2.5 cursor-pointer font-medium hover:bg-accent focus:bg-accent"
                    >
                        <span className="flex items-center gap-2">
                            <LanguageFlag code={lang.code} className="w-4.5 h-4.5 rounded-[3px]" />
                            <span>{lang.label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default LanguageSwitcher;
