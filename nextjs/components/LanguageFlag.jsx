"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * LanguageFlag
 * Çoklu dil bayrak bileşeni:
 * - 'en': Birleşik Krallık / İngiltere bayrağı (fi fi-gb)
 * - 'tr': Türkiye bayrağı (fi fi-tr)
 */
export function LanguageFlag({ code = "en", className = "" }) {
    if (code === "en") {
        return (
            <span
                className={cn("fi fi-gb rounded-[2px] shadow-2xs shrink-0 inline-block align-middle", className)}
                title="English (UK)"
                aria-label="English flag"
            />
        );
    }

    return (
        <span
            className={cn("fi fi-tr rounded-[2px] shadow-2xs shrink-0 inline-block align-middle", className)}
            title="Türkçe"
            aria-label="Türk bayrağı"
        />
    );
}

export default LanguageFlag;
