import { Node, mergeAttributes } from '@tiptap/core';

// 1. Individual Column Node
export const Column = Node.create({
  name: 'column',
  content: 'block+', // Can contain any block (text, heading, image)
  isolating: true,
  
  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column', class: 'editor-column' }), 0];
  },
});

// 2. Column Group (The Container Row)
export const ColumnGroup = Node.create({
  name: 'columnGroup',
  group: 'block',
  content: 'column+', // Must contain one or more columns
  draggable: true,
  
  addAttributes() {
    return {
      columns: {
        default: 2,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column-group"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column-group', class: 'editor-column-group' }), 0];
  },

  addCommands() {
    return {
      insertColumns: (count = 2) => ({ commands }) => {
        const columns = Array.from({ length: count }, () => ({ type: 'column', content: [{ type: 'paragraph' }] }));
        return commands.insertContent({
          type: this.name,
          attrs: { columns: count },
          content: columns,
        });
      },
    };
  },
});
