import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageRowNodeView from './ImageRowNodeView';

export const ImageRowExtension = Node.create({
  name: 'imageRow',
  group: 'block',
  content: 'image+', // Allows one or more image nodes inside
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="image-row"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-row', class: 'image-row-block' }), 0];
  },

  addCommands() {
    return {
      insertImageRow: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [{ type: 'image', attrs: { src: 'https://placehold.co/600x400?text=Empty+Image' } }],
        });
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageRowNodeView);
  },
});
