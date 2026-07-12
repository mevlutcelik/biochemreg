"use client";
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

export const LogoutDialog = ({ open, onClose, onConfirm, loading, isLogout, title, description }) => {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>İptal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading || isLogout}
                        className="!bg-destructive !text-white hover:!bg-destructive/90 outline-none focus:ring-2 focus:!ring-destructive focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:!bg-destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Çıkış yapılıyor
                            </>
                        ) : (
                            "Çıkış Yap"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
