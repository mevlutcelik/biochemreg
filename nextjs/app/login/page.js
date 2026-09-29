"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import { Button as Button2 } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/lib/sweetAlert";
import { Logo } from "@/components/meha-ui/logo";
import { toast } from "sonner"
import Image from "next/image";
import Loading from "@/components/meha-ui/loading";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App Name";

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

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
				const expirationDate = new Date();
				expirationDate.setFullYear(expirationDate.getFullYear() + 10);

				document.cookie = `token=${response.token}; path=/; expires=${expirationDate.toUTCString()};`;

				setMessage({ status: response.status, message: response.message });
				router.push("/dashboard");
			} else {
				setMessage({ status: response.status, message: response.message });
			}
		} catch (error) {
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
												toast.message('Bu özellik yakında eklenecektir.',
													{
														description: 'Şifremi unuttum özelliği yakında eklenecektir. Lütfen iletişim için IT departmanıyla görüşün.',
														position: 'top-right'
													});
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
							</div>
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