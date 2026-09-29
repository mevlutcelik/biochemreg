"use client";

import React, { useEffect, useState } from "react";
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
    ArrowLeft,
    Sparkles,
    Copy,
    CheckCheck,
    ExternalLink,
    Loader2,
    BookOpen,
    Award,
    Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SOCIAL_PLATFORMS = [
    { key: "scholar", label: "Google Scholar", icon: GraduationCap, color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200" },
    { key: "orcid", label: "ORCID", icon: Globe, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-sky-600 bg-sky-50 hover:bg-sky-100 border-sky-200" },
    { key: "researchgate", label: "ResearchGate", icon: Share2, color: "text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200" },
    { key: "github", label: "GitHub", icon: Github, color: "text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300" },
    { key: "website", label: "Web Sitesi", icon: Globe, color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200" },
];

export default function DirectorPage() {
    const { t, locale } = useLanguage();
    const [director, setDirector] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState("");

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(false);

        const fetchDirector = async () => {
            try {
                const res = await get({ endpoint: `lab-members/director?locale=${locale}` });
                if (isMounted && res.status && res.director) {
                    setDirector(res.director);
                } else if (isMounted) {
                    setError(true);
                }
            } catch {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDirector();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    const copyEmail = (email) => {
        navigator.clipboard?.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(""), 2000);
    };

    const avatarUrl = director?.avatar_url || director?.avatar;
    const emails = Array.isArray(director?.emails) ? director.emails : [];
    const social = director?.social_links || {};

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1">
                {/* ── HERO BANNER ───────────────────────────── */}
                <section className="relative py-16 md:py-20 bg-muted/20 border-b border-border overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
                        {/* Breadcrumbs & Üyeler Sayfasına Geçiş */}
                        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    {locale === "tr" ? "Ana Sayfa" : "Home"}
                                </Link>
                                <span>/</span>
                                <span className="text-foreground font-semibold">
                                    {locale === "tr" ? "Laboratuvar Direktörü" : "Laboratory Director"}
                                </span>
                            </div>

                            <Link
                                href="/members"
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors"
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span>{locale === "tr" ? "Tüm Laboratuvar Üyelerini Gör →" : "View All Members →"}</span>
                            </Link>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-3">
                                    <Award className="w-3.5 h-3.5" />
                                    <span>{locale === "tr" ? "Laboratuvar Direktörlüğü" : "Laboratory Directorship"}</span>
                                </div>
                                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                                    {director ? director.name : (locale === "tr" ? "Laboratuvar Direktörü" : "Laboratory Director")}
                                </h1>
                                <p className="text-sm text-muted-foreground max-w-2xl mt-3 leading-relaxed">
                                    {director?.role || (locale === "tr" ? "Laboratuvar Kurucusu & Araştırma Grubu Direktörü" : "Founder & Laboratory Research Director")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── İÇERİK ALANI ────────────────────────────── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">
                                {locale === "tr" ? "Direktör profili yükleniyor..." : "Loading director profile..."}
                            </p>
                        </div>
                    ) : error || !director ? (
                        <div className="text-center py-20 space-y-4">
                            <Award className="w-14 h-14 text-muted-foreground/30 mx-auto" />
                            <h2 className="text-xl font-heading font-semibold text-foreground">
                                {locale === "tr" ? "Direktör Belirlenmedi" : "No Director Designated"}
                            </h2>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                {locale === "tr"
                                    ? "Sistemde henüz aktif bir laboratuvar direktörü atanmamış. Yönetim panelinden bir üyeyi direktör olarak seçebilirsiniz."
                                    : "No laboratory director has been designated yet. You can assign a director from the dashboard."}
                            </p>
                            <Link href="/members">
                                <Button variant="outline" size="sm" className="cursor-pointer mt-2">
                                    <Users className="w-3.5 h-3.5 mr-1.5" />
                                    {locale === "tr" ? "Laboratuvar Üyelerini Görüntüle" : "View Laboratory Members"}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* ── SOL SÜTUN: PROFİL KARTI (4/12) ────────── */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                                <div className="rounded-3xl border border-amber-500/20 bg-card p-6 shadow-sm space-y-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                                    {/* Büyük Profil Fotoğrafı */}
                                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shadow-md flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={director.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-20 h-20 text-primary/30" />
                                        )}
                                        <Badge className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] gap-1 shadow-sm">
                                            <Award className="w-3 h-3" />
                                            {locale === "tr" ? "Direktör" : "Director"}
                                        </Badge>
                                    </div>

                                    {/* İsim & Pozisyon */}
                                    <div>
                                        <h2 className="text-2xl font-heading font-bold text-foreground leading-tight">
                                            {director.name}
                                        </h2>
                                        <p className="text-sm font-semibold text-primary mt-1">
                                            {director.role || (locale === "tr" ? "Laboratuvar Direktörü" : "Laboratory Director")}
                                        </p>
                                    </div>

                                    {/* İletişim Bilgileri */}
                                    <div className="space-y-2.5 pt-3 border-t border-border">
                                        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                            {locale === "tr" ? "İletişim Bilgileri" : "Contact Information"}
                                        </h3>

                                        {emails.length > 0 && (
                                            <div className="space-y-1.5">
                                                {emails.map((email, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-muted/30 border border-border/50 text-xs"
                                                    >
                                                        <a
                                                            href={`mailto:${email}`}
                                                            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors truncate"
                                                        >
                                                            <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                                                            <span className="truncate">{email}</span>
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyEmail(email)}
                                                            className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 p-1"
                                                            title={locale === "tr" ? "Kopyala" : "Copy"}
                                                        >
                                                            {copiedEmail === email ? (
                                                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {director.phone && (
                                            <a
                                                href={`tel:${director.phone.replace(/[^0-9+]/g, "")}`}
                                                className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50 text-xs text-foreground hover:text-primary transition-colors"
                                            >
                                                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                                                <span>{director.phone}</span>
                                            </a>
                                        )}
                                    </div>

                                    {/* Özgeçmiş (CV) İndirme */}
                                    {director.cv_url && (
                                        <div className="pt-2">
                                            <a
                                                href={director.cv_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>{locale === "tr" ? "Özgeçmiş Belgesi (CV İndir)" : "Curriculum Vitae (Download CV)"}</span>
                                                <Download className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    )}

                                    {/* Sosyal & Akademik Profiller */}
                                    {Object.values(social).filter(Boolean).length > 0 && (
                                        <div className="space-y-2 pt-3 border-t border-border">
                                            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                {locale === "tr" ? "Akademik Profiller & Bağlantılar" : "Academic Profiles & Links"}
                                            </h3>
                                            <div className="flex flex-col gap-1.5">
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
                                                            className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-all hover:scale-[1.01] shadow-2xs ${platform.color}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4" />
                                                                <span>{platform.label}</span>
                                                            </div>
                                                            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── SAĞ SÜTUN: VİZYON, BİYOGRAFİ & DETAYLI BODY (8/12) ── */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Araştırma Vizyonu & Biyografi */}
                                {director.bio && (
                                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                            <span>{locale === "tr" ? "Direktörün Mesajı & Biyografi" : "Director's Vision & Biography"}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                                            {director.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Zengin Metin Editörü ile Yazılan Body İçeriği */}
                                {director.body ? (
                                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider pb-3 border-b border-border">
                                            <Sparkles className="w-4 h-4" />
                                            <span>
                                                {locale === "tr"
                                                    ? "Ayrıntılı Akademik Bilgiler, Yayınlar & Projeler"
                                                    : "Detailed Academic Works, Publications & Grants"}
                                            </span>
                                        </div>

                                        <div
                                            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: director.body }}
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-border/80 bg-muted/10 p-8 text-center space-y-2">
                                        <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                        <p className="text-xs text-muted-foreground">
                                            {locale === "tr"
                                                ? "Direktör için henüz ek detaylı akademik metin eklenmemiştir."
                                                : "No additional detailed rich text background has been added for the director yet."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
