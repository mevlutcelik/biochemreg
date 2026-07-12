'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GhostIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (typeof window !== "undefined" && document.referrer && document.referrer.includes(window.location.origin)) {
            setCanGoBack(true);
        }
    }, []);

    const handleGoBack = () => {
        if (canGoBack) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="flex min-h-[50vh] w-full h-dvh items-center justify-center bg-background px-2 sm:px-4 sm:py-12 lg:px-8">
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-background to-muted p-8">
                <div className="absolute right-0 top-0 h-32 w-32 rotate-45 bg-gradient-to-br from-primary/20 to-primary/10" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-4 flex items-center justify-center rounded-full bg-muted p-3">
                        <GhostIcon className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
                    <h2 className="mb-4 text-2xl font-semibold">Sayfa Bulunamadı</h2>
                    <p className="mb-8 max-w-md text-muted-foreground">
                        Üzgünüz, aradığınız sayfayı bulamadık. Sayfa taşınmış olabilir ya da artık mevcut değil.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button variant="outline" className="gap-2" onClick={handleGoBack}>
                            <ArrowLeft className="h-4 w-4" />
                            Geri Dön
                        </Button>
                        <Link href='/'>
                            <Button className="gap-2">
                                <HomeIcon className="h-4 w-4" />
                                Anasayfa'ya Dön
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
