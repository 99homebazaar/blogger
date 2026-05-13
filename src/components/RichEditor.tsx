"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

const Btn = ({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) => (
  <button type="button" title={title} onClick={onClick}
    className={`px-2 py-1 rounded text-sm transition-colors ${active ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}>
    {children}
  </button>
);

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noreferrer" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Write here... or paste from Word / Google Docs" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "tiptap-editor" },
    },
  });

  // sync external value changes (e.g. edit page load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-gray-100 bg-gray-50">
        <Btn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><b>B</b></Btn>
        <Btn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>I</i></Btn>
        <Btn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><u>U</u></Btn>
        <Btn title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><s>S</s></Btn>
        <span className="w-px bg-gray-200 mx-1" />
        <Btn title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>H1</Btn>
        <Btn title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Btn>
        <Btn title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Btn>
        <span className="w-px bg-gray-200 mx-1" />
        <Btn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</Btn>
        <Btn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</Btn>
        <span className="w-px bg-gray-200 mx-1" />
        <Btn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>" "</Btn>
        <Btn title="Link" onClick={setLink} active={editor.isActive("link")}>🔗</Btn>
        <Btn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>🔗✕</Btn>
        <span className="w-px bg-gray-200 mx-1" />
        <Btn title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>≡</Btn>
        <Btn title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>≡</Btn>
        <span className="w-px bg-gray-200 mx-1" />
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>↩</Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>↪</Btn>
        <Btn title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>✕</Btn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
