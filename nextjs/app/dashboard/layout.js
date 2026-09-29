"use client"
import {
    Sidebar,
    SidebarProvider,
} from "@/components/meha-ui/sidebar"
import UserProvider from "@/components/UserProvider";

import {
    Compass,
    BookCheck,
    BookSearch,
    ContactRound,
    GraduationCap,
    Newspaper,
    Images,
    Link,
    MessageCircle,
    LayoutDashboard,
    Plane,
    Microscope,
    BadgeInfo,
    ClipboardList,
    GalleryThumbnails,
} from "lucide-react"
import SidebarFooter from "@/components/SidebarFooter";

export default function Layout({ children }) {
    return (
        <UserProvider>
            <SidebarProvider>
                <Sidebar
                    menuGroups={[
                        {
                            title: "YÖNETİM",
                            links: [
                                {
                                    title: "Yönetim Paneli",
                                    href: "/dashboard",
                                    icon: Compass,
                                },
                                {
                                    title: "Slider",
                                    href: "/dashboard/slider",
                                    icon: GalleryThumbnails,
                                },
                                {
                                    title: "Haber",
                                    icon: Newspaper,
                                    children: [
                                        { title: "Haberler", href: "/dashboard/news" },
                                        { title: "Haber Ekle", href: "/dashboard/news/add" },
                                    ],
                                },
                                {
                                    title: "Galeri",
                                    icon: Images,
                                    href: "/dashboard/gallery",
                                },
                                {
                                    title: "Yararlı Linkler",
                                    icon: Link,
                                    href: "/dashboard/useful-links",
                                },
                                {
                                    title: "Mesajlar",
                                    icon: MessageCircle,
                                    href: "/dashboard/messages",
                                },
                            ],
                        },
                        {
                            title: "AKADEMİK",
                            links: [
                                {
                                    title: "Yayınlar",
                                    icon: BookCheck,
                                    children: [
                                        { title: "Araştırma Makaleleri", href: "/dashboard/academy/research_articles" },
                                        { title: "Kitaplar", href: "/dashboard/academy/books" },
                                    ],
                                },
                                {
                                    title: "Araştırmalar",
                                    icon: BookSearch,
                                    children: [
                                        { title: "Yönetilen Projeler", href: "/dashboard/academy/research_projects" },
                                        { title: "Bilimsel İşbirlikçiler", href: "/dashboard/academy/scientific_collaborators" },
                                    ],
                                },
                            ],
                        },
                        {
                            title: "ÜYELER",
                            links: [
                                {
                                    title: "Laboratuvar Üyeleri",
                                    icon: ContactRound,
                                    href: "/dashboard/members/lab_members",
                                },
                                {
                                    title: "Mezunlar",
                                    icon: GraduationCap,
                                    href: "/dashboard/members/alumni",
                                },
                            ],
                        },
                        {
                            title: "BİYOYAZ",
                            links: [
                                {
                                    title: "Kurullar",
                                    icon: LayoutDashboard,
                                    children: [
                                        { title: "Başkanlar", href: "/dashboard/biyoyaz/presidents" },
                                        { title: "Öğretim Üyeleri", href: "/dashboard/biyoyaz/academic_staff" },
                                        { title: "Düzenleme Kurulu", href: "/dashboard/biyoyaz/editing_board" },
                                        { title: "Organizasyon Kurulu", href: "/dashboard/biyoyaz/organization_committee" },
                                    ],
                                },
                                {
                                    title: "Davetli Öğretim Üyeleri",
                                    icon: Plane,
                                    href: "/dashboard/biyoyaz/invited_faculty",
                                },
                                {
                                    title: "Bilimsel Program",
                                    icon: Microscope,
                                    children: [
                                        { title: "Etkinlik Programı", href: "/dashboard/biyoyaz/scientific_program" },
                                        { title: "Etkinlik Merkezi", href: "/dashboard/biyoyaz/event_center" },
                                    ],
                                },
                                {
                                    title: "Kayıt Olanlar",
                                    icon: ClipboardList,
                                    href: "/dashboard/biyoyaz/registered_participants",
                                },
                                {
                                    title: "Kayıt Bilgisi",
                                    icon: BadgeInfo,
                                    children: [
                                        { title: "Genel Kayıt Bilgisi", href: "/dashboard/biyoyaz/registration_info" },
                                        { title: "Başvuru Tarihleri", href: "/dashboard/biyoyaz/application_dates" },
                                        { title: "Ödeme Bilgisi", href: "/dashboard/biyoyaz/payment_info" },
                                        { title: "Kayıt Formu", href: "/dashboard/biyoyaz/registration_form" },
                                        { title: "Barınma İmkanları", href: "/dashboard/biyoyaz/accommodation" },
                                        { title: "Ulaşım", href: "/dashboard/biyoyaz/transportation" },
                                    ],
                                },
                            ],
                        },
                    ]}
                    children={children}
                    footer={<SidebarFooter />}
                />
            </SidebarProvider>
        </UserProvider>
    )
}