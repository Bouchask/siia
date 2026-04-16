import React, { createContext, useContext, useState, useCallback } from 'react';

const EditorContext = createContext();

export const useEditor = () => useContext(EditorContext);

export const EditorProvider = ({ initialBlocks = [], onChange, children }) => {
  const [blocks, setBlocks] = useState(initialBlocks?.length ? initialBlocks : [{ id: 'init', type: 'text', content: '' }]);

  const updateBlocks = useCallback((newBlocks) => {
    setBlocks(newBlocks);
    if (onChange) onChange(newBlocks);
  }, [onChange]);

  const addBlock = useCallback((block, index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, block);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const updateBlock = useCallback((id, updates) => {
    setBlocks(prevBlocks => {
      const updateRecursively = (blockArray) => {
        return blockArray.map(b => {
          if (b.id === id) return { ...b, ...updates };
          if (b.children) return { ...b, children: updateRecursively(b.children) };
          return b;
        });
      };
      const nextBlocks = updateRecursively(prevBlocks);
      if (onChange) onChange(nextBlocks);
      return nextBlocks;
    });
  }, [onChange]);

  const removeBlock = useCallback((id) => {
    const removeRecursively = (blockArray) => {
      return blockArray.filter(b => b.id !== id).map(b => {
        if (b.children) return { ...b, children: removeRecursively(b.children) };
        return b;
      });
    };
    updateBlocks(removeRecursively(blocks));
  }, [blocks, updateBlocks]);

  const moveBlock = useCallback((dragIndex, hoverIndex) => {
    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[dragIndex];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, draggedBlock);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  return (
    <EditorContext.Provider value={{ blocks, addBlock, updateBlock, removeBlock, moveBlock, updateBlocks }}>
      {children}
    </EditorContext.Provider>
  );
};