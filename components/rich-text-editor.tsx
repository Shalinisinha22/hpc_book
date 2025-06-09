"use client"

import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        apiKey="h210ojem1rw0w2zf57fqumn0myhzykwvpb6jpuxekattjr73"
        value={value}
        init={{
          height: 300,
          menubar: false,
          directionality: 'ltr',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
