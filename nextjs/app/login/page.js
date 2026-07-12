"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import { Button as Button2 } from "@/components/ui/button"
import { Button } from "@/components/meha-ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, CircleCheck, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/lib/sweetAlert";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/meha-ui/logo";
import { toast } from "sonner"
import Image from "next/image";
import Loading from "@/components/meha-ui/loading";

export default function DashboardLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App Name";

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null); // Önceki mesajları temizle

        try {
            const response = await post({
                endpoint: "auth/login",
                body: { email, password },
            });

            Toast.fire({
                icon: response.status ? "success" : "error",
                title: response.message,
            });

            if (response.status) {
                // Token'ı sınırsız süreli cookie olarak ayarlayın
                const expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 10); // 10 yıl geçerlilik

                document.cookie = `token=${response.token}; path=/; expires=${expirationDate.toUTCString()};`;

                setMessage({ status: response.status, message: response.message });
                router.push("/dashboard");
            } else {
                setMessage({ status: response.status, message: response.message });
            }
        } catch (error) {
            // API hatası - kullanıcıya uygun mesaj göster
            const errorMessage = error.message || "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.";
            setMessage({ status: false, message: errorMessage });
            Toast.fire({
                icon: "error",
                title: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-4 md:p-10">
                <div className='flex items-center justify-between'>
                    <div className="flex justify-center gap-2 md:justify-start">
                        <div className='text-primary absolute top-2 left-2 md:top-6 md:left-6'>
                            <Logo />
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm sm:max-w-lg">
                        <form onSubmit={handleLogin} className="flex flex-col gap-12">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div>
                                    <h1 className="font-heading text-4xl">{APP_NAME}</h1>
                                </div>
                                <p className="text-balance text-sm text-muted-foreground">
                                    {APP_NAME} uygulamasına giriş yapmak için eposta adresinizi ve şifrenizi girin
                                </p>
                            </div>
                            {message && (
                                <Alert variant={message.status ? "success" : "destructive"}>
                                    {message.status ? (<CircleCheck className="h-4 w-4" />) : (
                                        <CircleAlert className="h-4 w-4" />)}
                                    <AlertTitle>{message.status ? "Başarılı" : "Hata"}</AlertTitle>
                                    <AlertDescription>{message.message}</AlertDescription>
                                </Alert>
                            )}
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={`ornek@${APP_NAME.toLowerCase()}.com`}
                                        required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Şifre</Label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // sweetalert uyarı
                                                toast.message('Bu özellik yakında eklenecektir.',
                                                    {
                                                        description: 'Şifremi unuttum özelliği yakında eklenecektir. Lütfen iletişim için IT departmanıyla görüşün.',
                                                        position: 'top-right'
                                                    });
                                                // Toast.fire({
                                                //     icon: 'info',
                                                //     title: 'Şifremi unuttum özelliği yakında eklenecektir. Lütfen iletişim için IT departmanıyla görüşün.'
                                                // });
                                            }}
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Şifremi unuttum
                                        </button>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required />
                                </div>
                                <Button2 type="submit" size="lg" disabled={loading} className="cursor-pointer">
                                    {loading && <Loading size="xs" color="white" />}
                                    {!loading && "Giriş Yap"}
                                </Button2>
                                {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div> */}
                                {/* <Button type="secondary" size="sm" className="justify-center">
                                    <div className="w-4 h-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </div>
                                    Login with GitHub
                                </Button> */}
                            </div>
                            {/* <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a href="#" className="underline underline-offset-4">
                                    Sign up
                                </a>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    width={2000}
                    height={2000}
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
                />
            </div>
        </div>
    );
}