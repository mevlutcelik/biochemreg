"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TeamDetailRedirect() {
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        if (params?.id) {
            router.replace(`/members/${params.id}`);
        } else {
            router.replace("/members");
        }
    }, [params, router]);

    return null;
}
