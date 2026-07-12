import Image from "next/image";
import Link from "next/link";

export const Logo = (props) => (
    <Link href="/">
        <Image priority className="h-4 w-auto dark:invert dark:hue-rotate-180" src='/logo.png' alt='Logo' width={300} height={160} {...props} />
    </Link>
);