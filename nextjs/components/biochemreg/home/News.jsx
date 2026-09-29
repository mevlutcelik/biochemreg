"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const News = () => {
    const { t } = useLanguage();
    const newsItems = t("news.items") || [];

    return (
        <section id="news" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-3">
                {t("news.vol", "Vol. V — News")}
            </p>
            <h2 className="font-heading text-4xl text-foreground tracking-tight mb-12">
                {t("news.title", "News & Updates")}
            </h2>

            <div className="relative max-w-3xl">
                {/* Dikey Çizgi */}
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border"></div>

                <div className="space-y-10">
                    {Array.isArray(newsItems) && newsItems.map((item, index) => (
                        <div key={index} className="relative pl-10">
                            {/* Nokta */}
                            <span className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ${item.isActive ? 'bg-primary' : 'bg-primary/40'}`}></span>
                            
                            {/* Tarih Etiketi */}
                            <span className="inline-block text-[11px] font-medium tracking-wide uppercase bg-secondary/10 text-secondary px-2.5 py-1 rounded-full mb-2">
                                {item.date}
                            </span>
                            
                            <p className="font-medium text-foreground">
                                {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;