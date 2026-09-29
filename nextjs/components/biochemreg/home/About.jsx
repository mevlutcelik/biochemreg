"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    const stats = [
        { count: "86", label: t("about.stats.publications", "Publications") },
        { count: "14", label: t("about.stats.funded_projects", "Funded Projects") },
        { count: "37", label: t("about.stats.collaborators", "Collaborators") },
        { count: "21", label: t("about.stats.years_active", "Years Active") },
    ];

    return (
        <section id="about" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            {/* Üst Başlık (Vol. mark) */}
            <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-3">
                {t("about.vol", "Vol. I — Director")}
            </p>

            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16">
                {/* Sol Taraf: Metin */}
                <div>
                    <h2 className="font-heading text-4xl text-foreground mb-6 tracking-tight">
                        {t("about.title", "About the Director")}
                    </h2>
                    <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
                        <p>{t("about.p1")}</p>
                        <p>{t("about.p2")}</p>
                        <p>{t("about.p3")}</p>
                    </div>
                </div>

                {/* Sağ Taraf: İstatistik Kartları */}
                <div className="grid grid-cols-2 gap-5">
                    {stats.map((stat, idx) => (
                        <div 
                            key={idx} 
                            className="border border-border rounded-xl p-6 bg-card transition-all duration-250 hover:-translate-y-[3px] hover:shadow-lg hover:shadow-primary/10"
                        >
                            <p className="font-heading text-4xl text-primary">{stat.count}</p>
                            <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;