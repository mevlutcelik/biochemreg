"use client";

import { usePathname } from "next/navigation";
import { Logo } from "../meha-ui/logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Header = () => {
    const pathname = usePathname();
    const { t, locale } = useLanguage();

    const navItems = [
        { label: t("header.home", "Home"), href: "/" },
        { label: t("header.director", locale === "tr" ? "Direktör" : "Director"), href: "/director" },
        { label: t("header.members", locale === "tr" ? "Üyeler" : "Members"), href: "/members" },
        { label: t("header.about", "About"), href: "/#about" },
        { label: t("header.research", "Research"), href: "/#research" },
        { label: t("header.publications", "Publications"), href: "/#publications" },
        { label: t("header.news", "News"), href: "/#news" },
        { label: t("header.contact", "Contact"), href: "/#contact" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
                <Logo />

                <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    'relative transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:bg-secondary after:transition-[width] after:duration-300 hover:text-secondary hover:after:w-full',
                                    isActive
                                        ? "text-primary hover:text-primary font-semibold after:w-full after:bg-primary"
                                        : "text-foreground/80 after:w-0"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
};

export default Header;