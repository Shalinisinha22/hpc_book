"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
} from "lucide-react"

interface RichTextEditorProps {
  id?: string
  value?: string
  onChange?: (content: string) => void
}

export function RichTextEditor({ id, value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || ""
    }
  }, [value])

  const handleContentChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }

  const handleLinkInsert = () => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const handleImageInsert = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        <div className="flex items-center space-x-1 mr-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("bold")} className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
            <span className="sr-only">Bold</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("italic")} className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
            <span className="sr-only">Italic</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("underline")}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
            <span className="sr-only">Underline</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("justifyLeft")}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
            <span className="sr-only">Align Left</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("justifyCenter")}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
            <span className="sr-only">Align Center</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("justifyRight")}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
            <span className="sr-only">Align Right</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("insertUnorderedList")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Bullet List</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand("insertOrderedList")}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
            <span className="sr-only">Numbered List</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleLinkInsert} className="h-8 w-8 p-0">
            <Link className="h-4 w-4" />
            <span className="sr-only">Insert Link</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleImageInsert} className="h-8 w-8 p-0">
            <ImageIcon className="h-4 w-4" />
            <span className="sr-only">Insert Image</span>
          </Button>
        </div>
      </div>

      <div
        id={id}
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none"
        onInput={handleContentChange}
        onBlur={handleContentChange}
      />

      <div className="bg-gray-50 border-t p-2 text-xs text-gray-500 flex justify-between">
        <div>File Edit View Insert Format Tools Table Help</div>
        <div>0 WORDS. POWERED BY TINY</div>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default RichTextEditor
