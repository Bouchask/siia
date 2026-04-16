import React from 'react';
import { EditorProvider } from './EditorContext';
import BlockEditor from './BlockEditor';

const CustomBlockEditor = ({ initialBlocks, onChange }) => {
  return (
    <EditorProvider initialBlocks={initialBlocks} onChange={onChange}>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '400px' }}>
        <BlockEditor />
      </div>
    </EditorProvider>
  );
};

export default CustomBlockEditor;