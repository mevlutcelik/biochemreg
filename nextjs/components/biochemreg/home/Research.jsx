"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Research = () => {
    const { t } = useLanguage();
    const items = t("research.items") || [];

    return (
        <section id="research" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            {/* Üst Başlık */}
            <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-3">
                {t("research.vol", "Vol. II — Research")}
            </p>
            
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                <h2 className="font-heading text-4xl text-foreground tracking-tight">
                    {t("research.title", "Research Highlights")}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                    {t("research.subtitle", "Selected ongoing projects across affinity separation, biomaterials, and translational medicine.")}
                </p>
            </div>

            {/* Grid Kartlar */}
            <div className="grid md:grid-cols-3 gap-6">
                {Array.isArray(items) && items.map((item, index) => (
                    <div 
                        key={index} 
                        className="border border-border rounded-xl p-7 bg-card transition-all duration-250 hover:-translate-y-[3px] hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20"
                    >
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-4">
                            {item.title}
                        </p>
                        <p className="text-[15px] leading-relaxed text-foreground/85">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Research;