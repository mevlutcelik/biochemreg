"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { translations } from "@/lib/i18n/translations";

const LanguageContext = createContext({
    locale: "en",
    setLocale: () => {},
    t: (key, fallback) => fallback || key,
    languages: [],
});

export const LANGUAGES = [
    { code: "en", label: "English", short: "EN", flagClass: "fi fi-gb", flagEmoji: "🇬🇧" },
    { code: "tr", label: "Türkçe", short: "TR", flagClass: "fi fi-tr", flagEmoji: "🇹🇷" },
];

export function LanguageProvider({ children }) {
    const [locale, setLocaleState] = useState("en");

    // İstemci tarafında kayıtlı dil tercihini yükle (Varsayılan: İngilizce)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("biochemreg_locale");
            if (saved && (saved === "en" || saved === "tr")) {
                setLocaleState(saved);
                document.documentElement.lang = saved;
            } else {
                setLocaleState("en");
                document.documentElement.lang = "en";
            }
        } catch {
            setLocaleState("en");
        }
    }, []);

    const setLocale = useCallback((newLocale) => {
        if (newLocale !== "en" && newLocale !== "tr") return;
        setLocaleState(newLocale);
        try {
            localStorage.setItem("biochemreg_locale", newLocale);
            document.documentElement.lang = newLocale;
        } catch {
            // ignore
        }
    }, []);

    // Noktalı anahtar çözümleyici: t("about.title") ya da t("header.home")
    const t = useCallback((path, fallback = "") => {
        if (!path) return fallback;
        const currentDict = translations[locale] || translations.en;
        const fallbackDict = translations.en;

        const resolve = (obj, p) => {
            return p.split(".").reduce((prev, curr) => {
                return prev ? prev[curr] : undefined;
            }, obj);
        };

        const res = resolve(currentDict, path);
        if (res !== undefined) return res;

        const fb = resolve(fallbackDict, path);
        if (fb !== undefined) return fb;

        return fallback || path;
    }, [locale]);

    const value = useMemo(() => ({
        locale,
        setLocale,
        t,
        languages: LANGUAGES,
    }), [locale, setLocale, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
