"use client";

import React from 'react';
import { Linkedin, GraduationCap, BookOpen, Mail, MapPin } from 'lucide-react';
import { Logo } from '../meha-ui/logo';
import { useLanguage } from '@/context/LanguageContext';

const socialLinks = [
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "ORCID", href: "#", icon: GraduationCap },
    { name: "Google Scholar", href: "#", icon: BookOpen },
];

const Footer = () => {
    const { t, locale } = useLanguage();

    const quickLinks = [
        { name: t("header.home", "Home"), href: "/" },
        { name: t("header.about", "About"), href: "#about" },
        { name: t("header.research", "Research"), href: "#research" },
        { name: t("header.publications", "Publications"), href: "#publications" },
        { name: t("header.team", "Team"), href: "#team" },
        { name: t("header.contact", "Contact"), href: "#contact" },
    ];

    return (
        <footer className="border-t border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo & Açıklama */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <Logo />
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            {t("footer.desc")}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{t("footer.address")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 shrink-0" />
                            <a href={`mailto:${t("footer.email")}`} className="hover:text-primary transition-colors">
                                {t("footer.email")}
                            </a>
                        </div>
                    </div>

                    {/* Hızlı Linkler */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                            {t("footer.quick_links_title", "Quick Links")}
                        </h4>
                        {quickLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Sosyal / Akademik Profiller */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                            {t("footer.profiles_title", "Profiles & Citations")}
                        </h4>
                        {socialLinks.map(({ name, href, icon: Icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Alt Çizgi */}
                <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} {t("footer.copyright")}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">
                            {locale === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}
                        </a>
                        <a href="#" className="hover:text-primary transition-colors">
                            {locale === "tr" ? "Kullanım Koşulları" : "Terms of Use"}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;