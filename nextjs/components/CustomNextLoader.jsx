"use client"
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function CustomNextLoader() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !resolvedTheme) return null;

    //TODO: Rekleri düzenle
    const color = resolvedTheme === 'dark' ? '#788ced' : '#0d1a5e';
    const shadow = resolvedTheme === 'dark'
        ? '0 0 10px #788ced, 0 0 5px #788ced'
        : '0 0 10px #0d1a5e, 0 0 5px #0d1a5e';

    return (
        <NextTopLoader
            color={color}
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow={shadow}
        />
    );
}
