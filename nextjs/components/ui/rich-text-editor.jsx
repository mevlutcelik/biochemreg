"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Unlink,
    Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
    content = "",
    onChange,
    placeholder = "Zengin metin içeriği yazın...",
    className = "",
    minHeight = "min-h-[160px]",
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-2 hover:text-primary/80",
                },
            }),
        ],
        content: content || "",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (onChange) {
                // If it's just an empty paragraph, send empty string
                onChange(html === "<p></p>" ? "" : html);
            }
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3 text-xs leading-relaxed",
                    minHeight
                ),
            },
        },
    });

    // Update editor content when external content changes (e.g. form edit reset)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            if (!content) {
                editor.commands.setContent("");
            } else if (editor.getHTML() !== content) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return (
            <div className={cn("rounded-xl border border-input bg-background/50 p-4 min-h-[160px] animate-pulse", className)}>
                <span className="text-xs text-muted-foreground">Editör yükleniyor...</span>
            </div>
        );
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("Bağlantı URL'si girin:", previousUrl);

        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className={cn("rounded-xl border border-input bg-background overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all", className)}>
            {/* Toolbar (Shadcn UI Buttons) */}
            <div className="flex items-center gap-0.5 p-1.5 bg-muted/40 border-b border-border flex-wrap">
                {/* Heading 1 */}
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Başlık 1"
                >
                    <Heading1 className="w-3.5 h-3.5" />
                </Button>

                {/* Heading 2 */}
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Başlık 2"
                >
                    <Heading2 className="w-3.5 h-3.5" />
                </Button>

                {/* Heading 3 */}
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Başlık 3"
                >
                    <Heading3 className="w-3.5 h-3.5" />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Bold */}
                <Button
                    type="button"
                    variant={editor.isActive("bold") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer font-bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Kalın (Ctrl+B)"
                >
                    <Bold className="w-3.5 h-3.5" />
                </Button>

                {/* Italic */}
                <Button
                    type="button"
                    variant={editor.isActive("italic") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="İtalik (Ctrl+I)"
                >
                    <Italic className="w-3.5 h-3.5" />
                </Button>

                {/* Underline */}
                <Button
                    type="button"
                    variant={editor.isActive("underline") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Altı Çizili (Ctrl+U)"
                >
                    <UnderlineIcon className="w-3.5 h-3.5" />
                </Button>

                {/* Strikethrough */}
                <Button
                    type="button"
                    variant={editor.isActive("strike") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Üstü Çizili"
                >
                    <Strikethrough className="w-3.5 h-3.5" />
                </Button>

                {/* Code */}
                <Button
                    type="button"
                    variant={editor.isActive("code") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer font-mono"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Satır İçi Kod"
                >
                    <Code className="w-3.5 h-3.5" />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Bullet List */}
                <Button
                    type="button"
                    variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Madde İşaretli Liste"
                >
                    <List className="w-3.5 h-3.5" />
                </Button>

                {/* Ordered List */}
                <Button
                    type="button"
                    variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numaralı Liste"
                >
                    <ListOrdered className="w-3.5 h-3.5" />
                </Button>

                {/* Blockquote */}
                <Button
                    type="button"
                    variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Alıntı"
                >
                    <Quote className="w-3.5 h-3.5" />
                </Button>

                {/* Horizontal Rule */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Yatay Çizgi"
                >
                    <Minus className="w-3.5 h-3.5" />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                {/* Link */}
                <Button
                    type="button"
                    variant={editor.isActive("link") ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={setLink}
                    title="Bağlantı Ekle"
                >
                    <LinkIcon className="w-3.5 h-3.5" />
                </Button>

                {editor.isActive("link") && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer text-destructive"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        title="Bağlantıyı Kaldır"
                    >
                        <Unlink className="w-3.5 h-3.5" />
                    </Button>
                )}

                <div className="ml-auto flex items-center gap-0.5">
                    {/* Undo */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Geri Al (Ctrl+Z)"
                    >
                        <Undo className="w-3.5 h-3.5" />
                    </Button>

                    {/* Redo */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="İleri Al (Ctrl+Y)"
                    >
                        <Redo className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Editable Content */}
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichTextEditor;
