"use client";

import { useEffect, useState, useMemo } from "react";
import { Topbar } from "@/components/meha-ui/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    ContactRound,
    Plus,
    Pencil,
    Trash2,
    Eye,
    RefreshCw,
    Search,
    ImagePlus,
    Check,
    X,
    Loader2,
    Mail,
    Phone,
    GraduationCap,
    FileText,
    ExternalLink,
    Globe,
    Linkedin,
    Github,
    Upload,
    Download,
    Copy,
    CheckCheck,
    User,
    PlusCircle,
    Share2,
    Sparkles,
    Award,
} from "lucide-react";
import { get, post, patch, del } from "@/lib/api";
import useToken from "@/hooks/useToken";
import { toast } from "sonner";
import { LanguageFlag } from "@/components/LanguageFlag";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// ─────────────────────────────────────────────────────────────
// SABİT: Sosyal Medya & Akademik Platform Tanımları
// ─────────────────────────────────────────────────────────────
const SOCIAL_PLATFORMS = [
    { key: "scholar", label: "Google Scholar", icon: GraduationCap, placeholder: "https://scholar.google.com/citations?user=...", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { key: "orcid", label: "ORCID", icon: Globe, placeholder: "https://orcid.org/0000-0000-0000-0000", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/...", color: "text-sky-600 bg-sky-50 border-sky-200" },
    { key: "researchgate", label: "ResearchGate", icon: Share2, placeholder: "https://researchgate.net/profile/...", color: "text-teal-600 bg-teal-50 border-teal-200" },
    { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/...", color: "text-slate-800 bg-slate-100 border-slate-300" },
    { key: "website", label: "Web Sitesi", icon: Globe, placeholder: "https://...", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
];

// ─────────────────────────────────────────────────────────────
// BİLEŞEN: Üye Önizleme Kartı (Live Academic Card)
// ─────────────────────────────────────────────────────────────
function MemberPreviewCard({ member, lang = "en" }) {
    const role = lang === "tr"
        ? (member.role_tr || member.role_en || "Ünvan belirtilmedi")
        : (member.role_en || member.role_tr || "No role specified");

    const bio = lang === "tr"
        ? (member.bio_tr || member.bio_en || "Biyografi henüz eklenmedi.")
        : (member.bio_en || member.bio_tr || "No biography provided yet.");

    const cvUrl = lang === "tr"
        ? (member.cv_tr_url || member.cv_tr)
        : (member.cv_en_url || member.cv_en);

    const emails = Array.isArray(member.emails) ? member.emails : [];
    const social = member.social_links || {};

    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-border p-5 shadow-xs transition-all space-y-4">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center">
                    {member.avatar_preview || member.avatar_url || member.avatar ? (
                        <img
                            src={member.avatar_preview || member.avatar_url || member.avatar}
                            alt={member.name || "Member"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-8 h-8 text-primary/40" />
                    )}
                    {member.is_active && (
                        <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-semibold text-base text-foreground leading-tight">
                            {member.name || "İsim Soyisim"}
                        </h3>
                        {member.order !== undefined && (
                            <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 h-4">
                                #{member.order}
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs font-medium text-primary mt-1">
                        {role}
                    </p>
                    {member.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{member.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Biyografi */}
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 bg-muted/30 p-2.5 rounded-xl border border-border/50">
                {bio}
            </p>

            {/* Zengin Metin Body Önizleme (varsa) */}
            {(lang === "tr" ? (member.body_tr || member.body_en) : (member.body_en || member.body_tr)) && (
                <div className="bg-muted/15 p-3 rounded-xl border border-border/50 space-y-1">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                        {lang === "tr" ? "Detaylı Profil İçeriği (Body)" : "Detailed Profile Content (Body)"}
                    </span>
                    <div
                        className="prose prose-xs dark:prose-invert max-w-none text-[11px] line-clamp-4 leading-relaxed text-muted-foreground"
                        dangerouslySetInnerHTML={{
                            __html: lang === "tr"
                                ? (member.body_tr || member.body_en || "")
                                : (member.body_en || member.body_tr || ""),
                        }}
                    />
                </div>
            )}

            {/* E-postalar */}
            {emails.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {emails.map((email, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[11px] font-normal gap-1 py-0.5 px-2 bg-muted/60">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{email}</span>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Sosyal & Akademik Linkler + CV */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 flex-wrap">
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
                                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 ${platform.color}`}
                                title={`${platform.label}: ${link}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </a>
                        );
                    })}
                </div>

                {cvUrl ? (
                    <a
                        href={cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>CV ({lang.toUpperCase()})</span>
                        <Download className="w-3 h-3" />
                    </a>
                ) : (
                    <span className="text-[11px] text-muted-foreground italic">CV ({lang.toUpperCase()}) yok</span>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// ANA SAYFA BİLEŞENİ: Laboratuvar Üyeleri Yönetimi
// ─────────────────────────────────────────────────────────────
export default function LabMembersManagementPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Sheet (Ekle / Düzenle Yan Panel)
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [sheetTab, setSheetTab] = useState("general"); // "general" | "lang"
    const [activeLangTab, setActiveLangTab] = useState("en"); // "en" | "tr"
    const [sheetPreviewLang, setSheetPreviewLang] = useState("en");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        role_en: "",
        role_tr: "",
        bio_en: "",
        bio_tr: "",
        body_en: "",
        body_tr: "",
        phone: "",
        order: 0,
        is_active: true,
        avatar_url_custom: "",
        cv_en_custom: "",
        cv_tr_custom: "",
    });

    // Multiple emails state
    const [emailsList, setEmailsList] = useState([""]);

    // Social links state
    const [socialLinks, setSocialLinks] = useState({
        scholar: "",
        orcid: "",
        linkedin: "",
        researchgate: "",
        github: "",
        website: "",
    });

    // File uploads
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [cvEnFile, setCvEnFile] = useState(null);
    const [cvTrFile, setCvTrFile] = useState(null);

    // Preview modal
    const [previewMember, setPreviewMember] = useState(null);
    const [modalPreviewLang, setModalPreviewLang] = useState("en");

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Copied feedback
    const [copiedEmail, setCopiedEmail] = useState("");

    // ─── Veri Yükleme ──────────────────────────────────────
    const fetchMembers = async () => {
        setLoading(true);
        try {
            const token = await useToken();
            const res = await get({ endpoint: "admin/lab-members", bearerToken: token });
            if (res.status && Array.isArray(res.members)) {
                setMembers(res.members);
            } else {
                toast.error("Üye listesi alınamadı.");
            }
        } catch (error) {
            toast.error(error.message || "Üye verileri yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // ─── Filtreleme & Metrikler ────────────────────────────
    const filteredMembers = useMemo(() => {
        return members.filter((item) => {
            const q = searchQuery.toLowerCase().trim();
            const emailsStr = Array.isArray(item.emails) ? item.emails.join(" ").toLowerCase() : "";
            const matchesSearch = !q ||
                (item.name && item.name.toLowerCase().includes(q)) ||
                (item.role_en && item.role_en.toLowerCase().includes(q)) ||
                (item.role_tr && item.role_tr.toLowerCase().includes(q)) ||
                (item.phone && item.phone.toLowerCase().includes(q)) ||
                emailsStr.includes(q) ||
                (item.bio_en && item.bio_en.toLowerCase().includes(q)) ||
                (item.bio_tr && item.bio_tr.toLowerCase().includes(q));

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && item.is_active) ||
                (statusFilter === "passive" && !item.is_active);

            return matchesSearch && matchesStatus;
        });
    }, [members, searchQuery, statusFilter]);

    const activeCount = useMemo(() => members.filter((m) => m.is_active).length, [members]);
    const passiveCount = useMemo(() => members.filter((m) => !m.is_active).length, [members]);

    // ─── Form Sıfırlama / Açma ─────────────────────────────
    const openAddSheet = () => {
        setEditingMember(null);
        setFormData({
            name: "",
            slug: "",
            role_en: "",
            role_tr: "",
            bio_en: "",
            bio_tr: "",
            body_en: "",
            body_tr: "",
            phone: "",
            order: (members.length > 0 ? Math.max(...members.map((m) => m.order || 0)) + 1 : 1),
            is_active: true,
            is_director: false,
            avatar_url_custom: "",
            cv_en_custom: "",
            cv_tr_custom: "",
        });
        setEmailsList([""]);
        setSocialLinks({
            scholar: "",
            orcid: "",
            linkedin: "",
            researchgate: "",
            github: "",
            website: "",
        });
        setAvatarFile(null);
        setAvatarPreview("");
        setCvEnFile(null);
        setCvTrFile(null);
        setSheetTab("general");
        setActiveLangTab("en");
        setIsSheetOpen(true);
    };

    const openEditSheet = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name || "",
            slug: member.slug || "",
            role_en: member.role_en || "",
            role_tr: member.role_tr || "",
            bio_en: member.bio_en || "",
            bio_tr: member.bio_tr || "",
            body_en: member.body_en || "",
            body_tr: member.body_tr || "",
            phone: member.phone || "",
            order: member.order ?? 0,
            is_active: Boolean(member.is_active),
            is_director: Boolean(member.is_director),
            avatar_url_custom: member.avatar && (member.avatar.startsWith("http") || member.avatar.startsWith("/")) ? member.avatar : "",
            cv_en_custom: member.cv_en && (member.cv_en.startsWith("http") || member.cv_en.startsWith("/")) ? member.cv_en : "",
            cv_tr_custom: member.cv_tr && (member.cv_tr.startsWith("http") || member.cv_tr.startsWith("/")) ? member.cv_tr : "",
        });
        setEmailsList(Array.isArray(member.emails) && member.emails.length > 0 ? member.emails : [""]);
        setSocialLinks({
            scholar: member.social_links?.scholar || "",
            orcid: member.social_links?.orcid || "",
            linkedin: member.social_links?.linkedin || "",
            researchgate: member.social_links?.researchgate || "",
            github: member.social_links?.github || "",
            website: member.social_links?.website || "",
        });
        setAvatarFile(null);
        setAvatarPreview(member.avatar_url || member.avatar || "");
        setCvEnFile(null);
        setCvTrFile(null);
        setSheetTab("general");
        setActiveLangTab("en");
        setIsSheetOpen(true);
    };

    // ─── E-posta Yönetimi ──────────────────────────────────
    const handleEmailChange = (index, value) => {
        const next = [...emailsList];
        next[index] = value;
        setEmailsList(next);
    };

    const addEmailField = () => {
        setEmailsList([...emailsList, ""]);
    };

    const removeEmailField = (index) => {
        if (emailsList.length === 1) {
            setEmailsList([""]);
            return;
        }
        setEmailsList(emailsList.filter((_, idx) => idx !== index));
    };

    // ─── Sosyal Link Değişimi ──────────────────────────────
    const handleSocialChange = (key, value) => {
        setSocialLinks((prev) => ({ ...prev, [key]: value }));
    };

    // ─── Dosya Seçimleri ───────────────────────────────────
    const handleAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Profil fotoğrafı en fazla 10MB olabilir.");
                return;
            }
            setAvatarFile(file);
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
        }
    };

    const handleCvEnSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                toast.error("CV dosyası en fazla 20MB olabilir.");
                return;
            }
            setCvEnFile(file);
        }
    };

    const handleCvTrSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                toast.error("CV dosyası en fazla 20MB olabilir.");
                return;
            }
            setCvTrFile(file);
        }
    };

    // ─── Form Gönderme (Ekle / Güncelle) ────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Lütfen üye Ad ve Soyadını girin.");
            return;
        }

        setSubmitting(true);
        try {
            const token = await useToken();
            const data = new FormData();

            data.append("name", formData.name.trim());
            if (formData.slug && formData.slug.trim()) {
                data.append("slug", formData.slug.trim());
            }
            data.append("role_en", formData.role_en || "");
            data.append("role_tr", formData.role_tr || "");
            data.append("bio_en", formData.bio_en || "");
            data.append("bio_tr", formData.bio_tr || "");
            data.append("body_en", formData.body_en || "");
            data.append("body_tr", formData.body_tr || "");
            data.append("phone", formData.phone || "");
            data.append("order", String(formData.order));
            data.append("is_active", formData.is_active ? "1" : "0");
            data.append("is_director", formData.is_director ? "1" : "0");

            // Temiz e-postalar
            const cleanEmails = emailsList.map((em) => em.trim()).filter(Boolean);
            data.append("emails", JSON.stringify(cleanEmails));

            // Sosyal bağlantılar
            const cleanSocial = {};
            Object.entries(socialLinks).forEach(([k, v]) => {
                if (v && v.trim()) cleanSocial[k] = v.trim();
            });
            data.append("social_links", JSON.stringify(cleanSocial));

            // Avatar
            if (avatarFile) {
                data.append("avatar", avatarFile);
            } else if (formData.avatar_url_custom) {
                data.append("avatar_url_custom", formData.avatar_url_custom);
            }

            // CV EN
            if (cvEnFile) {
                data.append("cv_en", cvEnFile);
            } else if (formData.cv_en_custom) {
                data.append("cv_en_custom", formData.cv_en_custom);
            }

            // CV TR
            if (cvTrFile) {
                data.append("cv_tr", cvTrFile);
            } else if (formData.cv_tr_custom) {
                data.append("cv_tr_custom", formData.cv_tr_custom);
            }

            const isEdit = Boolean(editingMember);
            const endpoint = isEdit ? `admin/lab-members/${editingMember.id}` : "admin/lab-members";

            const res = await post({
                endpoint,
                data,
                bearerToken: token,
            });

            if (res.status) {
                toast.success(isEdit ? "Üye başarıyla güncellendi." : "Yeni üye eklendi.");
                setIsSheetOpen(false);
                fetchMembers();
            } else {
                toast.error(res.message || "İşlem başarısız.");
            }
        } catch (error) {
            toast.error(error.message || "Kaydedilirken bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Durum Değiştirme (Aktif / Pasif) ────────────────────
    const handleToggleStatus = async (member) => {
        const prev = member.is_active;
        setMembers((m) => m.map((x) => x.id === member.id ? { ...x, is_active: !prev } : x));
        try {
            const token = await useToken();
            const res = await patch({ endpoint: `admin/lab-members/${member.id}/toggle-status`, bearerToken: token });
            if (res.status) {
                toast.success(!prev ? "Üye yayına alındı." : "Üye pasife alındı.");
            } else {
                setMembers((m) => m.map((x) => x.id === member.id ? { ...x, is_active: prev } : x));
                toast.error("Durum güncellenemedi.");
            }
        } catch {
            setMembers((m) => m.map((x) => x.id === member.id ? { ...x, is_active: prev } : x));
            toast.error("Hata oluştu.");
        }
    };

    // ─── Direktörlük Değiştirme ─────────────────────────────
    const handleToggleDirector = async (member) => {
        const prev = member.is_director;
        try {
            const token = await useToken();
            const res = await patch({ endpoint: `admin/lab-members/${member.id}/toggle-director`, bearerToken: token });
            if (res && res.status) {
                toast.success(res.message);
                fetchMembers();
            } else {
                toast.error(res?.message || "İşlem gerçekleştirilemedi.");
            }
        } catch (err) {
            toast.error(err.message || "Hata oluştu.");
        }
    };

    // ─── Silme İşlemi ──────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const token = await useToken();
            const res = await del({ endpoint: `admin/lab-members/${deleteTarget.id}`, bearerToken: token });
            if (res.status) {
                toast.success("Üye silindi.");
                setMembers((m) => m.filter((x) => x.id !== deleteTarget.id));
                setDeleteTarget(null);
            } else {
                toast.error(res.message || "Silme başarısız.");
            }
        } catch (error) {
            toast.error(error.message || "Silinirken hata oluştu.");
        } finally {
            setDeleting(false);
        }
    };

    // Kopyalama bildirim aracı
    const copyToClipboard = (text) => {
        navigator.clipboard?.writeText(text);
        setCopiedEmail(text);
        toast.success("E-posta kopyalandı!");
        setTimeout(() => setCopiedEmail(""), 2000);
    };

    return (
        <>
            <Topbar title="Laboratuvar Üyeleri" />

            <div className="p-4 md:p-6 space-y-4">
                {/* ── BAŞLIK & METRİKLER ────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                            <ContactRound className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-heading font-semibold text-foreground leading-tight">
                                Laboratuvar Üyeleri
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Araştırmacıları, iletişim bilgilerini, çoklu CV ve akademik bağlantıları yönetin
                            </p>
                        </div>
                        <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />
                        <div className="hidden sm:flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs tabular-nums">
                                {members.length} üye
                            </Badge>
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono text-xs tabular-nums">
                                {activeCount} aktif
                            </Badge>
                            {passiveCount > 0 && (
                                <Badge variant="outline" className="text-muted-foreground font-mono text-xs tabular-nums">
                                    {passiveCount} pasif
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchMembers}
                            disabled={loading}
                            className="cursor-pointer h-8"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                            Yenile
                        </Button>
                        <Button
                            size="sm"
                            onClick={openAddSheet}
                            className="cursor-pointer h-8 shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Yeni Üye Ekle
                        </Button>
                    </div>
                </div>

                {/* ── ARAMA & FİLTRE ARAÇ ÇUBUĞU ────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-2 rounded-xl border border-border">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="İsim, ünvan, e-posta veya biyografide ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 h-8 text-xs bg-muted/30 rounded-lg"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Durum:</span>
                        {[
                            { key: "all", label: "Tümü" },
                            { key: "active", label: "Aktif" },
                            { key: "passive", label: "Pasif" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                                    statusFilter === tab.key
                                        ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── KOMPAKT TABLO ─────────────────────────── */}
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
                    <Table>
                        <TableHeader className="bg-muted/40 text-xs">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead className="min-w-[200px]">Üye & Pozisyon</TableHead>
                                <TableHead className="min-w-[190px]">İletişim Bilgileri</TableHead>
                                <TableHead className="min-w-[140px]">Akademik / Sosyal</TableHead>
                                <TableHead className="min-w-[130px]">Özgeçmiş (CV)</TableHead>
                                <TableHead className="w-24 text-center">Diller</TableHead>
                                <TableHead className="w-20 text-center">Durum</TableHead>
                                <TableHead className="w-24 text-right pr-4">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-44 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            <span className="text-xs">Üyeler yükleniyor...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-44 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <ContactRound className="w-8 h-8 text-muted-foreground/40" />
                                            <p className="text-sm font-medium text-foreground">Kayıtlı üye bulunamadı</p>
                                            <p className="text-xs text-muted-foreground max-w-sm">
                                                {searchQuery
                                                    ? `"${searchQuery}" aramasına uygun sonuç bulunamadı.`
                                                    : "Henüz laboratuvar üyesi eklenmemiş. 'Yeni Üye Ekle' butonu ile ilk üyeyi ekleyin."}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMembers.map((member) => {
                                    const emails = Array.isArray(member.emails) ? member.emails : [];
                                    const social = member.social_links || {};
                                    const hasEnBio = Boolean(member.bio_en || member.role_en);
                                    const hasTrBio = Boolean(member.bio_tr || member.role_tr);
                                    const hasCvEn = Boolean(member.cv_en_url || member.cv_en);
                                    const hasCvTr = Boolean(member.cv_tr_url || member.cv_tr);

                                    return (
                                        <TableRow key={member.id} className="hover:bg-muted/20 transition-colors text-xs">
                                            {/* Sıra */}
                                            <TableCell className="text-center font-mono text-muted-foreground text-xs">
                                                #{member.order ?? 0}
                                            </TableCell>

                                            {/* Üye ve Ünvan */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center">
                                                        {member.avatar_url || member.avatar ? (
                                                            <img
                                                                src={member.avatar_url || member.avatar}
                                                                alt={member.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-4.5 h-4.5 text-primary/60" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <p className="font-semibold text-foreground truncate max-w-[200px]">
                                                                {member.name}
                                                            </p>
                                                            {member.is_director && (
                                                                <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] gap-1 shadow-2xs font-medium">
                                                                    <Award className="w-2.5 h-2.5" /> Direktör
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                                                            {member.role_en || member.role_tr || "Ünvan yok"}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {member.slug && (
                                                                <a
                                                                    href={`/members/${member.slug}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 font-mono text-[10px] text-primary/80 hover:text-primary hover:underline"
                                                                    title="Sitedeki sayfasını yeni sekmede aç"
                                                                >
                                                                    <span>/members/{member.slug}</span>
                                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                                </a>
                                                            )}
                                                            {member.is_director && (
                                                                <a
                                                                    href="/director"
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-600 hover:underline"
                                                                    title="Direktör sayfasını yeni sekmede aç"
                                                                >
                                                                    <span>/director</span>
                                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* İletişim */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {emails.length > 0 ? (
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(emails[0])}
                                                                className="inline-flex items-center gap-1 text-[11px] text-foreground hover:text-primary transition-colors cursor-pointer group"
                                                                title="Kopyalamak için tıklayın"
                                                            >
                                                                <Mail className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                                                                <span className="truncate max-w-[140px]">{emails[0]}</span>
                                                                {copiedEmail === emails[0] ? (
                                                                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                                                                ) : (
                                                                    <Copy className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                                                )}
                                                            </button>
                                                            {emails.length > 1 && (
                                                                <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 font-mono">
                                                                    +{emails.length - 1}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-[11px]">E-posta yok</span>
                                                    )}

                                                    {member.phone ? (
                                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <Phone className="w-3 h-3 shrink-0" />
                                                            <span>{member.phone}</span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </TableCell>

                                            {/* Sosyal / Akademik Linkler */}
                                            <TableCell>
                                                <div className="flex items-center gap-1 flex-wrap">
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
                                                                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all hover:scale-110 shadow-2xs ${platform.color}`}
                                                                title={`${platform.label}`}
                                                            >
                                                                <Icon className="w-3 h-3" />
                                                            </a>
                                                        );
                                                    })}
                                                    {Object.values(social).filter(Boolean).length === 0 && (
                                                        <span className="text-muted-foreground italic text-[11px]">-</span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* CV Durumu */}
                                            <TableCell>
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {hasCvEn ? (
                                                        <a
                                                            href={member.cv_en_url || member.cv_en}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                                            title="İngilizce CV İndir / İncele"
                                                        >
                                                            <FileText className="w-2.5 h-2.5" />
                                                            <span>EN</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground/60 border border-transparent">
                                                            EN yok
                                                        </span>
                                                    )}

                                                    {hasCvTr ? (
                                                        <a
                                                            href={member.cv_tr_url || member.cv_tr}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                                            title="Türkçe CV İndir / İncele"
                                                        >
                                                            <FileText className="w-2.5 h-2.5" />
                                                            <span>TR</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground/60 border border-transparent">
                                                            TR yok
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Dil Rozetleri */}
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center gap-1">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                                            hasEnBio
                                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                : "bg-muted text-muted-foreground opacity-50 border-transparent"
                                                        }`}
                                                        title={hasEnBio ? "İngilizce içerik mevcut" : "İngilizce içerik eksik"}
                                                    >
                                                        <LanguageFlag code="en" className="w-3 h-3" />
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                                            hasTrBio
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                        }`}
                                                        title={hasTrBio ? "Türkçe içerik mevcut" : "Türkçe içerik eksik"}
                                                    >
                                                        <LanguageFlag code="tr" className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Durum Toggle */}
                                            <TableCell className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(member)}
                                                    className="cursor-pointer inline-block"
                                                    title={member.is_active ? "Pasife al" : "Aktife al"}
                                                >
                                                    {member.is_active ? (
                                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-[10px] gap-1 cursor-pointer">
                                                            <Check className="w-2.5 h-2.5" />Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground text-[10px] gap-1 cursor-pointer">
                                                            <X className="w-2.5 h-2.5" />Pasif
                                                        </Badge>
                                                    )}
                                                </button>
                                            </TableCell>

                                            {/* İşlemler */}
                                            <TableCell className="text-right pr-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-7 w-7 p-0 cursor-pointer ${
                                                            member.is_director
                                                                ? "text-amber-600 hover:text-amber-700 bg-amber-500/10"
                                                                : "text-muted-foreground hover:text-amber-600"
                                                        }`}
                                                        onClick={() => handleToggleDirector(member)}
                                                        title={member.is_director ? "Direktörlük görevini kaldır" : "Laboratuvar Direktörü yap"}
                                                    >
                                                        <Award className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <a
                                                        href={member.is_director ? "/director" : `/members/${member.slug || member.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                                        title="Sitedeki profil sayfasını yeni sekmede aç"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-primary"
                                                        onClick={() => {
                                                            setPreviewMember(member);
                                                            setModalPreviewLang("en");
                                                        }}
                                                        title="Hızlı Önizle"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-primary"
                                                        onClick={() => openEditSheet(member)}
                                                        title="Düzenle"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                                                        onClick={() => setDeleteTarget(member)}
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SHEET: ÜYE EKLE / DÜZENLE (Drawer Panel)
            ══════════════════════════════════════════════════ */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-background border-l border-border"
                >
                    <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <SheetTitle className="text-base font-heading font-semibold text-foreground flex items-center gap-2">
                                    <ContactRound className="w-4 h-4 text-primary" />
                                    {editingMember ? "Laboratuvar Üyesini Düzenle" : "Yeni Laboratuvar Üyesi Ekle"}
                                </SheetTitle>
                                <SheetDescription className="text-xs text-muted-foreground">
                                    Profil, iletişim ve diller bazında CV & biyografi bilgilerini yapılandırın
                                </SheetDescription>
                            </div>
                        </div>

                        {/* Sheet Ana Sekmeleri */}
                        <div className="flex items-center gap-1.5 pt-3">
                            <button
                                type="button"
                                onClick={() => setSheetTab("general")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                                    sheetTab === "general"
                                        ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Genel Bilgiler & İletişim
                            </button>
                            <button
                                type="button"
                                onClick={() => setSheetTab("lang")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                                    sheetTab === "lang"
                                        ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>Çoklu Dil & CV</span>
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-background/50">
                                    EN / TR
                                </Badge>
                            </button>
                        </div>
                    </SheetHeader>

                    {/* Scrollable İçerik */}
                    <form id="member-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                        {sheetTab === "general" ? (
                            <>
                                {/* ── Profil Fotoğrafı ── */}
                                <div className="space-y-2 p-3.5 bg-muted/20 rounded-xl border border-border">
                                    <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                                        <span>Profil Fotoğrafı</span>
                                        {avatarPreview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAvatarFile(null);
                                                    setAvatarPreview("");
                                                    setFormData((f) => ({ ...f, avatar_url_custom: "" }));
                                                }}
                                                className="text-[11px] text-destructive hover:underline"
                                            >
                                                Fotoğrafı Kaldır
                                            </button>
                                        )}
                                    </Label>

                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-muted-foreground/40" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:bg-muted transition-colors shadow-2xs">
                                                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span>Dosya Seç</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleAvatarSelect}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <span className="text-[11px] text-muted-foreground">veya</span>
                                                <Input
                                                    placeholder="Görsel URL'si yapıştırın..."
                                                    value={formData.avatar_url_custom}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, avatar_url_custom: e.target.value });
                                                        if (e.target.value) setAvatarPreview(e.target.value);
                                                    }}
                                                    className="h-8 text-xs flex-1"
                                                />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Kare veya dikey orantılı, net portre fotoğrafı (Maks. 10MB)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Ad Soyad & Telefon & Sıra ── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-foreground">
                                            Ad Soyad <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Örn: Dr. Deniz Aksoy"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="h-9 text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-foreground">
                                            Telefon Numarası
                                        </Label>
                                        <div className="relative">
                                            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="+90 (312) 297 68 00"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="h-9 text-xs pl-8"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Laboratuvar Direktörü Seçimi ── */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Award className="w-3.5 h-3.5 text-amber-600" />
                                            <span>Laboratuvar Direktörü Olarak Belirle</span>
                                        </Label>
                                        <p className="text-[11px] text-muted-foreground">
                                            Bu üye laboratuvar direktörü olarak atanır ve sitede /director sayfasında öne çıkarılır. Normal üye listesinde gösterilmez.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={Boolean(formData.is_director)}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_director: checked })}
                                    />
                                </div>

                                {/* ── URL Slug (SEO Dostu Bağlantı) ── */}
                                <div className="space-y-1.5 p-2.5 rounded-xl bg-muted/20 border border-border/60">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-primary" />
                                            <span>URL Slug (Kalıcı Bağlantı)</span>
                                        </Label>
                                        <span className="text-[10px] text-muted-foreground">Boşsa Ad Soyad'dan otomatik üretilir</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-muted-foreground">/members/</span>
                                        <Input
                                            placeholder="ornek: dr-deniz-aksoy"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="h-8 text-xs font-mono flex-1"
                                        />
                                        {editingMember?.slug && (
                                            <a
                                                href={`/members/${editingMember.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline px-2"
                                                title="Sayfayı yeni sekmede aç"
                                            >
                                                <span>Görüntüle</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* ── Birden Fazla E-posta Alanı ── */}
                                <div className="space-y-2 p-3.5 bg-muted/20 rounded-xl border border-border">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-primary" />
                                            <span>E-posta Adresleri</span>
                                            <span className="text-[10px] font-normal text-muted-foreground">(Birden fazla eklenebilir)</span>
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={addEmailField}
                                            className="h-6 px-2 text-[11px] text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
                                        >
                                            <PlusCircle className="w-3 h-3 mr-1" />
                                            E-posta Ekle
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {emailsList.map((email, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                <div className="relative flex-1">
                                                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="email"
                                                        placeholder={idx === 0 ? "ana.eposta@kurum.edu.tr (Birincil)" : "alternatif.eposta@gmail.com"}
                                                        value={email}
                                                        onChange={(e) => handleEmailChange(idx, e.target.value)}
                                                        className="h-8 text-xs pl-8"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeEmailField(idx)}
                                                    disabled={emailsList.length === 1 && !email}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                                                    title="Bu e-postayı kaldır"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Google Scholar & Sosyal Bağlantılar ── */}
                                <div className="space-y-2.5 p-3.5 bg-muted/20 rounded-xl border border-border">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Google Scholar & Akademik Linkler</span>
                                        </Label>
                                        <span className="text-[10px] text-muted-foreground">JSON formatında saklanır</span>
                                    </div>

                                    <div className="space-y-2">
                                        {/* Google Scholar (Öne Çıkarılmış) */}
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-medium text-blue-700 dark:text-blue-400 flex items-center gap-1">
                                                <GraduationCap className="w-3 h-3" />
                                                Google Scholar Profili
                                            </label>
                                            <Input
                                                placeholder="https://scholar.google.com/citations?user=..."
                                                value={socialLinks.scholar || ""}
                                                onChange={(e) => handleSocialChange("scholar", e.target.value)}
                                                className="h-8 text-xs bg-background"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            {/* ORCID */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                                    <Globe className="w-3 h-3" />
                                                    ORCID Linki
                                                </label>
                                                <Input
                                                    placeholder="https://orcid.org/..."
                                                    value={socialLinks.orcid || ""}
                                                    onChange={(e) => handleSocialChange("orcid", e.target.value)}
                                                    className="h-8 text-xs bg-background"
                                                />
                                            </div>

                                            {/* LinkedIn */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1">
                                                    <Linkedin className="w-3 h-3" />
                                                    LinkedIn
                                                </label>
                                                <Input
                                                    placeholder="https://linkedin.com/in/..."
                                                    value={socialLinks.linkedin || ""}
                                                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                                                    className="h-8 text-xs bg-background"
                                                />
                                            </div>

                                            {/* ResearchGate */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-teal-700 dark:text-teal-400 flex items-center gap-1">
                                                    <Share2 className="w-3 h-3" />
                                                    ResearchGate
                                                </label>
                                                <Input
                                                    placeholder="https://researchgate.net/profile/..."
                                                    value={socialLinks.researchgate || ""}
                                                    onChange={(e) => handleSocialChange("researchgate", e.target.value)}
                                                    className="h-8 text-xs bg-background"
                                                />
                                            </div>

                                            {/* GitHub */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-foreground flex items-center gap-1">
                                                    <Github className="w-3 h-3" />
                                                    GitHub
                                                </label>
                                                <Input
                                                    placeholder="https://github.com/..."
                                                    value={socialLinks.github || ""}
                                                    onChange={(e) => handleSocialChange("github", e.target.value)}
                                                    className="h-8 text-xs bg-background"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Sıralama & Yayın Durumu ── */}
                                <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-xl border border-border">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-foreground">Sıra Numarası</Label>
                                        <Input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                                            className="h-8 text-xs"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <div>
                                            <Label className="text-xs font-medium text-foreground">Yayında</Label>
                                            <p className="text-[10px] text-muted-foreground">Sitede gösterilsin</p>
                                        </div>
                                        <Switch
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ══════════════════════════════════════════════════
                                ÇOKLU DİL İÇERİKLERİ & CV DOSYALARI (EN / TR TABS)
                            ══════════════════════════════════════════════════ */
                            <div className="space-y-4">
                                {/* Dil Seçim Butonları */}
                                <div className="flex items-center justify-between bg-muted p-1 rounded-xl">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveLangTab("en")}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                                                activeLangTab === "en"
                                                    ? "bg-background text-foreground shadow-2xs font-semibold"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <LanguageFlag code="en" className="w-4 h-4" />
                                            <span>İngilizce İçerik</span>
                                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 ml-1">Varsayılan</Badge>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveLangTab("tr")}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                                                activeLangTab === "tr"
                                                    ? "bg-background text-foreground shadow-2xs font-semibold"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <LanguageFlag code="tr" className="w-4 h-4" />
                                            <span>Türkçe İçerik</span>
                                            {formData.bio_tr && formData.role_tr ? (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="İçerik dolu" />
                                            ) : (
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="İçerik eksik" />
                                            )}
                                        </button>
                                    </div>

                                    <span className="text-[11px] text-muted-foreground pr-2">
                                        {activeLangTab === "en" ? "🇬🇧 English Content & CV" : "🇹🇷 Türkçe İçerik & CV"}
                                    </span>
                                </div>

                                {activeLangTab === "en" ? (
                                    <div className="space-y-3.5 bg-muted/20 p-4 rounded-xl border border-border">
                                        {/* Ünvan (EN) */}
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-foreground flex items-center justify-between">
                                                <span>Pozisyon / Ünvan (EN)</span>
                                                <span className="text-[10px] text-muted-foreground">Örn: Postdoctoral Researcher</span>
                                            </Label>
                                            <Input
                                                placeholder="e.g. Principal Investigator, Postdoctoral Researcher, Ph.D. Candidate"
                                                value={formData.role_en}
                                                onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                                                className="h-8 text-xs bg-background"
                                            />
                                        </div>

                                        {/* Biyografi (EN) */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium text-foreground">
                                                    Biyografi (İngilizce)
                                                </Label>
                                                <span className="text-[10px] font-mono text-muted-foreground">
                                                    {formData.bio_en?.length || 0} karakter
                                                </span>
                                            </div>
                                            <Textarea
                                                placeholder="Write academic background, focus areas, key accomplishments..."
                                                rows={4}
                                                value={formData.bio_en}
                                                onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                                                className="text-xs resize-none bg-background"
                                            />
                                        </div>

                                        {/* Özgeçmiş CV (EN) */}
                                        <div className="space-y-2 pt-2 border-t border-border/60">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>Özgeçmiş Belgesi (İngilizce CV - PDF/DOC)</span>
                                                </Label>
                                                {(cvEnFile || formData.cv_en_custom || editingMember?.cv_en) && (
                                                    <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200">
                                                        CV Mevcut
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:bg-muted transition-colors shadow-2xs">
                                                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span>PDF / Word Yükle</span>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleCvEnSelect}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <Input
                                                    placeholder="veya CV URL bağlantısı..."
                                                    value={formData.cv_en_custom}
                                                    onChange={(e) => setFormData({ ...formData, cv_en_custom: e.target.value })}
                                                    className="h-8 text-xs flex-1 bg-background"
                                                />
                                            </div>

                                            {cvEnFile && (
                                                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Seçilen dosya: {cvEnFile.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Detaylı İçerik (Body - EN) Rich Text Editor */}
                                        <div className="space-y-1.5 pt-2 border-t border-border/60">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>Detaylı Profil İçeriği (Body - İngilizce)</span>
                                                </Label>
                                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-blue-50 text-blue-700 border-blue-200">
                                                    Zengin Metin Editörü
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Üyenin ayrıntılı araştırma konuları, projeleri, yayınları ve laboratuvar görevlerini zengin metin olarak biçimlendirin.
                                            </p>
                                            <RichTextEditor
                                                content={formData.body_en}
                                                onChange={(html) => setFormData((prev) => ({ ...prev, body_en: html }))}
                                                placeholder="Write detailed background, publications, ongoing projects, lab duties in English..."
                                                minHeight="min-h-[160px]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3.5 bg-muted/20 p-4 rounded-xl border border-border">
                                        {/* Ünvan (TR) */}
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-foreground flex items-center justify-between">
                                                <span>Pozisyon / Ünvan (TR)</span>
                                                <span className="text-[10px] text-muted-foreground">Örn: Doktora Sonrası Araştırmacı</span>
                                            </Label>
                                            <Input
                                                placeholder="Örn: Laboratuvar Yöneticisi, Doktora Sonrası Araştırmacı, Doktora Öğrencisi"
                                                value={formData.role_tr}
                                                onChange={(e) => setFormData({ ...formData, role_tr: e.target.value })}
                                                className="h-8 text-xs bg-background"
                                            />
                                        </div>

                                        {/* Biyografi (TR) */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium text-foreground">
                                                    Biyografi (Türkçe)
                                                </Label>
                                                <span className="text-[10px] font-mono text-muted-foreground">
                                                    {formData.bio_tr?.length || 0} karakter
                                                </span>
                                            </div>
                                            <Textarea
                                                placeholder="Akademik geçmiş, araştırma ilgi alanları, yayınlar ve uzmanlıkları yazın..."
                                                rows={4}
                                                value={formData.bio_tr}
                                                onChange={(e) => setFormData({ ...formData, bio_tr: e.target.value })}
                                                className="text-xs resize-none bg-background"
                                            />
                                        </div>

                                        {/* Özgeçmiş CV (TR) */}
                                        <div className="space-y-2 pt-2 border-t border-border/60">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Özgeçmiş Belgesi (Türkçe CV - PDF/DOC)</span>
                                                </Label>
                                                {(cvTrFile || formData.cv_tr_custom || editingMember?.cv_tr) && (
                                                    <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200">
                                                        CV Mevcut
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border hover:bg-muted transition-colors shadow-2xs">
                                                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span>PDF / Word Yükle</span>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleCvTrSelect}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <Input
                                                    placeholder="veya CV URL bağlantısı..."
                                                    value={formData.cv_tr_custom}
                                                    onChange={(e) => setFormData({ ...formData, cv_tr_custom: e.target.value })}
                                                    className="h-8 text-xs flex-1 bg-background"
                                                />
                                            </div>

                                            {cvTrFile && (
                                                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Seçilen dosya: {cvTrFile.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Detaylı İçerik (Body - TR) Rich Text Editor */}
                                        <div className="space-y-1.5 pt-2 border-t border-border/60">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Detaylı Profil İçeriği (Body - Türkçe)</span>
                                                </Label>
                                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    Zengin Metin Editörü
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Üyenin ayrıntılı araştırma konuları, projeleri, yayınları ve laboratuvar görevlerini zengin metin olarak biçimlendirin.
                                            </p>
                                            <RichTextEditor
                                                content={formData.body_tr}
                                                onChange={(html) => setFormData((prev) => ({ ...prev, body_tr: html }))}
                                                placeholder="Üyenin ayrıntılı araştırma konuları, projeleri, yayınları ve laboratuvar görevlerini Türkçe yazın..."
                                                minHeight="min-h-[160px]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Canlı Önizleme Kartı */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                            <span>Canlı Kart Önizlemesi</span>
                                        </span>
                                        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                                            <button
                                                type="button"
                                                onClick={() => setSheetPreviewLang("en")}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                                    sheetPreviewLang === "en" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <LanguageFlag code="en" className="w-3 h-3" /> EN
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSheetPreviewLang("tr")}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                                    sheetPreviewLang === "tr" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <LanguageFlag code="tr" className="w-3 h-3" /> TR
                                            </button>
                                        </div>
                                    </div>

                                    <MemberPreviewCard
                                        member={{
                                            ...formData,
                                            emails: emailsList.filter(Boolean),
                                            social_links: socialLinks,
                                            avatar_preview: avatarPreview,
                                        }}
                                        lang={sheetPreviewLang}
                                    />
                                </div>
                            </div>
                        )}
                    </form>

                    <SheetFooter className="px-5 py-3 border-t border-border bg-muted/20 shrink-0 flex items-center justify-between sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSheetOpen(false)}
                            disabled={submitting}
                            className="cursor-pointer"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            form="member-form"
                            size="sm"
                            disabled={submitting}
                            className="cursor-pointer shadow-xs"
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                            {editingMember ? "Güncellemeleri Kaydet" : "Üyeyi Kaydet"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* ══════════════════════════════════════════════════
                MODAL: ÜYE DETAYLI ÖNİZLEME (Dialog)
            ══════════════════════════════════════════════════ */}
            <Dialog open={Boolean(previewMember)} onOpenChange={(open) => !open && setPreviewMember(null)}>
                <DialogContent className="max-w-lg p-5">
                    <DialogHeader className="pb-3 border-b border-border">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-base font-heading font-semibold">
                                Üye Profil Kartı
                            </DialogTitle>
                            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                                <button
                                    type="button"
                                    onClick={() => setModalPreviewLang("en")}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                        modalPreviewLang === "en" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <LanguageFlag code="en" className="w-3 h-3" /> EN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalPreviewLang("tr")}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                        modalPreviewLang === "tr" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <LanguageFlag code="tr" className="w-3 h-3" /> TR
                                </button>
                            </div>
                        </div>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Sitede ziyaretçilere gösterilen akademik üye profil kartı
                        </DialogDescription>
                    </DialogHeader>

                    {previewMember && (
                        <div className="pt-2">
                            <MemberPreviewCard member={previewMember} lang={modalPreviewLang} />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ══════════════════════════════════════════════════
                SİLME ONAY MODALI (AlertDialog)
            ══════════════════════════════════════════════════ */}
            <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Laboratuvar Üyesini Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong className="text-foreground">{deleteTarget?.name}</strong> isimli üyeyi sistemden silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve üyeye ait CV ile profil görselleri de sunucudan kaldırılacaktır.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                        >
                            {deleting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                            Evet, Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
