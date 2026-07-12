"use client";
import { useState } from "react";
import useToken from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";

export const useLogoutWithDialog = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLogout, setIsLogout] = useState(false);

    const token = useToken("token");
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await post({
                endpoint: "auth/logout",
                bearerToken: token,
            });

            if (response.status) {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                setIsLogout(true);
                router.push('/');
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const showDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    return {
        open,
        loading,
        isLogout,
        showDialog,
        closeDialog,
        handleLogout,
    };
};