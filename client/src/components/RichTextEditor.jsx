import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const customConfig = {
    placeholder: placeholder || 'Start writing your announcement...',
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'underline', 'link', '|',
        'bulletedList', 'numberedList', 'blockQuote', '|',
        'insertTable', 'imageUpload', 'mediaEmbed', '|',
        'alignment', '|',
        'undo', 'redo'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn', 'tableRow', 'mergeTableCells',
        'tableProperties', 'tableCellProperties'
      ]
    },
    image: {
      toolbar: [
        'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|',
        'toggleImageCaption', 'imageTextAlternative'
      ]
    }
  };

  return (
    <div className="ck-editor-container">
      <CKEditor
        editor={ClassicEditor}
        config={customConfig}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style>{`
        .ck-editor__editable_inline {
          min-height: 400px;
          border-bottom-left-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
        }
        .ck.ck-editor__main>.ck-editor__editable {
          background: white;
        }
        .ck.ck-toolbar {
          border-top-left-radius: 12px !important;
          border-top-right-radius: 12px !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        /* Fix for table borders in editor */
        .ck-content table {
          border-collapse: collapse;
          width: 100%;
        }
        .ck-content table td, .ck-content table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
