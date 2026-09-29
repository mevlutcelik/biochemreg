"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function MemberDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const { t, locale } = useLanguage();

    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState("");

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        setLoading(true);
        setError(false);

        const fetchMember = async () => {
            try {
                const res = await get({ endpoint: `lab-members/${id}?locale=${locale}` });
                if (isMounted && res.status && res.member) {
                    setMember(res.member);
                } else if (isMounted) {
                    setError(true);
                }
            } catch {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMember();

        return () => {
            isMounted = false;
        };
    }, [id, locale]);

    const copyEmail = (email) => {
        navigator.clipboard?.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(""), 2000);
    };

    const avatarUrl = member?.avatar_url || member?.avatar;
    const emails = Array.isArray(member?.emails) ? member.emails : [];
    const social = member?.social_links || {};

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1">
                {/* ── BREADCRUMBS & ÜST BAR ────────────────────── */}
                <section className="bg-muted/20 border-b border-border py-6">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <Link href="/" className="hover:text-primary transition-colors">
                                {locale === "tr" ? "Ana Sayfa" : "Home"}
                            </Link>
                            <span>/</span>
                            <Link href="/members" className="hover:text-primary transition-colors">
                                {locale === "tr" ? "Laboratuvar Üyeleri" : "Laboratory Members"}
                            </Link>
                            <span>/</span>
                            <span className="text-foreground font-semibold truncate max-w-[200px]">
                                {member?.name || (locale === "tr" ? "Üye Detayı" : "Member Detail")}
                            </span>
                        </div>

                        <Link
                            href="/members"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>{locale === "tr" ? "Tüm Üyelere Dön" : "Back to Members"}</span>
                        </Link>
                    </div>
                </section>

                {/* ── İÇERİK ALANI ────────────────────────────── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">
                                {locale === "tr" ? "Üye bilgileri yükleniyor..." : "Loading member profile..."}
                            </p>
                        </div>
                    ) : error || !member ? (
                        <div className="text-center py-20 space-y-4">
                            <User className="w-14 h-14 text-muted-foreground/30 mx-auto" />
                            <h2 className="text-xl font-heading font-semibold text-foreground">
                                {locale === "tr" ? "Üye Bulunamadı" : "Member Not Found"}
                            </h2>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                {locale === "tr"
                                    ? "Aradığınız araştırmacı veya laboratuvar üyesi kaydı mevcut değil ya da yayından kaldırılmış olabilir."
                                    : "The researcher profile you are looking for does not exist or has been unpublished."}
                            </p>
                            <Button
                                onClick={() => router.push("/members")}
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                                {locale === "tr" ? "Laboratuvar Üyelerine Dön" : "Back to Laboratory Members"}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* ── SOL SÜTUN: PROFİL KARTI (4/12) ────────── */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
                                    {/* Büyük Profil Fotoğrafı */}
                                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shadow-md flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-20 h-20 text-primary/30" />
                                        )}
                                        {member.is_director ? (
                                            <Badge className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] gap-1 shadow-sm">
                                                <Award className="w-3 h-3" />
                                                {locale === "tr" ? "Direktör" : "Director"}
                                            </Badge>
                                        ) : member.is_active ? (
                                            <Badge className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px]">
                                                {locale === "tr" ? "Aktif Üye" : "Active Member"}
                                            </Badge>
                                        ) : null}
                                    </div>

                                    {/* İsim & Pozisyon */}
                                    <div>
                                        <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">
                                            {member.name}
                                        </h1>
                                        <p className="text-sm font-semibold text-primary mt-1">
                                            {member.role || (locale === "tr" ? "Araştırmacı" : "Researcher")}
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

                                        {member.phone && (
                                            <a
                                                href={`tel:${member.phone.replace(/[^0-9+]/g, "")}`}
                                                className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50 text-xs text-foreground hover:text-primary transition-colors"
                                            >
                                                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                                                <span>{member.phone}</span>
                                            </a>
                                        )}
                                    </div>

                                    {/* Özgeçmiş (CV) İndirme */}
                                    {member.cv_url && (
                                        <div className="pt-2">
                                            <a
                                                href={member.cv_url}
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

                            {/* ── SAĞ SÜTUN: BİYOGRAFİ & DETAYLI BODY İÇERİĞİ (8/12) ── */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Kısa Biyografi */}
                                {member.bio && (
                                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                            <span>{locale === "tr" ? "Araştırma Özeti & Biyografi" : "Research Summary & Biography"}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Zengin Metin Editörü ile Yazılan Body İçeriği */}
                                {member.body ? (
                                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider pb-3 border-b border-border">
                                            <Sparkles className="w-4 h-4" />
                                            <span>
                                                {locale === "tr"
                                                    ? "Ayrıntılı Akademik Bilgiler & Çalışmalar"
                                                    : "Detailed Academic Information & Projects"}
                                            </span>
                                        </div>

                                        <div
                                            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: member.body }}
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-border/80 bg-muted/10 p-8 text-center space-y-2">
                                        <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                        <p className="text-xs text-muted-foreground">
                                            {locale === "tr"
                                                ? "Bu üye için henüz ek zengin metin içeriği eklenmemiştir."
                                                : "No additional detailed rich text background has been added for this member yet."}
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
