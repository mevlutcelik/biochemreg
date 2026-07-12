import { cn } from "@/lib/utils";

export default function Loading({size = 'md', color = 'foreground'}) {
    const sizeClasses = {
        xs: 'loading-xs',
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg'
    };

    const colorClasses = {
        black: 'text-black',
        white: 'text-white',
        foreground: 'text-foreground',
        primary: 'text-bestjobsgermany',
        muted: 'text-muted-foreground'
    };

    return (
        <span className={cn(
            'loading loading-spinner',
            sizeClasses[size] || sizeClasses.md,
            colorClasses[color] || colorClasses.foreground
        )}></span>
    );
}
