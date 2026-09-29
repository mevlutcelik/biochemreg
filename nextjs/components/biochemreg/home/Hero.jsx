"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getSwatchesSync } from "colorthief";
import { get } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

// Swiper Stilleri
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- LIQUID GLASS & PAGINATION CSS ---
const customSwiperStyles = `
  @property --angle-1 {
    syntax: "<angle>";
    inherits: false;
    initial-value: -75deg;
  }
  @property --angle-2 {
    syntax: "<angle>";
    inherits: false;
    initial-value: -45deg;
  }
  :root {
    --btn-font-size: 0.325rem;
    --anim--hover-time: 400ms;
    --anim--hover-ease: cubic-bezier(0.25, 1, 0.5, 1);
  }
  @media (min-width: 768px) {
    :root {
      --btn-font-size: 0.75rem;
    }
  }
  
  /* --- PAGINATION (NOKTALAR) --- */
  .swiper-pagination-horizontal {
    bottom: 1rem !important; 
  }
  .swiper-pagination-bullet {
    width: 40px !important;
    height: 6px !important;
    border-radius: 10px !important;
    background: var(--primary, #1C547F) !important;
    opacity: 0.3 !important;
    transition: all 0.3s ease;
  }
  .swiper-pagination-bullet-active {
    opacity: 1 !important;
  }
  /* Koyu arka planlar için beyaz pagination */
  .swiper-pagination-white .swiper-pagination-bullet {
    background: #ffffff !important;
  }

  /* --- LIQUID GLASS OKLAR --- */
  .swiper-button-next::after,
  .swiper-button-prev::after {
    display: none !important;
  }
  .button-wrap {
    position: relative;
    z-index: 2;
    border-radius: 999vw;
    background: transparent;
    pointer-events: none;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    font-size: var(--btn-font-size);
  }
  .button-shadow {
    display: none !important;
    --shadow-cuttoff-fix: 2em;
    position: absolute;
    width: calc(100% + var(--shadow-cuttoff-fix));
    height: calc(100% + var(--shadow-cuttoff-fix));
    top: calc(0% - var(--shadow-cuttoff-fix) / 2);
    left: calc(0% - var(--shadow-cuttoff-fix) / 2);
    filter: blur(clamp(2px, 0.125em, 12px));
    -webkit-filter: blur(clamp(2px, 0.125em, 12px));
    overflow: visible;
    pointer-events: none;
  }
  .button-shadow::after {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    border-radius: 999vw;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    width: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    height: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    top: calc(var(--shadow-cuttoff-fix) - 0.5em);
    left: calc(var(--shadow-cuttoff-fix) - 0.875em);
    padding: 0.125em;
    box-sizing: border-box;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    overflow: visible;
    opacity: 1;
  }
  .button-wrap button {
    --border-width: clamp(1px, 0.0625em, 4px);
    all: unset;
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    pointer-events: auto;
    z-index: 3;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: linear-gradient(-75deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border-radius: 999vw;
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05), inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5), 0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2), 0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2), 0 0 0 0 rgba(255, 255, 255, 1);
    backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    padding: 1em;
  }
  .button-wrap button:hover {
    transform: scale(0.975);
    backdrop-filter: blur(0.01em);
    -webkit-backdrop-filter: blur(0.01em);
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05), inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5), 0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.25), 0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.5), 0 0 0 0 rgba(255, 255, 255, 1);
  }
  .button-wrap button span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--foreground, #18303F);
    z-index: 4;
  }
  .button-wrap button span::after {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    width: calc(100% + 2em);
    height: calc(100% + 2em);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 999vw;
    background: linear-gradient(var(--angle-2), rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 40% 50%, rgba(255, 255, 255, 0) 55%);
    mix-blend-mode: screen;
    pointer-events: none;
    background-size: 200% 200%;
    background-position: 0% 50%;
    background-repeat: no-repeat;
    transition: background-position calc(var(--anim--hover-time) * 1.25) var(--anim--hover-ease), --angle-2 calc(var(--anim--hover-time) * 1.25) var(--anim--hover-ease);
  }
  .button-wrap button:hover span::after {
    background-position: 25% 50%;
  }
  .button-wrap button:active span::after {
    background-position: 50% 15%;
    --angle-2: -15deg;
  }
  .button-wrap button::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: 999vw;
    width: calc(100% + var(--border-width));
    height: calc(100% + var(--border-width));
    top: calc(0% - var(--border-width) / 2);
    left: calc(0% - var(--border-width) / 2);
    padding: var(--border-width);
    box-sizing: border-box;
    background: conic-gradient(from var(--angle-1) at 50% 50%, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 5% 40%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 60% 95%, rgba(0, 0, 0, 0.5)), linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    transition: all var(--anim--hover-time) var(--anim--hover-ease), --angle-1 500ms ease;
    box-shadow: inset 0 0 0 calc(var(--border-width) / 2) rgba(255, 255, 255, 0.5);
  }
  .button-wrap button:hover::after {
    --angle-1: -125deg;
  }
  .button-wrap button:active::after {
    --angle-1: -75deg;
  }
  .button-wrap:has(button:hover) .button-shadow {
    filter: blur(clamp(2px, 0.0625em, 6px));
    -webkit-filter: blur(clamp(2px, 0.0625em, 6px));
  }
  .button-wrap:has(button:hover) .button-shadow::after {
    top: calc(var(--shadow-cuttoff-fix) - 0.875em);
    opacity: 1;
  }
  .button-wrap:has(button:active) {
    transform: rotate3d(1, 0, 0, 25deg);
  }
  .button-wrap:has(button:active) button {
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05), inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5), 0 0.125em 0.125em -0.125em rgba(0, 0, 0, 0.2), 0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2), 0 0.225em 0.05em 0 rgba(0, 0, 0, 0.05), 0 0.25em 0 0 rgba(255, 255, 255, 0.75), inset 0 0.25em 0.05em 0 rgba(0, 0, 0, 0.15);
  }
  .button-wrap:has(button:active) .button-shadow {
    filter: blur(clamp(2px, 0.125em, 12px));
    -webkit-filter: blur(clamp(2px, 0.125em, 12px));
  }
  /* --- SKELETON ANİMASYONLARI --- */
  @keyframes heroShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes heroPulseGlow {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50% { opacity: 0.75; transform: scale(1.08); }
  }
  .animate-hero-shimmer {
    animation: heroShimmer 2.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }
  .animate-hero-glow {
    animation: heroPulseGlow 4s infinite ease-in-out;
  }
`;

/* HER BİR SLAYT BİLEŞENİ */
const HeroSlide = ({ slide, locale = "en" }) => {
    const [overlayColor, setOverlayColor] = useState("rgba(28, 84, 127, 0.4)");
    const [textBgColor, setTextBgColor] = useState("#1C547F");
    const [textColor, setTextColor] = useState("#ffffff");
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageUrl = slide.image_url || slide.image;

    // Aktif dile göre metin seçimi (TR ise text_tr, EN ise text_en veya varsayılan text)
    const displayText = (locale === "tr" ? (slide.text_tr || slide.text) : (slide.text_en || slide.text)) || slide.text;

    useEffect(() => {
        if (!imageUrl) return;

        setImageLoaded(false);
        const img = new Image();
        if (!imageUrl.startsWith("blob:") && !imageUrl.startsWith("data:")) {
            img.crossOrigin = "anonymous";
        }

        img.onload = () => {
            setImageLoaded(true);
            try {
                const swatches = getSwatchesSync(img);

                if (swatches.Vibrant && swatches.LightMuted && swatches.DarkMuted) {
                    const bg = swatches.Vibrant.color.css();
                    const txt = swatches.DarkMuted.bodyTextColor.css();
                    const rgbaColor = swatches.LightMuted.color.css().replace("rgb(", "rgba(").replace(")", ", 0.8)");

                    setOverlayColor(rgbaColor);
                    setTextBgColor(bg);
                    setTextColor(txt);
                }

            } catch (error) {
                console.warn("Renk analizi başarısız oldu:", imageUrl, error);
            }
        };

        img.onerror = () => {
            console.warn("Resim dosyası okunamadı veya bulunamadı:", imageUrl);
            setImageLoaded(true);
        }

        img.src = imageUrl;
    }, [imageUrl]);

    return (
        <div className="w-full h-full text-foreground overflow-hidden relative bg-slate-950">
            {/* 1. KATMAN: Büyütülmüş Bulanık Arka Plan */}
            <div
                className={`absolute inset-0 bg-cover bg-center blur-md scale-125 z-0 transition-opacity duration-1000 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* 2. KATMAN: Net Orijinal Resim */}
            <div
                className={`absolute inset-0 bg-contain bg-no-repeat bg-center z-10 transition-opacity duration-1000 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* 3. KATMAN: ColorThief %80 Opak Overlay */}
            <div
                className="absolute inset-0 z-[5] pointer-events-none transition-colors duration-1000 ease-in-out"
                style={{ backgroundColor: overlayColor }}
            />

            {/* 4. KATMAN: Metin */}
            <div className="w-full h-full flex items-end justify-center px-6 lg:px-10 pb-12 relative z-30">
                <div
                    className="max-w-4xl p-3.5 sm:p-4 rounded-xl drop-shadow-xl text-center transition-colors duration-1000 ease-in-out border border-white/15"
                    style={{ backgroundColor: textBgColor }}
                >
                    <p
                        className="text-sm md:text-lg text-white/95 max-w-4xl mx-auto drop-shadow-sm font-medium leading-relaxed"
                        style={{ color: textColor }}
                    >
                        {displayText}
                    </p>
                </div>
            </div>
        </div>
    );
};

/* HERO SKELETON BİLEŞENİ (GÖZ ALICI & DİNAMİK BİLİMSEL TEMALI) */
const HeroSkeleton = ({ loadingBadge = "Biochemreg Laboratory Loading..." }) => {
    return (
        <section className="relative w-full h-[70vh] bg-gradient-to-br from-[#0B1E2D] via-[#143B58] to-[#0A1A27] overflow-hidden flex flex-col justify-between select-none">
            {/* 1. Işıltılı Arka Plan Hüzmeleri (Ambient Glowing Orbs) */}
            <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-[100px] animate-hero-glow pointer-events-none" />
            <div className="absolute top-1/3 -right-32 w-[460px] h-[460px] rounded-full bg-[#1C547F]/30 blur-[120px] animate-hero-glow [animation-delay:1.5s] pointer-events-none" />
            <div className="absolute -bottom-32 left-1/4 w-[380px] h-[380px] rounded-full bg-blue-600/15 blur-[90px] animate-hero-glow [animation-delay:3s] pointer-events-none" />

            {/* 2. Dinamik Işık Dalgası Geçişi (Sweeping Shimmer Light) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full animate-hero-shimmer pointer-events-none" />

            {/* 3. Sol ve Sağ Cam Efektli (Liquid Glass) Gezinme Butonları Skeleton */}
            <div className="z-40 absolute left-4 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5 text-white/30" />
                </div>
            </div>
            <div className="z-40 absolute right-4 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white/30" />
                </div>
            </div>

            {/* 4. Merkezde Bilimsel & Biyokimya Temalı Göz Alıcı Yükleniyor Rozeti */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-20">
                <div className="relative flex items-center justify-center mb-4">
                    {/* Dönen ve titreşen ışık halkaları */}
                    <div className="absolute w-28 h-28 rounded-full bg-cyan-400/15 blur-xl animate-pulse" />
                    <div className="absolute w-20 h-20 rounded-full border border-cyan-400/30 border-dashed animate-spin [animation-duration:12s]" />
                    <div className="size-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/25 shadow-2xl flex items-center justify-center text-cyan-300">
                        <Sparkles className="w-7 h-7 animate-pulse text-cyan-300" />
                    </div>
                </div>

                {/* Cam Efektli Etiket */}
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                    <span className="text-xs font-medium text-white/90 tracking-wide font-sans">
                        {loadingBadge}
                    </span>
                </div>
            </div>

            {/* 5. Alt Kısım: Hero Metin Kutusu & Noktalar (Frosted Glass Skeleton) */}
            <div className="w-full flex flex-col items-center justify-center px-6 lg:px-10 pb-12 relative z-30">
                <div className="max-w-4xl w-full p-4 md:p-5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-3 relative overflow-hidden">
                    {/* Kart içi ışıltı dalgası */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-hero-shimmer" />

                    {/* Metin Çizgileri */}
                    <div className="h-4 w-4/5 mx-auto rounded-full bg-white/30" />
                    <div className="h-4 w-3/5 mx-auto rounded-full bg-white/20" />
                </div>

                {/* Pagination (Noktalar) Skeleton */}
                <div className="flex items-center gap-2 mt-5">
                    <div className="w-10 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] animate-pulse" />
                    <div className="w-10 h-1.5 rounded-full bg-white/20" />
                    <div className="w-10 h-1.5 rounded-full bg-white/20" />
                </div>
            </div>
        </section>
    );
};

/* ANA HERO BİLEŞENİ */
const Hero = () => {
    const { locale, t } = useLanguage();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isCancelled = false;

        const loadSlides = async () => {
            try {
                const res = await get({ endpoint: `sliders?locale=${locale}` });
                if (!isCancelled) {
                    if (res?.status && Array.isArray(res.sliders)) {
                        setSlides(res.sliders);
                    } else {
                        setSlides([]);
                    }
                }
            } catch (error) {
                console.warn("Slider verileri sunucudan yüklenemedi:", error);
                if (!isCancelled) {
                    setSlides([]);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        loadSlides();

        return () => {
            isCancelled = true;
        };
    }, [locale]);

    // Pagination Rengi için Slide Değişimini Dinleme
    const handleSlideChange = (swiper) => {
        const paginationEl = swiper.pagination.el;
        if (!paginationEl) return;

        const currentIndex = swiper.realIndex;
        if (true || currentIndex === 0 || currentIndex === 1) {
            paginationEl.classList.add('swiper-pagination-white');
        } else {
            paginationEl.classList.remove('swiper-pagination-white');
        }
    };

    if (loading) {
        return <HeroSkeleton loadingBadge={t("hero.loading_badge", "Biochemreg Laboratory Loading...")} />;
    }

    if (!slides || slides.length === 0) {
        return null;
    }

    return (
        <section className="relative w-full h-[70vh] bg-background">
            <style dangerouslySetInnerHTML={{ __html: customSwiperStyles }} />

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={slides.length > 1}
                grabCursor={true}
                autoplay={slides.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
                navigation={{
                    nextEl: "#hero-next-btn",
                    prevEl: "#hero-prev-btn",
                }}
                pagination={{
                    el: ".swiper-pagination",
                    clickable: true,
                }}
                onSlideChange={handleSlideChange}
                className="heroSwiper w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <HeroSlide slide={slide} locale={locale} />
                    </SwiperSlide>
                ))}

                {slides.length > 1 && (
                    <>
                        {/* LIQUID GLASS NAVİGASYON: SOL OK */}
                        <div className="z-40 absolute left-4 top-1/2 -translate-y-1/2">
                            <div className="button-wrap">
                                <button id="hero-prev-btn" className="!relative !left-0 !top-0 !w-auto !h-auto !mt-0 !bg-[rgba(255,255,255,0.3)]">
                                    <span>
                                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-black" />
                                    </span>
                                </button>
                                <div className="button-shadow"></div>
                            </div>
                        </div>

                        {/* LIQUID GLASS NAVİGASYON: SAĞ OK */}
                        <div className="z-40 absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="button-wrap">
                                <button id="hero-next-btn" className="!relative !right-0 !top-0 !w-auto !h-auto !mt-0 !bg-[rgba(255,255,255,0.3)]">
                                    <span>
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black" />
                                    </span>
                                </button>
                                <div className="button-shadow"></div>
                            </div>
                        </div>

                        {/* SWIPER NOKTALARI */}
                        <div className="swiper-pagination z-40"></div>
                    </>
                )}
            </Swiper>
        </section>
    );
};

export default Hero;