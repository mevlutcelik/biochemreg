"use client";

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { get } from '@/lib/api';
import Link from 'next/link';

const Team = () => {
    const { t, locale } = useLanguage();
    const [dbMembers, setDbMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchTeam = async () => {
            try {
                const res = await get({ endpoint: `lab-members?locale=${locale}` });
                if (isMounted && res && res.status && Array.isArray(res.members) && res.members.length > 0) {
                    setDbMembers(res.members);
                } else if (isMounted) {
                    setDbMembers([]);
                }
            } catch {
                if (isMounted) setDbMembers([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTeam();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    // DB'de kayıt varsa DB üyelerini, yoksa translations'tan fallback veriyi kullan
    const fallbackMembers = t("team.members") || [];
    const membersToDisplay = dbMembers.length > 0 ? dbMembers : fallbackMembers;

    return (
        <section id="team" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                    <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-2">
                        {t("team.vol", "Vol. IV — People")}
                    </p>
                    <h2 className="font-heading text-4xl text-foreground tracking-tight">
                        {t("team.title", "Team")}
                    </h2>
                </div>

                <Link
                    href="/members"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group cursor-pointer"
                >
                    <span>{locale === "tr" ? "Tüm Laboratuvar Üyelerini Gör" : "View All Laboratory Members"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            {loading ? (
                /* Skeleton Loading Grid */
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-3 animate-pulse">
                            <div className="aspect-[3/4] rounded-2xl bg-muted/60" />
                            <div className="h-4 bg-muted/60 rounded-md w-3/4" />
                            <div className="h-3 bg-muted/40 rounded-md w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {Array.isArray(membersToDisplay) && membersToDisplay.map((member, index) => {
                        const avatarUrl = member.avatar_url || member.avatar;
                        const role = member.role || (locale === "tr" ? member.role_tr : member.role_en);
                        const memberHref = member.slug ? `/members/${member.slug}` : (member.id ? `/members/${member.id}` : "/members");

                        return (
                            <Link
                                key={member.id || index}
                                href={memberHref}
                                className="group text-left transition-all block cursor-pointer"
                            >
                                {/* Profil Resmi Alanı */}
                                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-secondary/15 to-primary/10 overflow-hidden mb-4 relative border border-border/50 group-hover:border-primary/40 group-hover:shadow-lg transition-all duration-300">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary/30 group-hover:scale-105 transition-transform duration-300">
                                            <User className="w-14 h-14" strokeWidth={1} />
                                        </div>
                                    )}

                                    {/* Hover Overlay Profile Link */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                        <span className="text-[11px] text-white font-medium bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
                                            {locale === "tr" ? "Profili Görüntüle →" : "View Profile →"}
                                        </span>
                                    </div>
                                </div>

                                {/* İsim ve Ünvan */}
                                <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                    {member.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    {role}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default Team;