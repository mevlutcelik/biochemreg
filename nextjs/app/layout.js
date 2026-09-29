import {ThemeProvider} from "@/components/theme/theme-provider";
import CustomNextLoader from "@/components/CustomNextLoader";
import { Toaster } from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import { Figtree, Instrument_Serif } from 'next/font/google'
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

const figtree = Figtree({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const instrumentSerif = Instrument_Serif({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
});

import { LanguageProvider } from "@/context/LanguageContext";

export const metadata = {
    title: "Biochemreg",
    description: "Biochemreg",
};

export default function RootLayout({children}) {
    return (
        <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
        <body className={cn('antialiased', figtree.className, "selection:bg-black selection:text-white")} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
            <LanguageProvider>
                <CustomNextLoader/>
                {children}
                <Toaster />
            </LanguageProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
