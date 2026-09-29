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
    Plus,
    Pencil,
    Trash2,
    Eye,
    GalleryThumbnails,
    Upload,
    Link as LinkIcon,
    RefreshCw,
    AlertCircle,
    Search,
    ImagePlus,
    Check,
    X,
    Loader2,
    Palette,
    Languages,
} from "lucide-react";
import { get, post, patch, del } from "@/lib/api";
import useToken from "@/hooks/useToken";
import { toast } from "sonner";
import { getSwatchesSync } from "colorthief";
import { LanguageFlag } from "@/components/LanguageFlag";

// ─────────────────────────────────────────────────────────────
// HOOK: Görselden ColorThief ile dinamik renk çıkarma
// ─────────────────────────────────────────────────────────────
function useImageColors(imageUrl) {
    const [colors, setColors] = useState({
        overlayColor: "rgba(28, 84, 127, 0.4)",
        textBgColor: "#1C547F",
        textColor: "#ffffff",
        isAnalyzed: false,
    });

    useEffect(() => {
        if (!imageUrl) {
            setColors({
                overlayColor: "rgba(28, 84, 127, 0.4)",
                textBgColor: "#1C547F",
                textColor: "#ffffff",
                isAnalyzed: false,
            });
            return;
        }

        let isCancelled = false;
        const img = new Image();

        if (!imageUrl.startsWith("blob:") && !imageUrl.startsWith("data:")) {
            img.crossOrigin = "anonymous";
        }

        img.onload = () => {
            if (isCancelled) return;
            try {
                const swatches = getSwatchesSync(img);

                if (swatches && swatches.Vibrant && swatches.LightMuted && swatches.DarkMuted) {
                    const bg = swatches.Vibrant.color.css();
                    const txt = swatches.DarkMuted.bodyTextColor.css();
                    const rgbaColor = swatches.LightMuted.color.css().replace("rgb(", "rgba(").replace(")", ", 0.8)");

                    setColors({
                        overlayColor: rgbaColor,
                        textBgColor: bg,
                        textColor: txt,
                        isAnalyzed: true,
                    });
                } else if (swatches) {
                    const vibrant = swatches.Vibrant || swatches.DarkVibrant || swatches.LightVibrant || swatches.Muted;
                    const muted = swatches.LightMuted || swatches.Muted || swatches.DarkMuted;
                    const dark = swatches.DarkMuted || swatches.DarkVibrant || swatches.Vibrant;

                    const bg = vibrant?.color ? vibrant.color.css() : "#1C547F";
                    const txt = dark?.bodyTextColor ? dark.bodyTextColor.css() : "#ffffff";
                    const rgbaColor = muted?.color
                        ? muted.color.css().replace("rgb(", "rgba(").replace(")", ", 0.8)")
                        : "rgba(28, 84, 127, 0.4)";

                    setColors({
                        overlayColor: rgbaColor,
                        textBgColor: bg,
                        textColor: txt,
                        isAnalyzed: Boolean(vibrant || muted),
                    });
                }
            } catch (error) {
                console.warn("Renk analizi başarısız oldu:", imageUrl, error);
            }
        };

        img.onerror = () => {
            console.warn("Resim okunamadı:", imageUrl);
        };

        img.src = imageUrl;

        return () => {
            isCancelled = true;
        };
    }, [imageUrl]);

    return colors;
}

// ─────────────────────────────────────────────────────────────
// BİLEŞEN: HeroSlide ile Birebir Slayt Görsel Sunumu
// ─────────────────────────────────────────────────────────────
function SliderHeroPreview({
    imageUrl,
    text,
    title,
    order,
    isActive,
    langLabel,
    height = "h-[55vh] min-h-[340px]",
    compact = false,
}) {
    const colors = useImageColors(imageUrl);

    return (
        <div className={`relative w-full ${height} overflow-hidden flex flex-col justify-end bg-slate-950 select-none`}>
            {/* 1. KATMAN: Büyütülmüş Bulanık Arka Plan */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-md scale-125 z-0 transition-all duration-700"
                style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
            />

            {/* 2. KATMAN: ColorThief %80 Opak Overlay */}
            <div
                className="absolute inset-0 z-[5] pointer-events-none transition-colors duration-700 ease-in-out"
                style={{ backgroundColor: colors.overlayColor }}
            />

            {/* 3. KATMAN: Net Orijinal Resim */}
            <div
                className="absolute inset-0 bg-contain bg-no-repeat bg-center z-10 transition-all duration-700"
                style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
            />

            {/* Üst Rozetler ve Renk Göstergesi */}
            <div className={`absolute ${compact ? "top-2.5 left-2.5" : "top-4 left-4"} z-30 flex items-center gap-1.5 flex-wrap`}>
                {order !== undefined && (
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[10px] sm:text-xs">
                        #{order}
                    </Badge>
                )}
                {title && (
                    <Badge variant="secondary" className="bg-white/90 text-black text-[10px] sm:text-xs font-semibold backdrop-blur-md">
                        {title}
                    </Badge>
                )}
                {isActive !== undefined && (
                    <Badge className={`text-[10px] sm:text-xs ${isActive ? "bg-emerald-600 text-white" : "bg-black/50 text-white/80"}`}>
                        {isActive ? "Yayında" : "Pasif"}
                    </Badge>
                )}
                {langLabel && (
                    <Badge className="bg-primary/90 text-primary-foreground text-[10px] sm:text-xs font-medium">
                        {langLabel}
                    </Badge>
                )}
                {colors.isAnalyzed && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] bg-black/65 backdrop-blur-md text-white/95 border border-white/20">
                        <span className="w-2.5 h-2.5 rounded-full border border-white/50 shrink-0" style={{ backgroundColor: colors.textBgColor }} />
                        <span className="font-mono text-[10px]">{colors.textBgColor}</span>
                    </span>
                )}
            </div>

            {/* 4. KATMAN: Metin Kutusu */}
            <div className={`w-full flex justify-center ${compact ? "px-3 pb-3" : "px-6 pb-8"} relative z-30`}>
                <div
                    className={`${compact ? "max-w-md p-2.5" : "max-w-2xl p-3.5 sm:p-4"} rounded-xl drop-shadow-xl text-center transition-colors duration-700 ease-in-out border border-white/15`}
                    style={{ backgroundColor: colors.textBgColor }}
                >
                    <p
                        className={`${compact ? "text-xs line-clamp-2" : "text-sm sm:text-base font-medium"} text-white/95 max-w-4xl mx-auto drop-shadow-sm leading-relaxed`}
                        style={{ color: colors.textColor }}
                    >
                        {text || "Metin bulunamadı..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// BİLEŞEN: Tablo Satırı (Çoklu Dil Rozetleri ile)
// ─────────────────────────────────────────────────────────────
function SliderTableRow({ slider, onPreview, onEdit, onDelete, onToggle }) {
    const img = slider.image_url || slider.image;
    const colors = useImageColors(img);

    const hasEn = Boolean(slider.text_en || slider.text);
    const hasTr = Boolean(slider.text_tr);

    return (
        <TableRow className="group">
            {/* Sıra */}
            <TableCell className="text-center">
                <span className="text-xs font-mono text-muted-foreground">{slider.order}</span>
            </TableCell>

            {/* Thumbnail + Dinamik Renk */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="relative w-16 h-10 rounded-md overflow-hidden bg-muted border border-border cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all shrink-0 shadow-2xs group/thumb"
                        onClick={() => onPreview(slider)}
                        title="Canlı Önizleme"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-[1px] scale-110 opacity-70"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                        <div
                            className="absolute inset-0 transition-colors pointer-events-none"
                            style={{ backgroundColor: colors.overlayColor }}
                        />
                        <div
                            className="absolute inset-0 bg-contain bg-center bg-no-repeat z-10"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    </button>
                    <div
                        className="w-3.5 h-3.5 rounded-full border border-border shrink-0 shadow-2xs cursor-help"
                        style={{ backgroundColor: colors.textBgColor }}
                        title={`Slayt Rengi: ${colors.textBgColor}`}
                    />
                </div>
            </TableCell>

            {/* İçerik & Çoklu Dil Göstergesi */}
            <TableCell>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground truncate">
                            {slider.title_en || slider.title || slider.title_tr || "Başlıksız Slayt"}
                        </p>
                        {/* Dil Bayrakları */}
                        <div className="flex items-center gap-1">
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium border inline-flex items-center gap-1 ${
                                    hasEn ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300" : "bg-muted text-muted-foreground border-transparent opacity-50"
                                }`}
                                title={hasEn ? "İngilizce metin mevcut" : "İngilizce metin eksik"}
                            >
                                <LanguageFlag code="en" className="w-3.5 h-3.5" /> EN
                            </span>
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium border inline-flex items-center gap-1 ${
                                    hasTr ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                                }`}
                                title={hasTr ? "Türkçe metin mevcut" : "Türkçe metin henüz girilmedi"}
                            >
                                <LanguageFlag code="tr" className="w-3.5 h-3.5" /> TR {hasTr ? "" : "⚠"}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-md">
                        {slider.text_en || slider.text || slider.text_tr}
                    </p>
                </div>
            </TableCell>

            {/* Durum */}
            <TableCell className="text-center">
                <button
                    type="button"
                    className="cursor-pointer inline-block"
                    onClick={() => onToggle(slider)}
                    title={slider.is_active ? "Pasife al" : "Aktife al"}
                >
                    {slider.is_active ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-[11px] gap-1 cursor-pointer">
                            <Check className="w-3 h-3" />Aktif
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[11px] gap-1 cursor-pointer">
                            <X className="w-3 h-3" />Pasif
                        </Badge>
                    )}
                </button>
            </TableCell>

            {/* İşlemler */}
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-primary"
                        onClick={() => onPreview(slider)}
                        title="Önizle"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(slider)}
                        title="Düzenle"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(slider)}
                        title="Sil"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

// ─────────────────────────────────────────────────────────────
// ANA SAYFA BİLEŞENİ
// ─────────────────────────────────────────────────────────────
export default function SliderManagementPage() {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Sheet (side panel) state
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);
    const [imageSourceType, setImageSourceType] = useState("file");
    const [formLang, setFormLang] = useState("en"); // "en" | "tr"
    const [previewLang, setPreviewLang] = useState("en"); // "en" | "tr"

    const [formData, setFormData] = useState({
        title_en: "",
        title_tr: "",
        text_en: "",
        text_tr: "",
        link: "",
        order: 0,
        is_active: true,
        image_url_custom: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    // Preview modal
    const [previewSlider, setPreviewSlider] = useState(null);
    const [modalPreviewLang, setModalPreviewLang] = useState("en");

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ─── Data fetching ─────────────────────────────────────
    const fetchSliders = async () => {
        setLoading(true);
        try {
            const token = await useToken();
            const res = await get({ endpoint: "admin/sliders", bearerToken: token });
            if (res.status && Array.isArray(res.sliders)) {
                setSliders(res.sliders);
            } else {
                toast.error("Slider listesi alınamadı.");
            }
        } catch (error) {
            toast.error(error.message || "Slider verileri yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    // ─── Derived data ──────────────────────────────────────
    const filteredSliders = useMemo(() => {
        return sliders.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q ||
                (item.title_en && item.title_en.toLowerCase().includes(q)) ||
                (item.title_tr && item.title_tr.toLowerCase().includes(q)) ||
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.text_en && item.text_en.toLowerCase().includes(q)) ||
                (item.text_tr && item.text_tr.toLowerCase().includes(q)) ||
                (item.text && item.text.toLowerCase().includes(q));
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && item.is_active) ||
                (statusFilter === "passive" && !item.is_active);
            return matchesSearch && matchesStatus;
        });
    }, [sliders, searchQuery, statusFilter]);

    const activeCount = useMemo(() => sliders.filter((s) => s.is_active).length, [sliders]);
    const passiveCount = useMemo(() => sliders.filter((s) => !s.is_active).length, [sliders]);

    // ─── Sheet open helpers ────────────────────────────────
    const openAddSheet = () => {
        setEditingSlider(null);
        setImageSourceType("file");
        setSelectedFile(null);
        setPreviewUrl("");
        setFormLang("en");
        setPreviewLang("en");
        setFormData({
            title_en: "",
            title_tr: "",
            text_en: "",
            text_tr: "",
            link: "",
            order: sliders.length + 1,
            is_active: true,
            image_url_custom: "",
        });
        setIsSheetOpen(true);
    };

    const openEditSheet = (slider) => {
        setEditingSlider(slider);
        setSelectedFile(null);
        const isCustomOrLocal = slider.image && (slider.image.startsWith("http") || slider.image.startsWith("/images"));
        setImageSourceType(isCustomOrLocal ? "url" : "file");
        setFormLang("en");
        setPreviewLang("en");
        setFormData({
            title_en: slider.title_en || slider.title || "",
            title_tr: slider.title_tr || "",
            text_en: slider.text_en || slider.text || "",
            text_tr: slider.text_tr || "",
            link: slider.link || "",
            order: slider.order ?? 0,
            is_active: Boolean(slider.is_active),
            image_url_custom: isCustomOrLocal ? slider.image : "",
        });
        setPreviewUrl(slider.image_url || slider.image || "");
        setIsSheetOpen(true);
    };

    // ─── File handling ─────────────────────────────────────
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // ─── Submit ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasEn = Boolean(formData.text_en.trim());
        const hasTr = Boolean(formData.text_tr.trim());

        if (!hasEn && !hasTr) {
            toast.error("Lütfen en az bir dilde (İngilizce veya Türkçe) slayt metni girin.");
            return;
        }
        if (imageSourceType === "file" && !selectedFile && !editingSlider) {
            toast.error("Bir görsel dosyası seçin.");
            return;
        }
        if (imageSourceType === "url" && !formData.image_url_custom.trim() && !editingSlider) {
            toast.error("Bir görsel bağlantısı girin.");
            return;
        }

        setSubmitting(true);
        try {
            const token = await useToken();
            const body = new FormData();
            body.append("title_en", formData.title_en || "");
            body.append("title_tr", formData.title_tr || "");
            body.append("title", formData.title_en || formData.title_tr || "");
            body.append("text_en", formData.text_en || "");
            body.append("text_tr", formData.text_tr || "");
            body.append("text", formData.text_en || formData.text_tr || "");
            body.append("link", formData.link || "");
            body.append("order", formData.order);
            body.append("is_active", formData.is_active ? "1" : "0");

            if (imageSourceType === "file" && selectedFile) {
                body.append("image", selectedFile);
            } else if (imageSourceType === "url" && formData.image_url_custom) {
                body.append("image_url_custom", formData.image_url_custom);
            }

            const endpoint = editingSlider ? `admin/sliders/${editingSlider.id}` : "admin/sliders";
            const res = await post({ endpoint, body, bearerToken: token });

            if (res.status) {
                toast.success(res.message || "İşlem başarılı.");
                setIsSheetOpen(false);
                fetchSliders();
            } else {
                toast.error(res.message || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error(error.message || "Slider kaydedilirken hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Toggle status ─────────────────────────────────────
    const handleToggleStatus = async (slider) => {
        const prev = slider.is_active;
        setSliders((s) => s.map((x) => x.id === slider.id ? { ...x, is_active: !prev } : x));
        try {
            const token = await useToken();
            const res = await patch({ endpoint: `admin/sliders/${slider.id}/toggle-status`, bearerToken: token });
            if (res.status) {
                toast.success(!prev ? "Slider yayına alındı." : "Slider yayından kaldırıldı.");
            } else {
                setSliders((s) => s.map((x) => x.id === slider.id ? { ...x, is_active: prev } : x));
                toast.error("Durum güncellenemedi.");
            }
        } catch {
            setSliders((s) => s.map((x) => x.id === slider.id ? { ...x, is_active: prev } : x));
            toast.error("Durum değiştirilirken hata oluştu.");
        }
    };

    // ─── Delete ────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const token = await useToken();
            const res = await del({ endpoint: `admin/sliders/${deleteTarget.id}`, bearerToken: token });
            if (res.status) {
                toast.success("Slider silindi.");
                setSliders((s) => s.filter((x) => x.id !== deleteTarget.id));
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

    // Sheet içindeki canlı önizleme metni
    const currentSheetPreviewText = useMemo(() => {
        if (previewLang === "tr") {
            return formData.text_tr || (formData.text_en ? `[TR eksik - EN]: ${formData.text_en}` : "Türkçe metin girin...");
        }
        return formData.text_en || (formData.text_tr ? `[EN eksik - TR]: ${formData.text_tr}` : "Enter English slide text...");
    }, [previewLang, formData.text_en, formData.text_tr]);

    const currentSheetPreviewTitle = useMemo(() => {
        if (previewLang === "tr") {
            return formData.title_tr || formData.title_en;
        }
        return formData.title_en || formData.title_tr;
    }, [previewLang, formData.title_en, formData.title_tr]);

    // ─── Render ────────────────────────────────────────────
    return (
        <>
            <Topbar title="Slider Yönetimi" />

            <div className="p-4 md:p-6 space-y-4">
                {/* ── HEADER BAR ───────────────────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <GalleryThumbnails className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-heading font-semibold text-foreground leading-tight">Slider Yönetimi</h1>
                            <p className="text-xs text-muted-foreground">Ana sayfa hero kaydırıcısını ve çoklu dil içeriklerini yönetin</p>
                        </div>
                        <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />
                        <div className="hidden sm:flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs tabular-nums">{sliders.length} toplam</Badge>
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono text-xs tabular-nums">{activeCount} aktif</Badge>
                            {passiveCount > 0 && (
                                <Badge variant="outline" className="text-muted-foreground font-mono text-xs tabular-nums">{passiveCount} pasif</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={fetchSliders} disabled={loading} className="cursor-pointer h-8">
                            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                            Yenile
                        </Button>
                        <Button size="sm" onClick={openAddSheet} className="cursor-pointer h-8">
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Yeni Slider
                        </Button>
                    </div>
                </div>

                {/* ── TOOLBAR ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Başlık veya metin ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 h-8 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md w-full sm:w-auto">
                        {[
                            { key: "all", label: "Tümü", count: sliders.length },
                            { key: "active", label: "Aktif", count: activeCount },
                            { key: "passive", label: "Pasif", count: passiveCount },
                        ].map((f) => (
                            <Button
                                key={f.key}
                                type="button"
                                size="sm"
                                variant={statusFilter === f.key ? "default" : "ghost"}
                                className={`h-7 text-xs cursor-pointer flex-1 sm:flex-initial px-3 ${statusFilter === f.key ? "shadow-xs" : ""}`}
                                onClick={() => setStatusFilter(f.key)}
                            >
                                {f.label}
                                <span className="ml-1 opacity-60">{f.count}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* ── TABLE ────────────────────────────────── */}
                <div className="border border-border rounded-xl overflow-hidden bg-card">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Yükleniyor...</span>
                        </div>
                    ) : filteredSliders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <GalleryThumbnails className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                {searchQuery || statusFilter !== "all" ? "Sonuç bulunamadı" : "Henüz slider yok"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                {searchQuery || statusFilter !== "all"
                                    ? "Filtreleri temizleyerek tekrar deneyin."
                                    : "Yeni slider ekleyerek başlayın."}
                            </p>
                            {searchQuery || statusFilter !== "all" ? (
                                <Button variant="outline" size="sm" className="mt-3 h-7 text-xs cursor-pointer" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                                    Filtreleri Sıfırla
                                </Button>
                            ) : (
                                <Button size="sm" className="mt-3 h-7 text-xs cursor-pointer" onClick={openAddSheet}>
                                    <Plus className="w-3 h-3 mr-1" />İlk Sliderı Ekle
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-10 text-center text-xs">#</TableHead>
                                    <TableHead className="w-28 text-xs">Görsel & Renk</TableHead>
                                    <TableHead className="text-xs">İçerik & Diller</TableHead>
                                    <TableHead className="w-20 text-center text-xs">Durum</TableHead>
                                    <TableHead className="w-28 text-right text-xs">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSliders.map((slider) => (
                                    <SliderTableRow
                                        key={slider.id}
                                        slider={slider}
                                        onPreview={(s) => {
                                            setPreviewSlider(s);
                                            setModalPreviewLang("en");
                                        }}
                                        onEdit={openEditSheet}
                                        onDelete={setDeleteTarget}
                                        onToggle={handleToggleStatus}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                SHEET — EKLE / DÜZENLE (ÇOKLU DİL DESTEKLİ)
            ══════════════════════════════════════════════════ */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="!w-full sm:!max-w-2xl overflow-y-auto p-0">
                    <SheetHeader className="p-5 pb-0">
                        <SheetTitle className="text-base flex items-center gap-2">
                            <span>{editingSlider ? "Slider Düzenle" : "Yeni Slider Ekle"}</span>
                            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                                Çoklu Dil
                            </Badge>
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                            Slayt görselini ve her dil (İngilizce & Türkçe) için özel metinleri tanımlayın.
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto">
                            {/* ── Canlı Önizleme (Hero Stili & Dil Seçicili) ─────────────── */}
                            <div className="px-5 pt-4">
                                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5" /> Canlı Önizleme
                                    </Label>
                                    {/* Önizleme Dili Değiştirme */}
                                    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewLang("en")}
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                                previewLang === "en" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <LanguageFlag code="en" className="w-3.5 h-3.5" /> EN Önizle
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewLang("tr")}
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                                previewLang === "tr" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <LanguageFlag code="tr" className="w-3.5 h-3.5" /> TR Önizle
                                        </button>
                                    </div>
                                </div>
                                <div className="rounded-xl overflow-hidden border border-border shadow-xs">
                                    {previewUrl ? (
                                        <SliderHeroPreview
                                            imageUrl={previewUrl}
                                            text={currentSheetPreviewText}
                                            title={currentSheetPreviewTitle}
                                            order={formData.order}
                                            isActive={formData.is_active}
                                            langLabel={previewLang === "en" ? "🇬🇧 EN" : "🇹🇷 TR"}
                                            height="h-48"
                                            compact={true}
                                        />
                                    ) : (
                                        <div className="w-full h-44 flex flex-col items-center justify-center text-muted-foreground/60 bg-muted/20 border border-dashed border-border rounded-xl">
                                            <ImagePlus className="w-8 h-8 mb-1.5 stroke-[1.5]" />
                                            <p className="text-xs font-medium">Görsel seçilmedi</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">Görsel seçildiğinde ana sayfa Hero renkleri otomatik hesaplanacaktır</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* ── Form Alanları ──────────────── */}
                            <div className="px-5 space-y-4 pb-4">
                                {/* DİL SEKMELERİ (EN / TR) */}
                                <div className="space-y-3 p-3.5 bg-muted/30 rounded-xl border border-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setFormLang("en")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                                                    formLang === "en"
                                                        ? "bg-background text-foreground shadow-xs font-semibold"
                                                        : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <LanguageFlag code="en" className="w-4 h-4" />
                                                <span>İngilizce</span>
                                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 ml-1">Varsayılan</Badge>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormLang("tr")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                                                    formLang === "tr"
                                                        ? "bg-background text-foreground shadow-xs font-semibold"
                                                        : "text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <LanguageFlag code="tr" className="w-4 h-4" />
                                                <span>Türkçe</span>
                                                {formData.text_tr ? (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Metin dolu" />
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Metin henüz girilmedi" />
                                                )}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                                            <LanguageFlag code={formLang} className="w-3.5 h-3.5" />
                                            {formLang === "en" ? "English Content" : "Türkçe İçerik"}
                                        </span>
                                    </div>

                                    {formLang === "en" ? (
                                        <div className="space-y-3 pt-1">
                                            {/* Slayt Metni (EN) */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-medium">Slayt Metni (İngilizce) *</Label>
                                                    <span className="text-[10px] text-muted-foreground tabular-nums">{formData.text_en.length}</span>
                                                </div>
                                                <Textarea
                                                    placeholder="Hero slide description in English (default)..."
                                                    rows={3}
                                                    value={formData.text_en}
                                                    onChange={(e) => setFormData({ ...formData, text_en: e.target.value })}
                                                    className="resize-none text-sm bg-background"
                                                />
                                            </div>

                                            {/* Başlık (EN) */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-medium">Başlık (İngilizce) <span className="text-muted-foreground font-normal">(opsiyonel)</span></Label>
                                                <Input
                                                    placeholder="e.g. 2025 Bioengineering Symposium"
                                                    value={formData.title_en}
                                                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                                    className="h-9 text-sm bg-background"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 pt-1">
                                            {/* Slayt Metni (TR) */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-medium">Slayt Metni (Türkçe)</Label>
                                                    <span className="text-[10px] text-muted-foreground tabular-nums">{formData.text_tr.length}</span>
                                                </div>
                                                <Textarea
                                                    placeholder="Hero üzerinde Türkçe dilinde görüntülenecek açıklama metni..."
                                                    rows={3}
                                                    value={formData.text_tr}
                                                    onChange={(e) => setFormData({ ...formData, text_tr: e.target.value })}
                                                    className="resize-none text-sm bg-background"
                                                />
                                            </div>

                                            {/* Başlık (TR) */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-medium">Başlık (Türkçe) <span className="text-muted-foreground font-normal">(opsiyonel)</span></Label>
                                                <Input
                                                    placeholder="Örn: 2025 Biyomühendislik Sempozyumu"
                                                    value={formData.title_tr}
                                                    onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                                                    className="h-9 text-sm bg-background"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Görsel Alanı */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs">Slayt Görseli *</Label>
                                        <div className="flex items-center bg-muted rounded-md p-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setImageSourceType("file")}
                                                className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${imageSourceType === "file" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                Dosya Yükle
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setImageSourceType("url")}
                                                className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${imageSourceType === "url" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                URL / Yol
                                            </button>
                                        </div>
                                    </div>

                                    {imageSourceType === "file" ? (
                                        <label
                                            htmlFor="sheet-file-upload"
                                            className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <Upload className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium text-foreground truncate">
                                                    {selectedFile ? selectedFile.name : "Dosya seçin veya sürükleyin"}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP · maks 10MB · 1920×1080 önerilir</p>
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleFileChange} id="sheet-file-upload" className="hidden" />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="/images/bslide1.jpg veya https://..."
                                                value={formData.image_url_custom}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, image_url_custom: e.target.value });
                                                    setPreviewUrl(e.target.value);
                                                }}
                                                className="pl-8 h-9 text-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Sıra & Durum */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Sıra</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Yayın Durumu</Label>
                                        <div className="flex items-center justify-between border border-border rounded-lg px-3 h-9 bg-background">
                                            <span className="text-xs text-muted-foreground">{formData.is_active ? "Yayında" : "Taslak"}</span>
                                            <Switch
                                                checked={formData.is_active}
                                                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hedef Link */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Hedef Bağlantı <span className="text-muted-foreground font-normal">(opsiyonel)</span></Label>
                                    <Input
                                        placeholder="/research veya https://..."
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Footer ─────────────────────────── */}
                        <SheetFooter className="border-t border-border px-5 py-3 flex-row gap-2 justify-end mt-auto">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsSheetOpen(false)} disabled={submitting} className="cursor-pointer h-8">
                                Vazgeç
                            </Button>
                            <Button type="submit" size="sm" disabled={submitting} className="cursor-pointer h-8 min-w-28">
                                {submitting ? (
                                    <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Kaydediliyor</>
                                ) : editingSlider ? "Kaydet" : "Ekle"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* ══════════════════════════════════════════════════
                PREVIEW MODAL (ColorThief & Çoklu Dil Seçimi)
            ══════════════════════════════════════════════════ */}
            <Dialog open={Boolean(previewSlider)} onOpenChange={(open) => !open && setPreviewSlider(null)}>
                <DialogContent
                    className="max-w-4xl p-0 overflow-hidden bg-black border-slate-800 text-white [&>button]:text-white [&>button]:bg-black/50 [&>button]:hover:bg-black/80 [&>button]:z-40 [&>button]:rounded-full [&>button]:cursor-pointer"
                    showCloseButton={true}
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Slayt Canlı Önizleme</DialogTitle>
                        <DialogDescription>Slaytın ana sayfada nasıl göründüğünün tam önizlemesi</DialogDescription>
                    </DialogHeader>

                    {previewSlider && (() => {
                        const activeTitle = modalPreviewLang === "tr"
                            ? (previewSlider.title_tr || previewSlider.title_en || previewSlider.title)
                            : (previewSlider.title_en || previewSlider.title || previewSlider.title_tr);
                        const activeText = modalPreviewLang === "tr"
                            ? (previewSlider.text_tr || previewSlider.text_en || previewSlider.text)
                            : (previewSlider.text_en || previewSlider.text || previewSlider.text_tr);

                        return (
                            <div className="relative">
                                {/* Üst Sağ Dil Değiştirici */}
                                <div className="absolute top-4 right-14 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-md p-0.5 rounded-lg border border-white/20">
                                    <button
                                        type="button"
                                        onClick={() => setModalPreviewLang("en")}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                            modalPreviewLang === "en" ? "bg-white text-black font-semibold" : "text-white/80 hover:text-white"
                                        }`}
                                    >
                                        <LanguageFlag code="en" className="w-3.5 h-3.5" /> EN
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalPreviewLang("tr")}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                                            modalPreviewLang === "tr" ? "bg-white text-black font-semibold" : "text-white/80 hover:text-white"
                                        }`}
                                    >
                                        <LanguageFlag code="tr" className="w-3.5 h-3.5" /> TR
                                    </button>
                                </div>

                                <SliderHeroPreview
                                    imageUrl={previewSlider.image_url || previewSlider.image}
                                    text={activeText}
                                    title={activeTitle}
                                    order={previewSlider.order}
                                    isActive={previewSlider.is_active}
                                    langLabel={modalPreviewLang === "en" ? "🇬🇧 EN" : "🇹🇷 TR"}
                                    height="h-[60vh] min-h-[380px]"
                                    compact={false}
                                />
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* ══════════════════════════════════════════════════
                DELETE CONFIRM
            ══════════════════════════════════════════════════ */}
            <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Silmek istediğinize emin misiniz?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                            Bu slider kalıcı olarak silinecek ve ana sayfadan kaldırılacaktır.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting} className="cursor-pointer h-8 text-xs">İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer h-8 text-xs"
                        >
                            {deleting ? "Siliniyor..." : "Sil"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
