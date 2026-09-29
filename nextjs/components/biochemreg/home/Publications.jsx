"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Publications = () => {
    const { t } = useLanguage();
    const publications = t("publications.items") || [];

    return (
        <section id="publications" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-3">
                {t("publications.vol", "Vol. III — Publications")}
            </p>
            
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <h2 className="font-heading text-4xl text-foreground tracking-tight">
                    {t("publications.title", "Selected Publications")}
                </h2>
                <a href="#" className="text-sm text-primary border-b border-primary/30 hover:border-primary pb-0.5 transition-colors">
                    {t("publications.view_full", "View full list →")}
                </a>
            </div>

            <div className="border border-border rounded-xl bg-card overflow-hidden">
                {/* Tablo Başlığı */}
                <div className="grid grid-cols-[70px_1fr_auto] gap-4 px-6 py-4 border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <span>{t("publications.year", "Year")}</span>
                    <span>{t("publications.pub_title", "Title")}</span>
                    <span>{t("publications.journal", "Journal")}</span>
                </div>
                
                {/* Liste */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {Array.isArray(publications) && publications.map((pub, index) => (
                        <div 
                            key={index} 
                            className="grid grid-cols-[70px_1fr_auto] gap-4 px-6 py-4 border-b border-border last:border-0 items-start hover:bg-accent transition-colors"
                        >
                            <span className="text-sm text-muted-foreground">{pub.year}</span>
                            <span className="text-[15px] text-foreground/90">{pub.title}</span>
                            <span className="text-sm text-muted-foreground text-right whitespace-nowrap">{pub.journal}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Publications;