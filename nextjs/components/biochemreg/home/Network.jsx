"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Network = () => {
    const { t } = useLanguage();
    const collaborations = t("network.items") || [];

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-3">
                {t("network.vol", "Vol. VI — Network")}
            </p>
            <h2 className="font-heading text-4xl text-foreground tracking-tight mb-12">
                {t("network.title", "Links & Collaborations")}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {Array.isArray(collaborations) && collaborations.map((collab, index) => (
                    <div 
                        key={index} 
                        className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-250 hover:-translate-y-[3px] hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20"
                    >
                        {/* Gradyan Başlık Alanı */}
                        <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center text-white/30 font-heading text-3xl">
                            {collab.acronym}
                        </div>
                        
                        <div className="p-6">
                            <p className="font-medium text-foreground mb-1.5">{collab.name}</p>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{collab.desc}</p>
                            <a 
                                href="#" 
                                className="text-sm text-primary border-b border-primary/30 hover:border-primary transition-colors"
                            >
                                {t("network.visit", "Visit site →")}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Network;