"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}

export function Sidebar({
  menuGroups = [],
  footer,
  children,
}) {
  const { open, setOpen } = useSidebar()
  const isMobile = useIsMobile()
  const pathname = usePathname()

  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [pathname])

  return (
    <div className="bg-sidebar">
      {/* OVERLAY */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-3xs border-r border-sidebar-border bg-sidebar transition-transform duration-300",
          isMobile
            ? open
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between pl-6 pr-4 h-14 border-b border-sidebar-border">
          <Logo />

          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </Button>
          )}
        </div>

        {/* CONTENT (MULTI GROUP) */}
        <div className="flex flex-col gap-8 py-6 px-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">

              {group.title && (
                <h2 className="text-xs px-2 text-sidebar-foreground/60 uppercase tracking-wider">
                  {group.title}
                </h2>
              )}

              <nav className="flex flex-col gap-1">
                {group.links.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    item={item}
                  />
                ))}
              </nav>

            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 w-full border-t p-4">
          {footer}
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={cn(
          "transition-all duration-300 h-[calc(100vh-1rem)]",
          { "ml-64": !isMobile },
          "bg-background"
        )}
      >
        {/* TOPBAR */}
        {isMobile && (
          <header className="sticky top-0 z-30 border-b bg-background">
            <div className="flex h-14 items-center px-4">
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <Menu size={18} />
              </Button>

              <div className="ml-4">
                <Logo />
              </div>
            </div>
          </header>
        )}

        <div>
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarMenuItem({ item }) {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()

  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon

  const isActive = pathname === item.href

  if (hasChildren) {
    return (
      <>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant={expanded ? "outline" : "ghost"}
          className="w-full justify-start cursor-pointer"
        >
          {Icon && <Icon size={16} />}
          {item.title}

          <ChevronRight
            className="ml-auto transition-transform"
            size={16}
            style={{
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </Button>

        {expanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link key={child.title} href={child.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer"
                >
                  {child.title}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? "outline" : "ghost"}
        className="w-full justify-start cursor-pointer"
      >
        {Icon && <Icon size={16} />}
        {item.title}
      </Button>
    </Link>
  )
}