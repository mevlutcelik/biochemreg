"use client";

import React, { useEffect, useState, useMemo } from "react";
import Header from "@/components/biochemreg/Header";
import Footer from "@/components/biochemreg/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { get } from "@/lib/api";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    GraduationCap,
    FileText,
    Download,
    Globe,
    Linkedin,
    Github,
    Share2,
    Search,
    ArrowLeft,
    Sparkles,
    ExternalLink,
    BookOpen,
    Copy,
    CheckCheck,
    X,
    Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SOCIAL_PLATFORMS = [
    { key: "scholar", label: "Google Scholar", icon: GraduationCap, color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200" },
    { key: "orcid", label: "ORCID", icon: Globe, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-sky-600 bg-sky-50 hover:bg-sky-100 border-sky-200" },
    { key: "researchgate", label: "ResearchGate", icon: Share2, color: "text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200" },
    { key: "github", label: "GitHub", icon: Github, color: "text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300" },
    { key: "website", label: "Web", icon: Globe, color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200" },
];

export default function MembersPage() {
    const { t, locale } = useLanguage();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedEmail, setCopiedEmail] = useState("");

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchMembers = async () => {
            try {
                const res = await get({ endpoint: `lab-members?locale=${locale}` });
                if (isMounted && res.status && Array.isArray(res.members)) {
                    setMembers(res.members);
                } else if (isMounted) {
                    setMembers([]);
                }
            } catch {
                if (isMounted) setMembers([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMembers();
        return () => {
            isMounted = false;
        };
    }, [locale]);

    const filteredMembers = useMemo(() => {
        return members.filter((m) => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            const emailsStr = Array.isArray(m.emails) ? m.emails.join(" ").toLowerCase() : "";
            return (
                (m.name && m.name.toLowerCase().includes(q)) ||
                (m.role && m.role.toLowerCase().includes(q)) ||
                (m.bio && m.bio.toLowerCase().includes(q)) ||
                emailsStr.includes(q)
            );
        });
    }, [members, searchQuery]);

    const copyEmail = (email) => {
        navigator.clipboard?.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(""), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1">
                {/* ── HERO BANNER ───────────────────────────── */}
                <section className="relative py-16 md:py-20 bg-muted/20 border-b border-border overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
                        {/* Breadcrumbs & Direktör Hızlı Linki */}
                        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    {locale === "tr" ? "Ana Sayfa" : "Home"}
                                </Link>
                                <span>/</span>
                                <span className="text-foreground font-medium">
                                    {locale === "tr" ? "Laboratuvar Üyeleri" : "Laboratory Members"}
                                </span>
                            </div>

                            <Link
                                href="/director"
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium transition-colors"
                            >
                                <Award className="w-3.5 h-3.5" />
                                <span>{locale === "tr" ? "Laboratuvar Direktörümüzün Sayfası →" : "Our Laboratory Director →"}</span>
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <p className="font-serif italic text-muted-foreground text-sm mb-2">
                                    {locale === "tr" ? "Vol. IV — İnsan Kaynağı & Araştırmacılar" : "Vol. IV — People & Researchers"}
                                </p>
                                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                                    {locale === "tr" ? "Laboratuvar Üyelerimiz" : "Our Laboratory Members"}
                                </h1>
                                <p className="text-sm text-muted-foreground max-w-2xl mt-3 leading-relaxed">
                                    {locale === "tr"
                                        ? "Biyokimya, polimerik biyomalzemeler, hemoaferez ve hedefli ilaç salımı alanlarında yenilikçi araştırmalar yürüten multidisipliner ekibimiz."
                                        : "Our multidisciplinary research team driving innovation in biochemistry, polymeric biomaterials, hemoperfusion, and targeted therapeutics."}
                                </p>
                            </div>

                            {/* Search Box */}
                            <div className="w-full md:w-80 relative">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={locale === "tr" ? "Üye veya uzmanlık ara..." : "Search member or expertise..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 text-xs bg-background rounded-xl border-border/80 shadow-2xs"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── ÜYELER GRID LİSTESİ ───────────────────── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="rounded-3xl border border-border p-6 space-y-4 animate-pulse bg-card">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-muted/60" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-muted/60 rounded w-3/4" />
                                            <div className="h-3 bg-muted/40 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="h-14 bg-muted/30 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-20 space-y-3">
                            <User className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                            <h3 className="text-lg font-heading font-semibold text-foreground">
                                {locale === "tr" ? "Sonuç bulunamadı" : "No members found"}
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                {searchQuery
                                    ? (locale === "tr" ? `"${searchQuery}" ile eşleşen üye bulunamadı.` : `No members match "${searchQuery}".`)
                                    : (locale === "tr" ? "Henüz yayında olan bir üye kaydı bulunmuyor." : "No members currently published.")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMembers.map((member) => {
                                const avatarUrl = member.avatar_url || member.avatar;
                                const emails = Array.isArray(member.emails) ? member.emails : [];
                                const social = member.social_links || {};
                                const memberLink = `/members/${member.slug || member.id}`;

                                return (
                                    <div
                                        key={member.id}
                                        className="group rounded-3xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                    >
                                        <div className="p-6 space-y-4">
                                            {/* Üst Alan: Avatar & İsim */}
                                            <div className="flex items-start gap-4">
                                                <Link
                                                    href={memberLink}
                                                    className="relative w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center group/avatar cursor-pointer"
                                                >
                                                    {avatarUrl ? (
                                                        <img
                                                            src={avatarUrl}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <User className="w-9 h-9 text-primary/40" />
                                                    )}
                                                </Link>

                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={memberLink}
                                                        className="block group/title cursor-pointer"
                                                    >
                                                        <h2 className="font-heading font-semibold text-lg text-foreground group-hover/title:text-primary transition-colors leading-snug">
                                                            {member.name}
                                                        </h2>
                                                    </Link>
                                                    <p className="text-xs font-medium text-primary mt-1 line-clamp-1">
                                                        {member.role || (locale === "tr" ? "Araştırmacı" : "Researcher")}
                                                    </p>
                                                    {member.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                                            <Phone className="w-3 h-3 shrink-0" />
                                                            <span>{member.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Biyografi Özeti */}
                                            {member.bio && (
                                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 bg-muted/20 p-3 rounded-xl border border-border/40">
                                                    {member.bio}
                                                </p>
                                            )}

                                            {/* E-posta Adresleri */}
                                            {emails.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {emails.map((email, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => copyEmail(email)}
                                                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-border/50 transition-colors cursor-pointer"
                                                            title={locale === "tr" ? "Kopyalamak için tıklayın" : "Click to copy"}
                                                        >
                                                            <Mail className="w-3 h-3" />
                                                            <span className="truncate max-w-[170px]">{email}</span>
                                                            {copiedEmail === email ? (
                                                                <CheckCheck className="w-3 h-3 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-2.5 h-2.5 opacity-60" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Alt Bar: Sosyal Linkler, CV ve Detay Butonu */}
                                        <div className="p-4 bg-muted/30 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
                                            {/* Sosyal / Akademik Linkler */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {SOCIAL_PLATFORMS.map((platform) => {
                                                    const link = social[platform.key];
                                                    if (!link) return null;
                                                    const Icon = platform.icon;
                                                    return (
                                                        <a
                                                            key={platform.key}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 shadow-2xs ${platform.color}`}
                                                            title={platform.label}
                                                        >
                                                            <Icon className="w-3.5 h-3.5" />
                                                        </a>
                                                    );
                                                })}
                                            </div>

                                            {/* Aksiyonlar: CV & Detay */}
                                            <div className="flex items-center gap-1.5 ml-auto">
                                                {member.cv_url && (
                                                    <a
                                                        href={member.cv_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-foreground shadow-2xs"
                                                        title={locale === "tr" ? "Özgeçmiş Belgesi" : "Curriculum Vitae"}
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-primary" />
                                                        <span>CV</span>
                                                        <Download className="w-3 h-3" />
                                                    </a>
                                                )}

                                                <Link
                                                    href={memberLink}
                                                    className="inline-flex items-center gap-1.5 h-8 text-xs px-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs font-medium cursor-pointer"
                                                >
                                                    <span>{locale === "tr" ? "Profili Görüntüle" : "View Profile"}</span>
                                                    <ExternalLink className="w-3 h-3 ml-0.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
