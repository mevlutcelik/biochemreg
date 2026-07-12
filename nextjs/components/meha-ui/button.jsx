import { forwardRef } from 'react';
import Loading from "@/components/meha-ui/loading";
import { cn } from "@/lib/utils";

export const Button = forwardRef((
    {
        children,
        type = 'primary',
        htmlType = 'button',
        size = 'md',
        scale = true,
        onClick,
        loading = false,
        loadingColor = 'black',
        loadingChildren = null,
        disabled = false,
        hideWhenLoading = true,
        circle = false,
        style,
        className,
        'aria-label': ariaLabel,
        ...rest
    },
    ref
) => {
    let defaultClassName;

    // Ortak sınıflar
    const baseClassNames = 'inline-flex items-center gap-3 font-medium rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:pointer-events-none select-none';

    // Button tipi için stil seçimi
    const typeClassNames = {
        text: 'py-1.5 px-2 text-primary hover:text-primary-hover hover:underline hover:underline-offset-2',
        outline: 'border border-sidebar-border text-foreground',
        ghost: 'text-primary hover:text-primary-hover hover:bg-primary/5',
        "ghost-gray": 'text-foreground hover:bg-muted',
        soft: 'bg-primary/5 text-primary hover:text-primary-hover hover:bg-primary/10',
        secondary: 'shadow-xs border border-sidebar-border bg-background text-foreground hover:text-foreground/90 hover:bg-muted',
        primary: 'shadow-md bg-primary text-background font-semibold'
    };

    defaultClassName = `${baseClassNames} ${typeClassNames[type] || typeClassNames.primary}`;

    // Boyutları eklemek
    const sizeClassNames = {
        text: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg'
        },
        circle: {
            xs: 'text-xs h-8 w-8 rounded-full! items-center justify-center',
            sm: 'text-sm h-9 w-9 rounded-full! items-center justify-center',
            md: 'text-base h-10 w-10 rounded-full! items-center justify-center',
            lg: 'text-lg h-11 w-11 rounded-full! items-center justify-center'
        },
        default: {
            xs: 'text-xs px-3 py-2 sm:py-0 min-h-8',
            sm: 'text-sm px-3.5 py-2 sm:py-0 min-h-9',
            md: 'text-base px-4 py-2.5 sm:py-0 min-h-10',
            lg: 'text-lg px-5 py-2.5 sm:py-0 min-h-11'
        }
    };

    // Apply size based on type
    if (circle) {
        defaultClassName += ` ${sizeClassNames.circle[size] || ''}`;
    } else {
        if (type === 'text') {
            defaultClassName += ` ${sizeClassNames.text[size] || ''}`;
        } else {
            defaultClassName += ` ${sizeClassNames.default[size] || ''}`;
        }
    }

    // Scale effect if enabled
    if (scale) {
        defaultClassName += ' active:scale-95';
    }

    // className birleştirme için cn utility kullan
    const finalClassName = cn(defaultClassName, className);
    const isDisabled = loading || disabled;

    return (
        <button
            ref={ref}
            type={htmlType}
            disabled={isDisabled}
            className={finalClassName}
            style={style}
            onClick={onClick}
            aria-label={ariaLabel || (circle && !children ? 'Button' : undefined)}
            aria-busy={loading ? 'true' : undefined}
            aria-disabled={isDisabled ? 'true' : undefined}
            {...rest}
        >
            {!loading ? children : (
                <>
                    <Loading color={loadingColor} size="xs" />
                    {!hideWhenLoading ? (loadingChildren || children) : null}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';